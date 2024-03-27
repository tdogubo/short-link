const express = require("express");
const ShortLinkController = require("../../controllers/short-link.controller");
const {
  ShortLinkValidation,
} = require("../../validations/short-link.validations");
const validate = require("../../middleware/validation");

const router = express.Router();

router.post(
  "/encode",
  validate(ShortLinkValidation.bodyInput, "body"),
  ShortLinkController.encoder
);
router.post(
  "/decode",
  validate(ShortLinkValidation.bodyInput, "body"),
  ShortLinkController.decoder
);

module.exports = router;
