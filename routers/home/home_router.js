const router = require("express").Router();
const jwtHelper = require("../../common/helpers/jwt");
const homeController = require("../../controllers/home/home_controller");

router.get("/", jwtHelper.verifyAccessToken, homeController.home);

module.exports = router;