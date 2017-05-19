import { flow } from 'lodash';
import { assert, sinonSuite, pageSuite } from './TestUtils';
import history from '../history';
import withHooks from '../withHooks';
import withProps from '../withProps';

describe('page-fu.withProps', function() {
  const sinon = sinonSuite(this);

  it('exposes `ctx.params` as `this.props.params` to the instance', function(done) {
    const context = {
      params: {
        a: '1'
      }
    };

    const subject = withProps({
      enter() {
        assert.equal(this.props.params, context.params);

        subject.exit({}, function(err) {
          done(err);
        })
      },

      exit(ctx, next) { next() },
    });

    subject.enter(context);
  });

  it('exposes `ctx.pathname` as `this.props.location.pathname` to the instance', function(done) {
    const context = {
      pathname: '/foo'
    };

    const subject = withProps({
      enter() {
        assert.equal(this.props.location.pathname, context.pathname);

        subject.exit(context, done);
      },
      exit(ctx, next) { next() },
    });

    subject.enter(context);
  });

  it('exposes `ctx.querystring` as `this.props.query` to the instance', function(done) {
    const context = {
      querystring: '?foo=bar'
    };

    const subject = withProps({
      enter() {
        assert.deepEqual(this.props.query, { foo: 'bar' });

        subject.exit(context, done);
      },
      exit(ctx, next) { next() },
    });

    subject.enter(context);
  });

  it('calls queryParamsDidChange on change of query', function(done) {
    const createRoute = flow([
      withHooks,
      withProps,
    ])

    const route = createRoute({ queryParamsDidChange: sinon.spy(() => {}) });

    route.enter({});

    history.push(history.location.pathname + '?foo=bar');

    assert.calledOnce(route.queryParamsDidChange)
    assert.deepEqual(route.props.query, { foo: 'bar' });

    route.exit({}, done);
  })

  it('does not call queryParamsDidChange if route is not active', function(done) {
    const createRoute = flow([
      withHooks,
      withProps,
    ])

    const route = createRoute({ queryParamsDidChange() {} });

    sinon.spy(route, 'queryParamsDidChange');

    route.enter({}, function() {});

    route.exit({}, function() {
      history.push(history.location.pathname + '?foo=bar');

      assert.notCalled(route.queryParamsDidChange)

      done();
    });
  })

  describe('prop changes', function() {
    let AnimalRoute;

    const page = pageSuite(this, {
      draw() {
        AnimalRoute = withProps({
          enter() {
            console.log('animal entered!', this.props);
          },

          queryParamsDidChange() {
            console.log('animal query changed!', this.props.query)
          },

          exit() {
            console.log('animal exited!', this.props)
          }
        })

        page('/animals/:id', AnimalRoute.enter.bind(AnimalRoute));
        page.exit('/animals/:id', AnimalRoute.exit.bind(AnimalRoute));
      }
    })

    it('what happens on prop change?', function() {
      page('/animals/1')
      page('/animals/2')
    })
  })
});
