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