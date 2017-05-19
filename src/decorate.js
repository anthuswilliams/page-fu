import ensureNextIsCalled from './ensureNextIsCalled';
import { partial } from 'lodash';

export default function decorate(instance, spec) {
  const { enter = Function.prototype } = instance;
  const exit = ensureNextIsCalled(instance.exit);

  return Object.assign({}, instance, spec, {
    enter(ctx, next) {
      spec.enter.call(this, ctx, () => {
        enter.call(this, ctx, next);
      });
    },

    exit(ctx, next) {
      exit.call(this, ctx, err => {
        spec.exit.call(this, ctx, partial(next, err))
      })
    }
  })
}