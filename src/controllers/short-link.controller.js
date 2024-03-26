const shortLinkService = require("../services/short-link.service");
const catchAsync = require("../utils/catch-async");
const httpStatusCode = require("../utils/http-status-code");

const shortLinkController = catchAsync(async (req, res, next) => {
  const response = await shortLinkService.encodeUrl();
  res.status(httpStatusCode.CREATED).send({ response });
});

module.exports = {
  shortLinkController,
};