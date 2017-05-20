import { assert, sinonSuite, simulateDOMEnvironment } from './TestUtils';
import page from 'page';
import subject from '../Router';

describe('page-fu.Router', function() {
  const sinon = sinonSuite(this);

  simulateDOMEnvironment(this);

  beforeEach(function() {
    sinon.spy(window.history, 'replaceState')
  })

  it('forwards "transitionTo" to page.show()', function() {
    sinon.stub(page, 'show')

    subject.transitionTo('/foo')

    assert.calledWithExactly(page.show, '/foo');
  })

  it('forwards "redirectTo" to page.redirect()', function() {
    sinon.stub(page, 'redirect')

    subject.redirectTo('/foo')

    assert.calledWithExactly(page.redirect, '/foo');
  })

  describe('updateQuery', function() {
    it('partially adjusts the current queryString', function() {
      window.location.search = '?foo=1&bar=1&baz=1'

      subject.updateQuery({ foo: null, bar: '2' });

      assert.calledWith(window.history.replaceState, null, null, '?bar=2&baz=1')
    })
  })
  describe('replaceQuery', function() {
    it('replaces the queryString with the new query representation', function() {
      window.location.search = '?foo=1&bar=1'

      subject.replaceQuery({ foo: null });

      assert.calledWith(window.history.replaceState, null, null, '')
    })
  })
});
