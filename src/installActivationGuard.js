import ensureNextIsCalled from './ensureNextIsCalled';

export default function installActivationGuard(instance) {
  /**
   * @lends Route
   * @private
   *
   * Please use [[isActive]] instead.
   */
  let active = false;

  return Object.assign({}, instance, {

    /**
     * @lends Route
     * @property {Function} isActive
     *
     * You should use this hook any time you're performing asynchronous
     * routines since the route may have become deactivated in the meantime.
     *
     * @return {Boolean}
     *         Whether the route is active or not.
     */
    isActive() {
      return !!active;
    },

    enter(ctx, next) {
      active = true;

      if (instance.enter) {
        instance.enter.call(this, ctx, next);
      }
    },

    exit(ctx, next) {
      if (!active) {
        return next();
      }

      ensureNextIsCalled(instance.exit.bind(this), ctx, () => {
        active = false;

        next();
      })
    },
  });
}
