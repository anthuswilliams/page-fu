import queryString from 'query-string';
import history from './history';
import ensureNextIsCalled from './ensureNextIsCalled';

/**
 * Inject named parameters and query parameters as "[[props | withProps@props]]"
 * into your route.
 *
 *     import { withProps } from 'page-fu'
 *     import page from 'page'
 *
 *     const Route = withProps({
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
 */
export default function withProps(instance) {
  const { enter = Function.prototype } = instance;
  const exit = ensureNextIsCalled(instance.exit)

  let stopListeningToHistory;

  return Object.assign({}, instance, {
    /**
     * @property {Object} [props={}]
     * @property {Object.<String, String>} props.params
     *           The parameters that the route was activated with (that is, what's
     *           found in `ctx.params` from page's context.)
     *
     * @property {Object.<String, String>} props.query
     *           The current query parameters.
     *
     * @property {Object} props.location
     * @property {String} props.location.pathname
     *
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
      exit.call(this, ctx, err => {
        stopListeningToHistory();
        stopListeningToHistory = null;

        this.props = null;

        next(err);
      });
    },
  });
}