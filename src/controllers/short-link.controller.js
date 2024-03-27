const shortLinkService = require("../services/short-link.service");
const catchAsync = require("../utils/catch-async");
const httpStatusCode = require("../utils/http-status-code");

const shortLinkController = catchAsync(async (req, res) => {
  const { url } = req.body;
  const baseUrl = req.headers.host;
  try {
    const urlInfo = await shortLinkService.encodeUrl(url, baseUrl);
    const { id, shortUrl } = urlInfo;
    const data = { id, shortUrl };
    return res.status(httpStatusCode.CREATED).send({ data });
  } catch (error) {
    return res.status(httpStatusCode.BAD_REQUEST);
  }
});

module.exports = {
  shortLinkController,
};
