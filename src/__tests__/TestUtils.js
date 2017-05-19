import sinon from 'sinon';
import { assert } from 'chai';
import page from 'page';

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


export function pageSuite(mochaSuite, { draw }) {
  let callbacks, exits;

  mochaSuite.beforeEach(function() {
    global.window = {
      addEventListener() {},
      removeEventListener() {},
    };

    global.history = {
      pushState() {},
    };

    global.document = {
      addEventListener() {},
      removeEventListener() {},
    };

    callbacks = page.callbacks;
    exits = page.exits;

    page.callbacks = [];
    page.exits = [];
    page('/__hadouken__', () => {});

    draw();

    page.start({ dispatch: false, hashbang: true });
    page('/__hadouken__');
  })

  afterEach(function() {
    page('/__hadouken__');
    page.stop();
    page.callbacks = callbacks;
    page.exits = exits;

    delete global.window;
    delete global.history;
    delete global.document;
  });

  return page;
}