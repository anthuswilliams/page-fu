import { assert } from './TestUtils';
import subject from '../discardFalseyValues';

describe('page-fu.discardFalseyValues', function() {
  [
    [ 'it drops empty string', '', true ],
    [ 'it does not drop lengthy strings', ' ', false ],
    [ 'it drops "false" literal', false, true ],
    [ 'it keeps "true" literal', true, false ],
    [ 'it drops undefined values', undefined, true ],
    [ 'it drops null values', null, true ],
    [ 'it does not drop 0', 0, false ],
  ].forEach(function([ message, value, dropped ]) {
    it(message, function() {
      const withoutFalseys = subject({ someKey: value })

      if (dropped) {
        assert.notInclude(Object.keys(withoutFalseys), 'someKey');
      }
      else {
        assert.include(Object.keys(withoutFalseys), 'someKey')
        assert.equal(withoutFalseys.someKey, value)
      }
    })
  })
});
