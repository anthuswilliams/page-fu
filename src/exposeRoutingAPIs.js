import { redirectTo, transitionTo, updateQuery, replaceQuery } from '../';

export default function exposeRoutingAPIs(instance) {
  return Object.assign({}, instance, {
    /**
     * @lends Route
     * @see Router.redirectTo
     */
    redirectTo,

    /**
     * @lends Route
     * @see Router.replaceQuery
     */
    replaceQuery,

    /**
     * @lends Route
     * @see Router.transitionTo
     */
    transitionTo,

    /**
     * @lends Route
     * @see Router.updateQuery
     */
    updateQuery,
  });
}
