const router = require("express").Router();
const jwtHelper = require("../../common/helpers/jwt");
const contactController = require("../../controllers/contact/contact_controller");

router.post("/create", jwtHelper.verifyAccessToken, contactController.createContact);

router.put("/:id", jwtHelper.verifyAccessToken, contactController.updateContact);

router.delete("/delete/:id", jwtHelper.verifyAccessToken, contactController.deleteContact);

router.delete("/delete-multi", jwtHelper.verifyAccessToken, contactController.deleteMultiContact);

router.get("/:id", jwtHelper.verifyAccessToken, contactController.getContact);

router.get("/", jwtHelper.verifyAccessToken, contactController.getContactList);

module.exports = router;