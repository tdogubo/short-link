const express = require("express");
const shortLinkRoutes = require("./short-link.routes");

const router = express.Router();

const routes = [
  {
    path: "/urls",
    route: shortLinkRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
