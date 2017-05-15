import queryString from 'query-string';
import history from './history';
import ensureNextIsCalled from './ensureNextIsCalled';

/**
 * @module
 *
 * Inject named parameters and query parameters as "[[props |
 * createProps~Props]]" into your route.
 *
 *     import { createProps } from 'page-fu'
 *     import page from 'page'
 *
 *     const Route = createProps({
 *       enter() {
 *         console.log(this.props.params)
 *         console.log(this.props.query)
 *       },
 *
 *       queryParamsDidChange() {
 *         console.log('woah!');
 *       }
 *     })
 *
 *     page('/users/:userId', Route.enter)
 *     page.exit('/users/:userId', Route.exit)
 *
 *     location.hash = '#/users/1?nameFilter=a'
 *
 *     // => { userId: "1" }
 *     // => { nameFilter: "a" }
 *
 *     location.hash = '#/users/1?nameFilter=b'
 *
 *     // => "woah!"
 *
 *
 * @param {Object} route
 * @return {Object}
 *
 * @typedef {createProps~Props}
 *          A map of props computed from page's context and the URL that
 *          the route will be injected with.
 *
 * @property {Object.<String, String>} params
 *           The parameters that the route was activated with (that is, what's
 *           found in `ctx.params` from page's context.)
 *
 * @property {Object.<String, String>} query
 *           The current query parameters.
 *
 * @property {Object} location
 * @property {String} location.pathname
 *
 */
export default function createProps(instance) {
  const { enter = Function.prototype, exit = Function.prototype } = instance;

  let stopListeningToHistory;

  return Object.assign({}, instance, {

    /**
     * @property {createProps~Props} [props={}]
     */
    props: null,

    /**
     * @method
     *
     * A hook that will be invoked when the query parameters change through
     * calls to [[Router.updateQuery]] or [[Router.replaceQuery]].
     */
    queryParamsDidChange: instance.queryParamsDidChange || Function.prototype,

    enter(ctx, next) {
      stopListeningToHistory = history.listen(location => {
        this.props.query = queryString.parse(location.search);
        this.queryParamsDidChange();
      });

      this.props = {
        params: ctx.params,
        query: queryString.parse(ctx.querystring),
        location: {
          pathname: ctx.pathname,
        }
      };

      enter.call(this, ctx, next);
    },

    exit(ctx, next) {
      ensureNextIsCalled(exit.bind(this), ctx, (err) => {
        stopListeningToHistory();
        stopListeningToHistory = null;

        this.props = null;

        next(err);
      });
    },
  });
}
