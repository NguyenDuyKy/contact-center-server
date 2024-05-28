const handleError = require("http-errors");
const generateStringeeToken = require("../../common/helpers/stringee_token");
const stringeeAxiosClient = require("../../common/helpers/stringeeAxiosClient");
const { ERROR_DESC } = require("../../common/constants");

const agentController = {
    get: async (req, res, next) => {
        try {
            const agentData = await getAgentData(req.params.id);
            return res.send({ msg: "Success", data: agentData });
        } catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const agentData = await getAgentData(req.params.id);
            const updateAgentResponse = await stringeeAxiosClient.put("/agent/" + agentData.id, req.body);
            return res.send({ msg: "Success", updateAgentResponse });
        } catch (err) {
            next(err);
        }
    },
    getPccClientToken: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const tokenResponse = generateStringeeToken.pccClientToken(userId);
            return res.send(tokenResponse);
        } catch (err) {
            next(err);
        }
    },
};

async function getAgentData(userId) {
    const getAgentRespone = await stringeeAxiosClient.get("/agent?stringee_user_id=" + userId);
    if (getAgentRespone.data && getAgentRespone.data.agents.length === 0) throw handleError.NotFound(ERROR_DESC.AGENT_NOT_FOUND);
    const agentData = getAgentRespone.data.agents.find(agent => agent.stringee_user_id === userId);
    return agentData;
}

module.exports = agentController;
