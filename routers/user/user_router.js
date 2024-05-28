const router = require("express").Router();
const userController = require("../../controllers/user/user_controller");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/refresh-token", userController.refreshToken);

router.post("/logout", userController.logout);

router.post("/send-otp", userController.sendOTP);

router.post("/recover-password", userController.recoverPassword);

module.exports = router;