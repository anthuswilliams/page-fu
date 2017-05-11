const passThrough = (ctx, next) => { next() };

export default function morphIntoObject(spec) {
  if (typeof spec === 'function') {
    return {

      /**
       * @lends Route
       * @property {Function} enter
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
       * @lends Route
       * @property {Function} exit
       *
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