import page from 'page';
import discardFalseyValues from './discardFalseyValues';
import queryString from 'query-string';
import history from './history';

/**
 * @namespace PAMMRouting
 * @module Router
 */
const Router = {
  /**
   * Transition to a different page.
   *
   * @param  {String} pathname
   * @return {Promise}
   */
  transitionTo(pathname) {
    page(pathname);
  },

  /**
   * Transition to a different page and replace the current history entry.
   *
   * @param  {String} pathname
   * @return {Promise}
   */
  redirectTo(pathname) {
    page.redirect(pathname);
  },

  /**
   * Partially update the queryString.
   *
   * @param  {Object} partialQuery
   * @return {Promise}
   */
  updateQuery(partialQuery) {
    const nextQuery = Object.assign({}, queryString.parse(history.location.search), partialQuery);
    const withoutFalseys = discardFalseyValues(nextQuery);

    setQuery(withoutFalseys);
  },

  /**
   * Replace the queryString.
   *
   * @param  {Object} nextQuery
   * @return {Promise}
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