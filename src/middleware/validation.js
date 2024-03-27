const httpStatusCode = require("../utils/http-status-code");

const ValidatorMiddleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const { details } = error;
      const message =
        details && Array.isArray(details)
          ? details.map((i) => i.message).join(",")
          : details;
      return res.status(httpStatusCode.BAD_REQUEST).send(message);
    }
    next();
  };
};

module.exports = ValidatorMiddleware;
