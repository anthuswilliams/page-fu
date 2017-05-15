import createState from './createState';
import createProps from './createProps';
import createBoundInterface from './createBoundInterface';
import exposeRoutingAPIs from './exposeRoutingAPIs';
import installActivationGuard from './installActivationGuard';
import morphIntoObject from './morphIntoObject';
import { flow } from 'lodash';

/**
 * @module Route
 * @type {Function}
 *
 * Create a "route handler" equipped with all the capabilities provided by
 * page-fu:
 *
 * - state management via [[createState]]
 * - routing props via [[createProps]]
 * - exclusivity via the [[activation guard | installActivationGuard]]
 * - [[bound methods | createBoundInterface]] for convenience
 * - [[routing APIs | exposeRoutingAPIs]] for convenience
 * - enter and exit hooks via [[morphIntoObject]]
 *
 * `Route` embraces the simplicity of page.js and its middleware architecture in
 * that it's just a pipeline of functions, or _decorators_, that get applied to
 * your route handler specification and augments it with super powers.
 *
 * Under the hoods, this is the definition of the `Route` function (at the time
 * of writing, anyway):
 *
 *     flow([
 *       // ensure there's an enter() and an exit hook() in the spec,
 *       // or if it's just a function, turn it into an object and add a
 *       // blank exit() hook:
 *       morphIntoObject,
 *       // add state capabilities:
 *       createState,
 *       // add prop capabilities:
 *       createProps,
 *       // add routing capabilities:
 *       exposeRoutingAPIs,
 *       // install this guard thing:
 *       installActivationGuard,
 *       // automatically bind all instance methods:
 *       createBoundInterface
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
 * @param {Object} spec
 *        Your route definition.
 *
 * @return {Route}
 *         The route handler with the APIs you defined in the spec as well as
 *         all the APIs and properties exposed by the decorators.
 */
export default flow([
  morphIntoObject,
  createState,
  createProps,
  exposeRoutingAPIs,
  installActivationGuard,
  createBoundInterface
]);

