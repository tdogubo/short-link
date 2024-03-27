const express = require("express");
const shortLinkRoutes = require("./short-link.routes");
const redirectRoutes = require("./link-redirect.routes");

const router = express.Router();

const routes = [
  {
    path: "/v1/urls",
    route: shortLinkRoutes,
  },
  {
    path: "",
    route: redirectRoutes
  }
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
