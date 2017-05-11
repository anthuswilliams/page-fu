import page from 'page';
import Router from './Router';

export { default as Router } from './Router';
export { default as Route } from './Route';

/**
 * @alias Router.redirectTo
 */
export const redirectTo = forwardToRouter('redirectTo');

/**
 * @alias Router.replaceQuery
 */
export const replaceQuery = forwardToRouter('replaceQuery');

/**
 * @alias Router.transitionTo
 */
export const transitionTo = forwardToRouter('transitionTo');

/**
 * @alias Router.updateQuery
 */
export const updateQuery = forwardToRouter('updateQuery');

/**
 * Scan all screens for routes and start the router.
 *
 * @param {Object} options
 *        page.js start() options.
 */
export function start(options) {
  page.start(options);
}

/**
 * Stop the router. Any calls to routing methods beyond this stage will be
 * ignored.
 */
export function stop() {
  page.stop();
}

function forwardToRouter(fnName) {
  return function() {
    return Router[fnName].apply(null, arguments);
  }
}