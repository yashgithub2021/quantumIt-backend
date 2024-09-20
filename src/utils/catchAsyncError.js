module.exports = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      // console.log("hiii", err);
      next(err);
    }
  };
};
