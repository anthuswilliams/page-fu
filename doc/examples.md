## Utilizing state & props

This is a more complete example that shows three of the decorators at work
together: [[state | withState]], [[props | withProps]], and the [[atomicity guard |
withAtomicity]].

```javascript
import page from 'page'
import { Route } from 'page-fu'
import React from 'react'
import ReactDOM from 'react-dom'
import { LoadingView, PatientView } from './components'

const asJSON = response => response.json();
const PatientRoute = Route({
  getInitialState() {
    return {
      domNode: document.body.appendChild(document.createElement('div')),
      patient: null,
    }
  },

  enter() {
    const { patientId } = this.props.params

    fetch(`/api/patients/${patientId}`).then(asJSON).then(payload => {
      if (this.isActive()) {
        this.setState({ patient: payload.patients[0] })
      }
    })

    this.render()
  },

  stateDidChange() {
    this.render()
  },

  exit() {
    // clean up our DOM artifacts
    ReactDOM.unmountComponentAtNode(this.state.domNode)
    this.state.domNode.remove()
  },

  render() {
    const { domNode, patient } = this.state

    if (!patient) {
      ReactDOM.render(<LoadingView />, domNode); 
    }
    else {
      ReactDOM.render(<PatientView patient={patient} />, domNode)
    }
  }
})

// register our route handler
page('/patients/:id', PatientRoute.enter)
page.exit('/patients/:id', PatientRoute.exit)
```

## Building a custom [[Route]]

Let's assume that for some reason we want to opt out of using one or some of
the default decorators provided by [[Route]], or maybe we want to extend it
with a new one. We're in luck because as `Route` is just a composition of
functions, we have the flexibility to do so.

In this example we'll add a new decorator that injects our route with a DOM
node (the implementation of which will be left for another example), and pipe
it along the [[withState]] and [[withProps]] decorators provided by page-fu:

```javascript
import { withState, withProps } from 'page-fu'
import { flow } from 'lodash'
import withDOMNode from './withDOMNode'

const WithStateAndProps = flow([ withState, withProps, withDOMNode ]);

// now you're free to use it just like { Route } from 'page-fu' !
const MyRoute = WithStateAndProps({
  enter() {
    console.assert(typeof this.props === 'object')
    console.assert(typeof this.state === 'object')
    console.assert(typeof this.domNode === 'object')
  }
})
```

## Creating a custom decorator

Building on the previous example, let's now look into the implementation
of such a `withDOMNode` decorator.

In all respects, it's just like a regular `page.js` middleware but with two
caveats we need to watch out for:

- the original `enter` and `exit` hooks must be called with the right context, `this`, and forwarded the same arguments they expect (`ctx, next`)
- we must ensure that the next `exit` in the chain is aware of its `next`
  callback, if it's not, we [[call it on its behalf | ensureNextIsCalled]]

```javascript
import { withState, withProps, ensureNextIsCalled } from 'page-fu'
import { flow } from 'lodash'

const withDOMNode = instance => {
  // grab a reference to the original enter & exit hooks so that we can
  // yield to them in our overrides:
  // 
  // Note that they may not always exist so don't assume anything!
  const enter = instance.enter || Function.prototype;

  // read more about this in the ensureNextIsCalled documentation page
  const exit = ensureNextIsCalled(instance.exit);

  // we can utilize the closure to guard our private state from the other
  // decorators and the handler itself too:
  let domNode;

  return Object.assign({}, instance, {
    enter(ctx, next) {
      // set up our state for this dispatch:
      domNode = document.createElement('div');

      // now yield to the next in chain:
      enter.call(this, ctx, next);
    },

    // any public APIs can go here:
    getDOMNode() {
      return domNode;
    },
    
    exit(ctx, next) {
      // wait for the rest of chain to clean up *before* we clean
      // up after ourselves:
      exit.call(this, ctx, err => {
        // now we clean up:
        domNode.remove();
        domNode = null;

        // and finally, let the next handler take over:
        next(err);
      });
    }
  })
};
```