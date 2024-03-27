//errors that occur during execution are caught and passed
const catchAsync = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(
    (err) => next && next(err) // Call next with the error
  );
};

module.exports = catchAsync;
