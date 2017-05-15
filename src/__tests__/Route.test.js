import Route from '../Route';
import { assert, sinonSuite } from './TestUtils';
import page from 'page';

describe('page-fu.Route', function() {
  const sinon = sinonSuite(this);

  describe('invoking enter / exit hooks', function() {
    let animalEnter, animalExit, newAnimalExit, newAnimalEnter;
    let AnimalRoute, NewAnimalRoute, ElsewhereRoute;
    let callbacks, exits;

    beforeEach(function() {
      global.window = {
        addEventListener() {},
        removeEventListener() {},
      };
      global.history = {
        pushState() {},
      };
      global.document = {
        addEventListener() {},
        removeEventListener() {},
      };

      callbacks = page.callbacks;
      exits = page.exits;

      page.callbacks = [];
      page.exits = [];

      animalEnter = sinon.stub();
      animalExit = sinon.stub();
      newAnimalExit = sinon.stub();
      newAnimalEnter = sinon.stub();

      AnimalRoute = Route({
        path: '/animals/:id',
        enter: animalEnter,
        exit: animalExit,
      })

      NewAnimalRoute = Route({
        path: '/animals/new',
        enter: newAnimalEnter,
        exit: newAnimalExit,
      })

      ElsewhereRoute = Route({
        path: '/elsewhere',
        enter: sinon.stub(),
      })

      page('/animals/new', NewAnimalRoute.enter);
      page.exit('/animals/new', NewAnimalRoute.exit);

      page('/animals/:id', AnimalRoute.enter);
      page.exit('/animals/:id', AnimalRoute.exit);

      page('/elsewhere', ElsewhereRoute.enter);
      page.exit('/elsewhere', ElsewhereRoute.exit);

      page.start({ dispatch: false, hashbang: true });
    })

    afterEach(function() {
      page.stop();
      page.callbacks = callbacks;
      page.exits = exits;

      delete global.window;
      delete global.history;
      delete global.document;
    });

    it('does not greedily invoke exit handlers', function() {
      page('/animals/5')

      assert.calledOnce(animalEnter)
      assert.notCalled(newAnimalEnter)

      page('/elsewhere');

      assert.calledOnce(animalExit);
      assert.notCalled(newAnimalExit)
    });

    it('does not invoke exit if route is not active', function() {
      page('/animals/new')

      assert.calledOnce(newAnimalEnter)
      assert.notCalled(animalEnter)

      page('/elsewhere');

      assert.calledOnce(newAnimalExit);
      assert.notCalled(animalExit)
    });
  });

  describe('public APIs', function() {
    const MyRoute = Route({
      getInitialState() {
        return {
          user: { id: '1' }
        };
      },

      enter() {},

      getUserId() {
        return this.state.user && this.state.user.id || null;
      }
    })

    it('leaves APIs defined in the spec untouched', function() {
      const subject = MyRoute;

      assert.equal(typeof subject.getUserId, 'function');
      assert.equal(subject.getUserId(), null);

      subject.setState({
        user: { id: '1' }
      })

      assert.equal(subject.getUserId(), '1');
    })
  })

  describe('construction', function() {
    const subject = Route();

    afterEach(function(done) {
      subject.exit({}, done);
    })

    it('can be created and destroyed', function() {
      subject.enter({});
    })
  });
});
