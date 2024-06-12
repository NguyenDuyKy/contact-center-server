const router = require("express").Router();
const jwtHelper = require("../../common/helpers/jwt");
const agentController = require("../../controllers/stringee/agent_controller");
const numberController = require("../../controllers/stringee/number_controller");
const urlController = require("../../controllers/stringee/url_controller");

router.get("/agent/:id", jwtHelper.verifyAccessToken, agentController.get);
router.post("/agent/update/:id", jwtHelper.verifyAccessToken, agentController.update);
router.get("/agent/pcc-client-token/:id", jwtHelper.verifyAccessToken, agentController.getPccClientToken);
router.get("/rest-token", jwtHelper.verifyAccessToken, agentController.getRestToken);
router.get("/number", jwtHelper.verifyAccessToken, numberController.getList);
router.post("/get-list", urlController.getList);
router.get("/answer-url", urlController.answerUrl);
router.get("/get-customer-info", urlController.getCustomerInfo);

module.exports = router;