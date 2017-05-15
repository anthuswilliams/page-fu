const passThrough = (ctx, next) => { next() };

/**
 * @module
 *
 * A decorator that will produce a well-defined route that specifies both an
 * enter and an exit hook from either a function to be used as the sole "enter"
 * hook, or an object that defines one or both of an enter and an exit hook.
 *
 *     import { morphIntoObject } from 'page-fu';
 *
 *     const route = morphIntoObject(function myEnter(ctx, next) {})
 *
 *     console.assert(typeof route === 'object')
 *     console.assert(typeof route.enter === 'function')
 *     console.assert(typeof route.exit === 'function')
 *
 * @param  {Function|Object} spec
 *
 * @return {Object}   route
 * @return {Function} route.enter
 * @return {Function} route.exit
 */
export default function morphIntoObject(spec = {}) {
  if (typeof spec === 'function') {
    return {
      /**
       * @method
       *
       * The `enter` routine that gets called when the route is activated.
       *
       * @param {page.Context} ctx
       * @param {Function} next
       *        Call this if you do not want to activate the route and instead
       *        forward to the next one.
       */
      enter: spec,

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
      exit: passThrough
    };
  }
  else {
    return Object.assign({}, spec, {
      enter: spec.enter || Function.prototype,
      exit: spec.exit || passThrough,
    })
  }
}