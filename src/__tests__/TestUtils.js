import sinon from 'sinon';
import { assert } from 'chai';

sinon.assert.expose(assert, { prefix: "" });

export { assert };
export function sinonSuite(mochaSuite, options = {}) {
  let api = {};
  let sandbox;

  mochaSuite.beforeEach(function() {
    sandbox = sinon.sandbox.create({
      injectInto: api,
      properties: [ 'stub', 'spy', 'server', 'requests', 'match', 'clock' ],
      useFakeServer: options.useFakeServer !== false,
      useFakeTimers: options.useFakeTimers !== false,
    });
  });

  mochaSuite.afterEach(function() {
    sandbox.restore();
  });

  return api;
}
