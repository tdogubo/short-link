const Joi = require("joi");

const ShortLinkValidation = {
  fetchShortLink: Joi.object().keys({
    code: Joi.string().length(10).required(),
  }),
  newShortLink: Joi.object().keys({
    url: Joi.string()
      .uri({
        scheme: ["http", "https"],
      })
      .required()
      .messages({
        "string.uriCustomScheme": "Invalid url",
      }),
  }),
};

module.exports = {
  ShortLinkValidation,
};
