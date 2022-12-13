let exp = module.exports = {};

exp.quickLogin = function (userInfo, autoRegister, cb) {
    let accountDataArr = cc.sys.localStorage.getItem('accountDataArr');
    let accountData = null;
    try {
        if (!!accountDataArr && accountDataArr.length > 0){
            accountDataArr = JSON.parse(accountDataArr);
            accountData = accountDataArr[0];
        }
    }catch (e){
        cc.sys.localStorage.setItem('accountDataArr', "");
        accountData = null;
    }
    if (!!accountDataArr && accountDataArr.length > 0 && !!accountData){
        Global.DialogManager.addLoadingCircle();
        exp.login(accountData, userInfo, function (data) {
            if (Global.UserModel.nickname !== accountData.nickname){
                accountData.nickname = Global.UserModel.nickname;
                cc.sys.localStorage.setItem('accountDataArr', JSON.stringify(accountDataArr));
            }
            Global.Utils.invokeCallback(cb, null, data);
        },function (err) {
            Global.Utils.invokeCallback(cb, err);
        });
    }else{
        if (!!autoRegister){
            let account = Date.now().toString();
            let password = Date.now().toString();
            let loginPlatform = Global.Enum.loginPlatform.ACCOUNT;
            accountData = {account: account, password: password, loginPlatform: loginPlatform};
            Global.DialogManager.addLoadingCircle();
            exp.register(accountData, userInfo, function (data) {
                accountData.nickname = Global.UserModel.nickname;
                cc.sys.localStorage.setItem('accountDataArr', JSON.stringify([accountData]));
                Global.Utils.invokeCallback(cb, null, data);
            }, function (err) {
                Global.Utils.invokeCallback(cb, err);
            })
        }else{
            Global.Utils.invokeCallback(cb, Global.Code.FAIL);
        }
    }
};

exp.login = function (data, userInfo, cbSuccess, cbFail) {
    Global.API.account.login(data.account, data.password, data.loginPlatform,
        function (data) {
            // 登录成功
            Global.NetworkLogic.connectToServer(data.msg.serverInfo.host, data.msg.serverInfo.port, function () {
                exp.loginHall(data.msg.token, userInfo, cbSuccess);
            })
        },
        cbFail
    );
};

exp.register = function (data, userInfo, cbSuccess, cbFail) {
    Global.API.account.register(data.account, data.password, data.loginPlatform, data.smsCode,
        function (data) {
            // 登录成功
            Global.NetworkLogic.connectToServer(data.msg.serverInfo.host, data.msg.serverInfo.port, function () {
                exp.loginHall(data.msg.token, userInfo, cbSuccess);
            })
        },
        cbFail
    );
};

exp.reconnection = function (token, cbSuccess, cbFail) {
    Global.API.account.reconnectionRequest(token,
        function (data) {
            // 登录成功
            Global.NetworkLogic.connectToServer(data.msg.serverInfo.host, data.msg.serverInfo.port, function () {
                exp.loginHall(data.msg.token, null, cbSuccess);
            })
        },
        cbFail
    );
};

exp.loginHall = function (token, userInfo, cbSuccess) {
    userInfo = userInfo || {};
    Global.API.hall.entry(token, userInfo, function (data) {
        // 存储token
        cc.sys.localStorage.setItem("token", token);
        //游戏数据初始化
        Global.ConfigModel.init(data.msg.config);
        //玩家数据初始化
        Global.UserModel.init(data.msg.userInfo);

        Global.DialogManager.removeLoadingCircle();

        Global.Utils.invokeCallback(cbSuccess, data);

        Global.MessageCallback.emitMessage('ReConnectSuccess');
    }, function () {
        // 进入大厅失败，断开服务器
        Global.NetworkLogic.disconnect(false);
        Global.DialogManager.addTipDialog("进入大厅失败");
    })
};

exp.updateFirstAccountData = function (account, password, nickname) {
    let accountDataArr = cc.sys.localStorage.getItem('accountDataArr');
    let accountData = null;
    if (!!accountDataArr && accountDataArr.length > 0){
        accountDataArr = JSON.parse(accountDataArr);
        accountData = accountDataArr[0];
    }
    if (!!accountData){
        if (!!account) accountData.account = account;
        if (!!password) accountData.password = password;
        if (!!nickname) accountData.nickname = nickname;

        cc.sys.localStorage.setItem('accountDataArr', JSON.stringify(accountDataArr));
    }
};

exp.updateAccountData = function (account, password) {
    let accountDataArr = cc.sys.localStorage.getItem('accountDataArr');
    if (!!accountDataArr && accountDataArr.length > 0){
        accountDataArr = JSON.parse(accountDataArr);
    }else{
        accountDataArr = [];
    }

    for (let i = 0; i < accountDataArr.length; ++i){
        let data = accountDataArr[i];
        if (data.account === account){
            data.password = password;
            break;
        }
    }
    cc.sys.localStorage.setItem('accountDataArr', JSON.stringify(accountDataArr));
};

exp.addAccountDataAtFirst = function (account, password, nickname, loginPlatform) {
    let accountDataArr = cc.sys.localStorage.getItem('accountDataArr');
    if (!!accountDataArr && accountDataArr.length > 0){
        accountDataArr = JSON.parse(accountDataArr);
    }else{
        accountDataArr = [];
    }
    for (let i = 0; i < accountDataArr.length; ++i){
        let data = accountDataArr[i];
        if (data.account === account){
            accountDataArr.splice(i, 1);
            break;
        }
    }
    accountDataArr.unshift({
        account: account,
        password: password,
        nickname: nickname,
        loginPlatform: loginPlatform
    });
    cc.sys.localStorage.setItem('accountDataArr', JSON.stringify(accountDataArr));
};
