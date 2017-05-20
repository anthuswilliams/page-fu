import { assert, sinonSuite } from './TestUtils';
import withRoutingAPIs from '../withRoutingAPIs';
import Router from '../Router';

describe('page-fu.withRoutingAPIs', function() {
  const sinon = sinonSuite(this);

  [
    'transitionTo',
    'redirectTo',
    'updateQuery',
    'replaceQuery',
  ].forEach(fn => {
    it(`forwards "${fn}" to Router.${fn}`, function() {
      const subject = withRoutingAPIs({});

      assert.equal(typeof subject[fn], 'function');

      sinon.stub(Router, fn);

      subject[fn]();

      assert.calledOnce(Router[fn]);
    })
  })
});
