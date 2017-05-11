import { flow } from 'lodash';
import { assert, sinonSuite } from './TestUtils';
import morphIntoObject from '../morphIntoObject';
import history from '../history';
import createProps from '../createProps';

describe('page-fu.createProps', function() {
  const sinon = sinonSuite(this);

  it('exposes `ctx.params` as `this.props.params` to the instance', function(done) {
    const context = {
      params: {
        a: '1'
      }
    };

    const subject = createProps({
      enter() {
        assert.equal(this.props.params, context.params);

        subject.exit({}, function(err) {
          done(err);
        })
      },

      exit() {},
    });

    subject.enter(context);
  });

  it('exposes `ctx.pathname` as `this.props.location.pathname` to the instance', function(done) {
    const context = {
      pathname: '/foo'
    };

    const subject = createProps({
      enter() {
        assert.equal(this.props.location.pathname, context.pathname);

        subject.exit(context, done);
      },
      exit() {}
    });

    subject.enter(context);
  });

  it('exposes `ctx.querystring` as `this.props.query` to the instance', function(done) {
    const context = {
      querystring: '?foo=bar'
    };

    const subject = createProps({
      enter() {
        assert.deepEqual(this.props.query, { foo: 'bar' });

        subject.exit(context, done);
      },
      exit() {}
    });

    subject.enter(context);
  });

  it('calls queryParamsDidChange on change', function(done) {
    const createRoute = flow([
      morphIntoObject,
      createProps,
    ])

    const route = createRoute({ queryParamsDidChange() {} });

    sinon.spy(route, 'queryParamsDidChange');

    route.enter({});

    history.push(history.location.pathname + '?foo=bar');

    assert.calledOnce(route.queryParamsDidChange)
    assert.deepEqual(route.props.query, { foo: 'bar' });

    route.exit({}, done);
  })

  it('does not call queryParamsDidChange if route is not active', function(done) {
    const createRoute = flow([
      morphIntoObject,
      createProps,
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
});
