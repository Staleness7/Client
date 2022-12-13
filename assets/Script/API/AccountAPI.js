let api = module.exports = {};

api.login = function (account, password, loginPlatform, cbSuccess, cbFail) {
    let route = "/login";
    let requestData = {
        account: account,
        password: password,
        loginPlatform: loginPlatform
    };
    Global.NetworkLogic.gameServerHttpRequest(route, 'POST', requestData, cbSuccess, cbFail);
};

api.register = function (account, password, loginPlatform, smsCode, cbSuccess, cbFail) {
    let route = "/register";
    let requestData = {
        account: account,
        password: password,
        loginPlatform: loginPlatform,
        smsCode: smsCode
    };
    Global.NetworkLogic.gameServerHttpRequest(route, 'POST', requestData, cbSuccess, cbFail);
};

api.resetPasswordByPhoneRequest = function (account, newPassword, smsCode, imgCodeInfo, cbSuccess, cbFail) {
    let route = "/resetPasswordByPhone";
    let requestData = {
        account: account,
        newPassword: newPassword,
        smsCode: smsCode,
        imgCodeInfo: imgCodeInfo
    };
    Global.NetworkLogic.gameServerHttpRequest(route, 'POST', requestData, cbSuccess, cbFail);
};

api.reconnectionRequest = function (token, cbSuccess, cbFail) {
    let route = "/reconnection";
    let requestData = {
        token: token
    };
    Global.NetworkLogic.gameServerHttpRequest(route, 'POST', requestData, cbSuccess, cbFail);
};