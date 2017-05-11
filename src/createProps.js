import queryString from 'query-string';
import history from './history';
import ensureNextIsCalled from './ensureNextIsCalled';

export default function createProps(instance) {
  const { enter, exit } = instance;

  let stopListeningToHistory;

  return Object.assign({}, instance, {
    /**
     * @lends Route
     *
     * @property {Object} props
     * @property {Object} props.params
     *           The parameters that the route was activated with.
     *
     * @property {Object} props.query
     *           The current query parameters.
     */
    props: null,

    /**
     * @lends Route
     * @property {Function} queryParamsDidChange
     *
     * A callback to invoke when the query parameters have changed through calls
     * to [[updateQuery]] or [[replaceQuery]].
     */
    queryParamsDidChange: instance.queryParamsDidChange || Function.prototype,

    /**
     * The `enter` routine that gets called when the route is activated.
     *
     * @param {page.Context} ctx
     * @param {Function} next
     *        Call this if you do not want to activate the route and instead
     *        forward to the next one.
     */
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

    /**
     * The routine that gets called when the route is about to become
     * deactivated.
     *
     * @param  {page.Context}   ctx
     *         page.js context object.
     *
     * @param  {Function} next
     *         Function to invoke when you're done cleaning up. If you do not
     *         call this, the route will never be exited.
     */
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
