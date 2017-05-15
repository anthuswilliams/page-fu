import page from 'page';
import Router from './Router';
import Route from './Route';

/**
 * @module page-fu
 * @preserveOrder
 *
 * The package exports.
 *
 * ### How to use
 *
 * If you're new to ES6 modules and packages, this section will briefly explain
 * how to use the package (and this reference.)
 *
 * Every "symbol" that is listed in this reference is an "export" of the package
 * which you can then import using the `import` statement. For example, to pull
 * in the `Route`, `start` and `stop` symbols:
 *
 *     import { Route, start, stop } from 'page-fu';
 *
 * That's it!
 */

/**
 * @memberOf page-fu
 * @property {Router} Router
 */
export { Router };

/**
 * @memberOf page-fu
 * @property {Route} Route
 */
export { Route };

/**
 * @memberOf page-fu
 *
 * Start the router.
 *
 * @param {Object} options
 *        [page.js start()](https://visionmedia.github.io/page.js/#pageoptions)
 *        options.
 */
export function start(options) {
  page.start(options);
}

/**
 * @memberOf page-fu
 *
 * Stop the router. Any calls to routing methods beyond this stage will be
 * ignored.
 */
export function stop() {
  page.stop();
}

/**
 * @memberOf page-fu
 * @static
 * @type {Function} redirectTo
 *
 * Forwards to [[Router.redirectTo]]
 */
export const redirectTo = forwardToRouter('redirectTo');

/**
 * @memberOf page-fu
 * @static
 * @type {Function} replaceQuery
 *
 * Forwards to [[Router.replaceQuery]]
 */
export const replaceQuery = forwardToRouter('replaceQuery');

/**
 * @memberOf page-fu
 * @static
 * @type {Function} transitionTo
 *
 * Forwards to [[Router.transitionTo]]
 */
export const transitionTo = forwardToRouter('transitionTo');

/**
 * @memberOf page-fu
 * @static
 * @type {Function} updateQuery
 *
 * Forwards to [[Router.updateQuery]]
 */
export const updateQuery = forwardToRouter('updateQuery');

/**
 * @memberOf page-fu
 * @property {createBoundInterface} createBoundInterface
 */
export { createBoundInterface } from './createBoundInterface';
export { createProps } from './createProps';
export { createState } from './createState';
export { exposeRoutingAPIs } from './exposeRoutingAPIs';
export { history } from './history';
export { installActivationGuard } from './installActivationGuard';
export { morphIntoObject } from './morphIntoObject';

function forwardToRouter(fnName) {
  return function() {
    return Router[fnName].apply(null, arguments);
  }
}