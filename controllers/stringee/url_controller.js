const recordAction = {
    "action": "record",
    "eventUrl": process.env.STRINGEE_EVENT_URL,
    "format": ""
};
const connectAction = {
    "action": "connect",
    "from": {
        "type": "",
        "number": "",
        "alias": ""
    },
    "to": {
        "type": "",
        "number": "",
        "alias": ""
    },
    "customData": "{\n  name: \"NDK\",\n  content: \"custom data from backend\"\n}", //Custom data (String) is sent to the client's app when the client makes a call or receives an incoming call.
    "timeout": null, //If the call is unanswered, set the number in seconds before Stringee stops ringing.
    "continueOnFail": false,  //If true, Stringee sends a POST request to the onFailEventUrl.
    "onFailEventUrl": "",
    "maxConnectTime": -1, //Maximum length of the call in seconds.
    "peerToPeerCall": false
};
const phoneRegex = /^(0|84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-46-9])[0-9]{7}$|^(0|84)(2[0-9]{1,3})[0-9]{5,8}$/;

const urlController = {
    getCustomerInfo: async (req, res, next) => {
        try {
            const query = { ...req.query };
            const resObj = {
                query: query,
                message: "This is data from get customer info URL"
            };
            return res.send(resObj);
        } catch (err) {
            next(err);
        }
    },
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
    },
    answerUrl: async (req, res, next) => {
        try {
            const record = { ...recordAction };
            const connect = { ...connectAction };
            const query = { ...req.query };
            switch (query.fromInternal) {
                case "true":
                    if (query.videocall === "true") {
                        record.format = "webm";
                        connect.from.type = "internal";
                        connect.to.type = "internal";
                        connect.from.number = query.userId;
                        connect.from.alias = query.userId;
                        connect.to.number = query.to;
                        connect.to.alias = query.to;
                    } else {
                        record.format = "mp3";
                        if (phoneRegex.test(query.from)) {
                            connect.from.type = "internal";
                            connect.to.type = "external";
                            connect.from.number = query.from;
                            connect.from.alias = query.from;
                        } else {
                            connect.from.number = query.userId;
                            connect.from.alias = query.userId;
                            connect.from.type = "internal";
                            connect.to.type = "internal";
                        }
                        connect.to.number = query.to;
                        connect.to.alias = query.to;
                    }
                    connect.timeout = parseInt(process.env.STRINGEE_OUTBOUND_TIMEOUT);
                    break;
                case "false":
                    const agentList = process.env.AGENT_LIST.split(",");
                    record.format = "mp3";
                    connect.from.type = "external";
                    connect.to.type = "internal";
                    connect.from.number = query.from;
                    connect.from.alias = query.from;
                    connect.to.number = agentList[0];
                    connect.to.alias = agentList[0];
                    connect.timeout = parseInt(process.env.STRINGEE_INBOUND_TIMEOUT);
                    break;
                default:
                    break;
            }
            return res.send([record, connect]);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = urlController;
