export default function flow(fns) {
  return x => fns.reduce(function(composite, fn) {
    return fn(composite);
  }, x)
}