import withState from './withState';
import withProps from './withProps';
import withFirstClassMethods from './withFirstClassMethods';
import withRoutingAPIs from './withRoutingAPIs';
import withAtomicity from './withAtomicity';
import withHooks from './withHooks';
import flow from './flow';

/**
 * @module Route
 * @type {Function}
 *
 * Create a "route handler" equipped with all the capabilities provided by
 * page-fu:
 *
 * - state management via [[withState]]
 * - routing props via [[withProps]]
 * - [[atomicity | withAtomicity]]
 * - [[first-class functions | withFirstClassMethods]] for convenience
 * - direct access to [[routing APIs | withRoutingAPIs]] for convenience
 * - good manners via [[withHooks]]
 *
 * `Route` embraces the simplicity of page.js and its middleware architecture in
 * that it's just a pipeline of functions that your route handler specification
 * goes through and then comes out of augmented with super powers.
 *
 * Under the hoods, this is the definition of the `Route` function (at the time
 * of writing, anyway):
 *
 *     flow([
 *       withHooks,
 *       withState,
 *       withProps,
 *       withRoutingAPIs,
 *       withAtomicity,
 *       withFirstClassMethods
 *     ])
 *
 * If you don't care about one or another of the decorators provided by default,
 * you are free to create your own generator by picking the decorators that you
 * want and [composing](https://lodash.com/docs/4.17.4#flow) them.
 *
 * **Basic usage example**
 *
 *     import { Route } from 'page-fu';
 *     import page from 'page';
 *
 *     const UserRoute = Route()
 *
 *     page('/users/:userId', UserRoute.enter);
 *     page.exit('/users/:userId', UserRoute.exit);
 *
 * If this example looked silly to you (it probably did!) then you may want to
 * take a look at a [[more complete example | ../doc/examples.md]].
 *
 * @param {Object} spec
 *        Your route definition.
 *
 * @return {Route}
 *         The route handler with the APIs you defined in the spec as well as
 *         all the APIs and properties exposed by the decorators.
 */
export default flow([
  withHooks,
  withState,
  withProps,
  withRoutingAPIs,
  withAtomicity,
  withFirstClassMethods,
]);