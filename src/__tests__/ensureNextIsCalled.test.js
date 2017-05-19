import { assert, sinonSuite } from './TestUtils';
import ensureNextIsCalled from '../ensureNextIsCalled';

describe('page-fu.ensureNextIsCalled', function() {
  const sinon = sinonSuite(this);

  it('calls next automatically if the exit handler does not accept it', function() {
    const fakeNext = sinon.stub();

    ensureNextIsCalled(function() {})({}, fakeNext);

    assert.calledOnce(fakeNext);

    ensureNextIsCalled(function(ctx) {})({}, fakeNext);  // eslint-disable-line no-unused-vars

    assert.calledTwice(fakeNext);
  });

  it('propagates errors', function() {
    const fakeNext = sinon.stub();
    const error = new Error();

    ensureNextIsCalled(function() { throw error; })({}, fakeNext);

    assert.calledWithExactly(fakeNext, error);
  })

  it('does not call #next if the function accepts 2 arguments', function() {
    const fakeNext = sinon.stub();

    ensureNextIsCalled(function(ctx, next) {})({}, fakeNext); // eslint-disable-line no-unused-vars

    assert.notCalled(fakeNext);
  })
});
