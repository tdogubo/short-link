const { nanoid } = require("nanoid");
const { Url } = require("../models/short-link.model");

const encodeUrl = async (url, baseUrl) => {
  try {
    const urlExists = await Url.findOne({
      where: { originalUrl: url },
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
    console.error("Database Error:", error);
  }
  return;
};

const decodeUrl = async (id) => {
  try {
    const urlExists = await Url.findOne({
      where: { id },
    });
    if (urlExists) return urlExists;
  } catch (error) {
    console.error("Database Error:", error);
  }
  return;
};
const updateVisits = async (id) => {
  try {
    await Url.increment("visited", {
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
  }
  return;
};
module.exports = {
  encodeUrl,
  decodeUrl,
  updateVisits,
};
