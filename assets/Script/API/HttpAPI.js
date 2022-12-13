let api = module.exports = {};

api.getPhoneCode = function (phoneNumber, cbSuccess, cbFail) {
    let route = "/getSMSCode";
    let requestData = {
        phoneNumber: phoneNumber,
    };
    Global.NetworkLogic.gameServerHttpRequest(route, 'POST', requestData, cbSuccess, cbFail);
};
