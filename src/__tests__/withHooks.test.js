import { assert, sinonSuite } from './TestUtils';
import withHooks from '../withHooks';

describe('page-fu.withHooks', function() {
  const sinon = sinonSuite(this);

  context('given a function handler...', function() {
    let enter, subject;

    beforeEach(function() {
      enter = sinon.spy(function() {})
      subject = withHooks(enter);
    })

    it('morphs it into an object', function() {
      assert.equal(typeof subject, 'object')
    });

    it('uses the function as the "enter" hook', function() {
      assert.equal(typeof subject.enter, 'function')
      assert.equal(subject.enter, enter);
    })

    it('installs a pass-through "exit" hook', function(done) {
      assert.equal(typeof subject.exit, 'function')

      subject.exit({}, function() {
        done();
      })
    })
  })

  context('given an object handler...', function() {
    it('installs an empty "enter" if necessary', function() {
      const subject = withHooks({});

      assert.equal(typeof subject.enter, 'function')
    });

    it('installs a pass-through "exit" hook if necessary', function(done) {
      const subject = withHooks({});

      assert.equal(typeof subject.exit, 'function')

      subject.exit({}, function() {
        done();
      })
    })

    it('leaves pre-defined "enter" hook untouched', function() {
      const enter = () => {};
      const subject = withHooks({
        enter
      });

      assert.equal(subject.enter, enter)
    })

    it('leaves pre-defined "exit" hook untouched', function() {
      const exit = () => {};
      const subject = withHooks({
        exit
      });

      assert.equal(subject.exit, exit)
    })
  })
});
