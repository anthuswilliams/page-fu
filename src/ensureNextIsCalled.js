export default function ensureNextIsCalled(fn, ctx, next) {
  if (!fn) {
    next();
  }
  else if (fn && fn.length < 2) {
    try {
      fn(ctx);

      next();
    }
    catch (err) {
      next(err);
    }
  }
  else {
    fn(ctx, next);
  }
}
