const { VOICE_OTP_MP3 } = require("../constants");
const bcrypt = require("bcrypt");

const hashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const generateOTP = () => {
    const randomNum = Math.floor(Math.random() * 100000);
    return String(randomNum).padStart(5, "0");
}

const generateAutocallSCCO = (OTP, userNumber) => {
    const VOICE_OTP_SCCO = {
        "from": {
            "type": "internal",
            "number": "",
            "alias": ""
        },
        "to": [{
            "type": "external",
            "number": "",
            "alias": ""
        }],
        "event_url": process.env.STRINGEE_EVENT_URL,
        "actions": [
            {
                "action": "play",
                "fileName": VOICE_OTP_MP3.WELCOME,
                "loop": 0
            },
            {
                "action": "play",
                "fileName": VOICE_OTP_MP3.EXPIRED,
                "loop": 0
            },
            {
                "action": "play",
                "fileName": VOICE_OTP_MP3.THANKS,
                "loop": 0
            }
        ]
    }
    const PLAY_SCCO = {
        "action": "play",
        "fileName": "",
        "loop": 0
    }
    const arr = OTP.split("").map(Number);
    let autoCallSCCO = { ...VOICE_OTP_SCCO };
    autoCallSCCO.from.number = process.env.STRINGEE_NUMBER;
    autoCallSCCO.from.alias = process.env.STRINGEE_NUMBER;
    autoCallSCCO.to[0].number = userNumber;
    autoCallSCCO.to[0].alias = userNumber;
    let playSCCO = [];
    for (let item of arr) {
        let scco = { ...PLAY_SCCO };
        scco.fileName = VOICE_OTP_MP3.NUMBER[item];
        playSCCO.push(scco);
    }
    autoCallSCCO.actions.splice(1, 0, ...playSCCO);
    return autoCallSCCO;
}

module.exports = { generateOTP, generateAutocallSCCO, hashedPassword };