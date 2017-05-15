import { redirectTo, transitionTo, updateQuery, replaceQuery } from '../';

/**
 * @module
 *
 * A cute and simple decorator that allows direct access to the [[router |
 * Router]]'s primary routines.
 *
 * For example:
 *
 *     import { exposeRoutingAPIs } from 'page-fu';
 *
 *     export default exposeRoutingAPIs({
 *       enter() {
 *         this.transitionTo('/foo'); // => Router.transitionTo('/foo');
 *       }
 *     })
 *
 * @param {Object} route
 * @return {Object} route
 */
export default function exposeRoutingAPIs(instance) {
  return Object.assign({}, instance, {
    /**
     * @type {Function} redirectTo
     * Forwards to [[Router.redirectTo]]
     */
    redirectTo,

    /**
     * @type {Function} replaceQuery
     * Forwards to [[Router.replaceQuery]]
     */
    replaceQuery,

    /**
     * @type {Function} transitionTo
     * Forwards to [[Router.transitionTo]]
     */
    transitionTo,

    /**
     * @type {Function} updateQuery
     * Forwards to [[Router.updateQuery]]
     */
    updateQuery,
  });
}
