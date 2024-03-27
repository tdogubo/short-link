const Joi = require("joi");

const ShortLinkValidation = {
  params:Joi.object().keys({
    id: Joi.string().length(10).required(),
  }),
  bodyInput: Joi.object().keys({
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
