import ensureNextIsCalled from './ensureNextIsCalled';

/**
 * A container for a state-transitioning object.
 */
export default function createState(instance) {
  const { enter, exit } = instance;
  const state = {};
  const emitChange = function() {
    this.stateDidChange();
  };

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
      ensureNextIsCalled(exit.bind(this), ctx, (err) => {
        this.clearState();

        next(err);
      });
    },

    /**
     * @lends Route
     * @property {Object} state
     *
     * The route's internal state which can be mutated using the
     * state routines.
     */
    state,

    /**
     * @lends Route
     * @property {Function}
     *
     * @return {Object}
     *         The initial state definition.
     */
    getInitialState: instance.getInitialState || Function.prototype,

    /**
     * @lends Route
     *
     * Transition to a new state.
     *
     * @param {Object} partialState
     */
    setState(partialState) {
      Object.assign(state, partialState);

      emitChange.call(this);
    },

    /**
     * @lends Route
     *
     * Transition to an entirely new state, replacing the old one.
     *
     * @param  {Object} newState
     */
    replaceState(newState) {
      replace(newState);

      emitChange.call(this);
    },

    /**
     * @lends Route
     *
     * Reset the state.
     */
    clearState() {
      this.replaceState(this.getInitialState() || {});
    },

    /**
     * @lends Route
     * @property {Function} stateDidChange
     *
     * A callback to invoke when the state has changed through calls to
     * [[setState]], [[replaceState]] or [[clearState]].
     *
     * This callback will NOT be fired if the route is not active.
     */
    stateDidChange: instance.stateDidChange || Function.prototype,
  })
};
