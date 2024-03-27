const express = require("express");
const ShortLinkController = require("../../controllers/short-link.controller");
const {
  ShortLinkValidation,
} = require("../../validations/short-link.validations");
const validate = require("../../middleware/validation");

const router = express.Router();

router.get(
  "/:id",
  validate(ShortLinkValidation.params, "params"),
  ShortLinkController.redirect
);

module.exports = router;
