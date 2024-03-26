const express = require("express");
const {
  shortLinkController,
} = require("../../controllers/short-link.controller");

const router = express.Router();

router.post("/encode", shortLinkController); //! remember to add validations

module.exports = router;
