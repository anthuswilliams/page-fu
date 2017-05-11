import subject from '../createBoundInterface';
import { assert, sinonSuite } from './TestUtils';

describe('page-fu.createBoundInterface', function() {
  const sinon = sinonSuite(this);

  it('binds functions to the object', function() {
    const func = function() {
      return this.x;
    }

    const object = { func };
    const bound = subject({
      x: 1,
      func
    });

    assert.equal(object.func(), undefined);
    assert.equal(bound.func(), 1)
  })

  it('does not allow re-binding', function() {
    const accept = sinon.stub();
    const bound = subject({
      enter() {
        this.x = 1;
        this.getSomething.call(null);
      },

      getSomething() {
        accept(this.x);
      }
    });

    bound.enter();

    assert.calledWith(accept, 1);
  });

  it('leaves non-function properties untouched', function() {
    const object = { state: { a: '1', b: '2' }, number: 5 };
    const bound = subject(object);

    assert.equal(object.state, bound.state);
    assert.equal(object.number, bound.number)
  });
});
