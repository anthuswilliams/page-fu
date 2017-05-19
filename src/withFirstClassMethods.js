/**
 * Create an object whose functions are permanently bound to it (i.e. "first-
 * class" functions).
 *
 * After applying this decorator, you no longer need to call [bind](https://deve
 * loper.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bi
 * nd) when you're passing around references to your route handler's functions.
 *
 * Example:
 *
 *     import { withFirstClassMethods } from 'page-fu';
 *
 *     class Counter {
 *       constructor() {
 *         this.value = 0;
 *       }
 *
 *       increment() {
 *         this.value += 1;
 *       }
 *
 *       printValue() {
 *         console.log('Value = 1')
 *       }
 *     }
 *
 *     const boundCounter = withFirstClassMethods(new Counter());
 *
 *     // grab references to instance functions; no need to .bind():
 *     const { increment } = boundCounter;
 *
 *     increment(); // => no error!
 *
 *     // pass them around:
 *     setTimeout(boundCounter.printValue, 0); // => "Value = 1"
 *
 * @param {Object} object
 * @return {Object}
 */
export default function withFirstClassMethods(object) {
  return Object.keys(object).reduce(function(bound, key) {
    if (typeof object[key] === 'function') {
      bound[key] = object[key].bind(bound);
    }
    else {
      bound[key] = object[key];
    }

    return bound;
  }, {});
}