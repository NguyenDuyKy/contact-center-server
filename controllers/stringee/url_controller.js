

const urlController = {
    getList: async (req, res, next) => {
        try {
            let callId = req.body.calls[0].callId;
            const resObj = {
                version: 2,
                calls: [{
                    callId: callId,
                    agents: [
                        {
                            stringee_user_id: "AC9Z3A5J97",
                            routing_type: 1,
                            answer_timeout: 20
                        }
                    ]
                }]
            };
            return res.send(resObj);
        } catch (err) {
            next(err);
        }
    }
};

module.exports = urlController;
