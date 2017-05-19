import page from 'page';
import discardFalseyValues from './discardFalseyValues';
import queryString from 'query-string';
import history from './history';

/**
 * @module Router
 * @preserveOrder
 *
 * This module exposes APIs to perform routing side-effects via page.js.
 *
 * Normally you wouldn't want to reach out to this directly. A better approach
 * would be to restrict routing side-effects to your route handlers, in which
 * case they'd access these APIs through the decorations provided by
 * [[withRoutingAPIs]].
 *
 * However, in the case that you happen to need to interact with the router
 * outside of a handler's context, you can use these APIs.
 */
const Router = {
  /**
   * Transition to a different page.
   *
   * @param  {String} pathname
   * @return {void}
   */
  transitionTo(pathname) {
    page(pathname);
  },

  /**
   * Transition to a different page and replace the current history entry.
   *
   * @param  {String} pathname
   * @return {void}
   */
  redirectTo(pathname) {
    page.redirect(pathname);
  },

  /**
   * Partially update the queryString according to a set of rules:
   *
   * - any item that evaluates to `undefined`, `null`, or `false` will be
   *   removed from the queryString
   * - any item that already exists will be overriden with the next value
   *
   * If the behaviour of discarding "falseys" is undesired, look into using
   * [[.replaceQuery]] instead.
   *
   * @param  {Object} partialQuery
   *         A *partial* set of query parameters that will be combined with
   *         (or override) the existing ones.
   *
   * @return {void}
   */
  updateQuery(partialQuery) {
    const nextQuery = Object.assign({}, queryString.parse(history.location.search), partialQuery);
    const withoutFalseys = discardFalseyValues(nextQuery);

    setQuery(withoutFalseys);
  },

  /**
   * Replace the queryString fully with the next representation. `null` values
   * will be removed from the resulting queryString.
   *
   * @param  {Object} nextQuery
   *         Your query parameters.
   *
   * @return {void}
   */
  replaceQuery(nextQuery) {
    const withoutFalseys = Object.keys(nextQuery).reduce(function(map, key) {
      if (nextQuery[key] !== null) {
        map[key] = nextQuery[key];
      }

      return map;
    }, {});

    setQuery(withoutFalseys);
  },
}

function setQuery(nextQuery) {
  const nextQueryString = queryString.stringify(nextQuery);
  const { pathname } = history.location;
  const withQueryString = nextQueryString ?
    `${pathname}?${nextQueryString}` :
    pathname
  ;

  history.push(withQueryString);
}

export default Router;