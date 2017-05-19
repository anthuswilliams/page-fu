import ensureNextIsCalled from './ensureNextIsCalled';

/**
 * Ensure that your route's `exit` hook is invoked only when its `enter` hook
 * was also invoked during the active dispatch. Hence, "atomic".
 *
 * Consider the following scenario:
 *
 *     page('/patients/new', NewPatientRoute.enter);
 *     page.exit('/patients/new', NewPatientRoute.exit);
 *
 *     page('/patients/:id', PatientRoute.enter);
 *     page.exit('/patients/:id', PatientRoute.exit);
 *
 * Without the atomicity guard, exiting from `/patients/new` will also call the
 * exit hook for `/patients/:id` since both of them match. However, the `enter`
 * hook of only `/patients/new` will be invoked in case it does not call `next`
 * to forward - a very common case - which could get the application into an
 * undefined state.
 *
 * With the guard in place, however, you are assured that the `exit` hook of any
 * one route will be run only if its `enter` hook was run as well during the
 * current dispatch.
 *
 * ## `isActive()`?
 *
 * The decorator will also provide an [[API | withAtomicity#isActive]] for
 * querying whether the route is still active or not, which is necessary in
 * asynchronous contexts where a handler may yield after the route has exited.
 *
 * Consider the following example:
 *
 *     import { withAtomicity } from 'page-fu';
 *
 *     export default withAtomicity({
 *       enter() {
 *         fetch('http://www.google.com').then(() => {
 *           if (this.isActive()) {
 *             alert('Response received!');
 *           }
 *         })
 *       }
 *     })
 *
 * Without the call to `isActive()` above, the route would've had unwanted side-
 * effects (`alert()`) had it been exited while the call to `fetch` was still
 * in-flight.
 *
 * @param {Object} route
 * @return {Object} route
 */
export default function withAtomicity(instance) {
  const { enter = Function.prototype, exit = Function.prototype } = instance;

  let active = false;

  return Object.assign({}, instance, {

    /**
     * You should use this hook any time you're performing asynchronous
     * routines since the route may have become deactivated in the meantime.
     *
     * For those with a background in React, this is analogous to the
     * `isMounted()` API provided to their components.
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

      ensureNextIsCalled(exit).call(this, ctx, err => {
        active = false;

        next(err);
      })
    },
  });
}
