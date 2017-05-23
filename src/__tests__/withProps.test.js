import { assert, sinonSuite, simulateDOMEnvironment } from './TestUtils';
import flow from '../flow';
import history from '../history';
import withHooks from '../withHooks';
import withProps from '../withProps';

describe('page-fu.withProps', function() {
  const sinon = sinonSuite(this);

  simulateDOMEnvironment(this);

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
    const context = { querystring: '?foo=bar' };
    window.location.search = '?ignored=1'

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

    history.push(window.location.pathname + '?foo=bar');

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
      history.push(window.location.pathname + '?foo=bar');

      assert.notCalled(route.queryParamsDidChange)

      done();
    });
  })
});
