import ensureNextIsCalled from './ensureNextIsCalled';

/**
 * @module
 *
 * This decorator ensures that your route's [[#enter]] and [[#exit]] hooks are
 * invoked only when this route is the final destination of the page.js
 * dispatch.
 *
 * The route will be provided with a single API [[#isActive]] for querying
 * whether the route is still active or not, which is necessary in asynchronous
 * processing contexts.
 *
 * This will inherently break nesting of routes, or middleware chains, since it
 * tries to emulate the exact opposite of that behavior, so you should not use
 * it in places where you rely on that functionality.
 *
 * Consider the following example:
 *
 *     import { Route } from 'page-fu';
 *
 *     export default Route({
 *       enter() {
 *         fetch('http://www.google.com').then(() => {
 *           if (this.isActive()) {
 *             alert('Response received!');
 *           }
 *         })
 *       }
 *     })
 *
 * Without the call to `isActive()` above, the route would've had unwanted
 * side-effects had it been exited while the call to `fetch` was in-flight.
 *
 * Further, consider the following scenario:
 *
 *     page('/patients/new', NewPatientRoute.enter);
 *     page.exit('/patients/new', NewPatientRoute.exit);
 *
 *     page('/patients/:id', PatientRoute.enter);
 *     page.exit('/patients/:id', PatientRoute.exit);
 *
 * Without the activation guard, exiting from `/patients/new` will also call
 * the exit hook for `/patients/:id` since both of them match. However, the
 * `enter` hook of only `/patients/new` will be invoked in case it does not
 * call `next` to forward - a very common case - which results in the
 * application getting into an undefined state.
 *
 * With the guard in place, you are assured that the `exit` hook of any one
 * route will be run only if its `enter` hook was run as well during the current
 * dispatch.
 *
 * @param {Object} route
 * @return {Object} route
 */
export default function installActivationGuard(instance) {
  const { enter = Function.prototype, exit = Function.prototype } = instance;

  let active = false;

  return Object.assign({}, instance, {

    /**
     * You should use this hook any time you're performing asynchronous
     * routines since the route may have become deactivated in the meantime.
     *
     * This is analogous to the `isMounted()` API in the React library.
     *
     * @return {Boolean}
     *         Whether the route is active or not.
     */
    isActive() {
      return !!active;
    },

    enter(ctx, next) {
      active = true;

      enter.call(this, ctx, next);
    },

    exit(ctx, next) {
      if (!active) {
        return next();
      }

      ensureNextIsCalled(exit.bind(this), ctx, () => {
        active = false;

        next();
      })
    },
  });
}
