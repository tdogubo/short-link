const express = require("express");
const {
  shortLinkController,
} = require("../../controllers/short-link.controller");
const {
  ShortLinkValidation,
} = require("../../validations/short-link.validations");
const validate = require("../../middleware/validation");

const router = express.Router();

router.post(
  "/encode",
  validate(ShortLinkValidation.newShortLink, "body"),
  shortLinkController
);

module.exports = router;
