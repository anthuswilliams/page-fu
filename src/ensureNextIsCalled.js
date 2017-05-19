/**
 * @private
 *
 * Ensure that the given function will always "yield" by calling `next` on its
 * behalf if needed.
 *
 * `next` will be called implicitly in the following cases:
 *
 * - the given function is undefined
 * - the given function only accepts the ctx parameter
 *
 * This is necessary when you're wrapping an `exit` hook since you want to
 * invoke the original `exit` hook before you do your thing, and in that case
 * you want to ensure that that hook will actually call you!
 *
 * Examples:
 *
 *     // No function:
 *     ensureNextIsCalled(undefined)(ctx, function next() {
 *       console.assert(true);
 *     })
 *
 *     // Yes function but it's not aware of `next`:
 *     ensureNextIsCalled(function() {})(ctx, function next() {
 *       console.assert(true);
 *     })
 *
 *     // Yes function but it's not aware of `next` either:
 *     ensureNextIsCalled(function(ctx) {})(ctx, function next() {
 *       console.assert(true);
 *     })
 *
 *     // Yes function and it's aware of `next`, we'll do nothing:
 *     ensureNextIsCalled(function(ctx, next) { next() })(ctx, function next() {
 *       console.assert(true);
 *     })
 *
 * @param {Function} fn
 * @param {page.Context} ctx
 * @param {Function} next
 */
export default function ensureNextIsCalled(fn) {
  return function(ctx, next) {
    if (!fn) {
      next();
    }
    else if (fn && fn.length < 2) {
      try {
        fn.call(this, ctx);

        next();
      }
      catch (err) {
        next(err);
      }
    }
    else {
      fn.call(this, ctx, next);
    }
  }
}
