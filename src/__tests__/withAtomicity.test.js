import withAtomicity from '../withAtomicity';
import { assert, sinonSuite, pageSuite } from './TestUtils';

describe('page-fu.withAtomicity', function() {
  const sinon = sinonSuite(this);

  describe('invoking enter / exit hooks', function() {
    let animalEnter, animalExit, newAnimalExit, newAnimalEnter;
    let AnimalRoute, NewAnimalRoute, ElsewhereRoute;

    const page = pageSuite(this, {
      draw() {
        animalEnter = sinon.stub();
        animalExit = sinon.stub();
        newAnimalExit = sinon.stub();
        newAnimalEnter = sinon.stub();

        AnimalRoute = withAtomicity({
          path: '/animals/:id',
          enter: animalEnter,
          exit: animalExit,
        })

        NewAnimalRoute = withAtomicity({
          path: '/animals/new',
          enter: newAnimalEnter,
          exit: newAnimalExit,
        })

        ElsewhereRoute = withAtomicity({
          path: '/elsewhere',
          enter: sinon.stub(),
        })

        page('/animals/new', NewAnimalRoute.enter);
        page.exit('/animals/new', NewAnimalRoute.exit);

        page('/animals/:id', AnimalRoute.enter);
        page.exit('/animals/:id', AnimalRoute.exit);

        page('/elsewhere', ElsewhereRoute.enter);
        page.exit('/elsewhere', ElsewhereRoute.exit);
      }
    })

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
});
