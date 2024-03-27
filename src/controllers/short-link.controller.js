const shortLinkService = require("../services/short-link.service");
const catchAsync = require("../utils/catch-async");
const httpStatusCode = require("../utils/http-status-code");

const encoder = catchAsync(async (req, res) => {
  const { url } = req.body;
  const baseUrl = req.headers.host;
  try {
    const urlInfo = await shortLinkService.encodeUrl(url, baseUrl);
    const { shortUrl } = urlInfo;
    const data = { url: shortUrl };
    return res.status(httpStatusCode.CREATED).send({ data });
  } catch (error) {
    return res.status(httpStatusCode.SERVER_ERROR).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

const decoder = catchAsync(async (req, res) => {
  const { url } = req.body;
  const baseUrl = req.headers.host;
  const [, , host, urlId] = url.split("/");

  if (!baseUrl.includes(host) || urlId.length !== 10) {
    return res.status(httpStatusCode.BAD_REQUEST).send({error:"Bad Request"});
  }
  try {
    const urlInfo = await shortLinkService.decodeUrl(urlId);
    const {  originalUrl } = urlInfo;
    const data = { original: originalUrl };
    return res.status(httpStatusCode.OK).send({ data });
  } catch (error) {
    return res.status(httpStatusCode.SERVER_ERROR).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

module.exports = {
  encoder,
  decoder,
};
