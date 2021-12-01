function ErrorHandler(error, req, res, next) {
  const { message, statusCode = 500, status = 'error' } = error;
  res.status(statusCode).send({ status, message });
}

function errorWrapper(func) {
  return function (req, res, next) {
    func(req, res, next).catch(next);
  };
}

module.exports = { ErrorHandler, errorWrapper };
