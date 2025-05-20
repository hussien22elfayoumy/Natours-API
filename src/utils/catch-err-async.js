const catchErrorAsync = (fn) => (req, res, next) =>
  fn(req, res, next).catch(next);

export default catchErrorAsync;
