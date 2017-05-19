import ensureNextIsCalled from './ensureNextIsCalled';

/**
 * @preserveOrder
 *
 * Decorate your route with the ability to transition between (internal) states.
 * That state will be purged upon entering and exiting the route so you do not
 * need to manage it.
 *
 * Here's an example that tracks an internal counter and outputs it to the
 * console when it changes:
 *
 *     import { withState } from 'page-fu';
 *
 *     export default withState({
 *       getInitialState() {
 *         return { value: 0 };
 *       },
 *
 *       enter() {
 *         this.renderValue(); // => "Value = 0"
 *         this.increment();
 *       },
 *
 *       stateDidChange() {
 *         this.renderValue(); // => "Value = 1"
 *       },
 *
 *       renderValue() {
 *         console.log('Value = %d', this.state.value)
 *       },
 *
 *       increment() {
 *         this.setState({
 *           value: this.state.value + 1
 *         });
 *       }
 *     })
 *
 * @param {Route} instance
 * @return {Route}
 */
export default function withState(instance) {
  const { enter = Function.prototype } = instance;
  const exit = ensureNextIsCalled(instance.exit);
  const state = {};

  const replace = nextState => {
    Object.keys(state).forEach(key => { delete state[key]; });
    Object.assign(state, nextState);
  };

  return Object.assign({}, instance, {
    enter(ctx, next) {
      replace(this.getInitialState() || {});

      enter.call(this, ctx, next);
    },

    exit(ctx, next) {
      exit.call(this, ctx, err => {
        this.clearState();

        next(err);
      });
    },

    /**
     * @property {Object}
     *
     * The route's internal state which can be mutated using the state routines.
     */
    state,

    /**
     * @method
     *
     * A producer for the initial state the container should start in. The
     * output of this method will be used when clearing the container as well.
     *
     * @return {Object}
     *         The initial state definition.
     */
    getInitialState: instance.getInitialState || Function.prototype,

    /**
     * Transition to a new state, overwriting any existing keys.
     *
     * @param {Object} partialState
     */
    setState(partialState) {
      Object.assign(state, partialState);

      this.stateDidChange();
    },

    /**
     * Transition to an entirely new state, replacing the old one.
     *
     * @param  {Object} newState
     */
    replaceState(newState) {
      replace(newState);

      this.stateDidChange();
    },

    /**
     * Reset the state.
     */
    clearState() {
      this.replaceState(this.getInitialState() || {});
    },

    /**
     * @method
     *
     * A hook that is invoked when the state changes through calls to
     * [[#setState]], [[#replaceState]] or [[#clearState]].
     */
    stateDidChange: instance.stateDidChange || Function.prototype,
  })
};
