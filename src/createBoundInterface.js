/**
 * @module createBoundInterface
 *
 * Create an object whose functions will be permanently bound to it. After
 * applying this decorator, you no longer need to call
 * `Function.prototype.bind()` when you're passing around references to your
 * route handler's functions.
 *
 * Example:
 *
 *     import { createBoundInterface } from 'page-fu';
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
 *     const boundCounter = createBoundInterface(new Counter());
 *
 *     // grab references to instance functions; no need to .bind():
 *     const { increment } = boundCounter;
 *
 *     increment(); // => no error!
 *
 *     // pass them around:
 *     setTimeout(boundCounter.printValue, 0); // => "Value = 1"
 *
 * > If you've used React before, this decorator is similar to what they
 * > provided through the `React.createClass` helper.
 *
 * @param {Object} object
 * @return {Object}
 */
export default function createBoundInterface(object) {
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