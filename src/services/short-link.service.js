const { nanoid } = require("nanoid");
const { Url } = require("../models/short-link.model");

const encodeUrl = async (url, baseUrl) => {
  try {
    const urlExists = await Url.findOne({
      where: {
        originalUrl: url,
      },
    });
    let urlModel;
    if (urlExists) {
      urlModel = urlExists;
    } else {
      const id = nanoid(10);
      const shortUrl = `http://${baseUrl}/` + id;
      urlModel = await Url.create({
        id,
        originalUrl: url,
        shortUrl,
        created: Date.now(),
      });
    }
    return urlModel;
  } catch (error) {
    console.error(error);
  }
  return;
};

module.exports = {
  encodeUrl,
};
