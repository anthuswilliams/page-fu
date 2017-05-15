import { assert, sinonSuite } from './TestUtils';
import createState from '../createState';

describe('page-fu.createState', function() {
  const sinon = sinonSuite(this);

  it('starts with the initial state', function(done) {
    const initialState = {
      foo: 'bar'
    };

    const route = createState({
      getInitialState() {
        return Object.assign({}, initialState);
      },

      enter() {
        assert.deepEqual(this.state, initialState)

        done();
      },
    });

    route.enter({})
  })

  it('lets me transition the state', function(done) {
    const route = createState({
      getInitialState() {
        return { a: 1 };
      },

      enter() {
        this.setState({
          a: this.state.a + 1
        })

        assert.equal(this.state.a, 2);

        done();
      },
    });

    route.enter({})
  });

  it('invokes stateDidChange on change', function() {
    const route = createState({
      stateDidChange() {},
    });

    route.enter({})

    sinon.spy(route, 'stateDidChange');
    route.setState({ foo: 'bar' });

    assert.calledOnce(route.stateDidChange)
  });

  it('does not invoke stateDidChange upon entering', function(done) {
    const stateDidChange = sinon.spy(function() {});
    const route = createState({
      stateDidChange,
    });

    route.enter({}, function() {})

    assert.notCalled(stateDidChange)

    done();
  });
});
