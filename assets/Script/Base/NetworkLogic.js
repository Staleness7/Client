let messageCallback = require('./MessageCallback');
let dialogManager = require('./DialogManager');
let constant = require('../Constant/Constant');
let utils = require('../Utils/utils');
let code = require('../Constant/code');

let NetworkLogic = module.exports;

NetworkLogic.isManualCloseServerConnection = false;

NetworkLogic.init = function (){
    NetworkLogic.isManualCloseServerConnection = false;

    /// 添加事件监听
    messageCallback.addListener('ServerDisconnection', this);
    messageCallback.addListener('ServerMessagePush', this);
    messageCallback.addListener('PopDialogContentPush', this);

    Global.NetworkManager.removeAllListeners();
    /// 服务器推送消息监听
    // 监听断开信息
    Global.NetworkManager.addReceiveListen('close', 'ServerDisconnection');
    // 推送消息
    Global.NetworkManager.addReceiveListen('ServerMessagePush', 'ServerMessagePush');
};

NetworkLogic.deInit = function () {
    /// 添加事件监听
    messageCallback.removeListener('ServerDisconnection', this);
    messageCallback.removeListener('ServerMessagePush', this);
    messageCallback.removeListener('PopDialogContentPush', this);
};

NetworkLogic.connectToServer = function (host, port, cb){
    Global.NetworkManager.init({
        host: host,
        port: port
    }, cb);
};

NetworkLogic.disconnect = function (autoReconnect){
    NetworkLogic.isManualCloseServerConnection = !autoReconnect;
    Global.NetworkManager.disconnect();
};

NetworkLogic.reconnection = function (cb) {
    let token = cc.sys.localStorage.getItem('token');
    if (!token){
        Global.DialogManager.removeLoadingCircle();
        Global.DialogManager.addPopDialog("与服务器断开连接，请重新登录", function(){
            cc.game.restart();
        });
    }else{
        Global.LoginHelper.reconnection(token, function (data) {
            Global.Utils.invokeCallback(cb, data);
        }, function () {
            Global.Utils.invokeCallback(cb, {code: 1});
            Global.DialogManager.removeLoadingCircle();
        });
    }
};

NetworkLogic.messageCallbackHandler = function (router, data) {
    if (router === 'PopDialogContentPush') {
        if (!!Global.Code[data.code]) {
            Global.DialogManager.addPopDialog(Global.Code[data.code]);
        } else if (!!data.content){
            Global.DialogManager.addPopDialog(data.content);
        } else{
            Global.DialogManager.addPopDialog('游戏错误，错误码：' + data.code);
        }
    } else if (router === 'ServerMessagePush'){
        if (!data.pushRouter){
            console.error('ServerMessagePush push router is invalid', data);
            return;
        }
        messageCallback.emitMessage(data.pushRouter, data);
    } else if (router === 'ServerDisconnection'){
        // 检测是否是系统主动断开连接
        if(data.code === 1000 && !NetworkLogic.isManualCloseServerConnection){
            Global.DialogManager.removeLoadingCircle();
            dialogManager.addPopDialog("服务器主动断开连接，请稍后登录", function(){
                cc.sys.localStorage.setItem("token", "");
                cc.game.restart();
            });
            return;
        }
        // 如果不是手动断开则执行断线重连
        if (!NetworkLogic.isManualCloseServerConnection){
            Global.DialogManager.addLoadingCircle();
            setTimeout(function () {
				Global.DialogManager.removeLoadingCircle();
                NetworkLogic.reconnection(function (data) {
                    if (!data || data.code !== 0){
                        dialogManager.addPopDialog("与服务器断开连接，请重新登录", function(){
                            cc.sys.localStorage.setItem("token", "");
                            cc.game.restart();
                        });
                    }else{
                        NetworkLogic.isManualCloseServerConnection = false;
                    }
                });
            }, 2000);
        }else{
            NetworkLogic.isManualCloseServerConnection = false;
        }
    }
};

NetworkLogic.gameServerHttpRequest = function (route, method, data, cbSuccess, cbFail) {
    let url = constant.gateServerAddress + route;
    let params = {
        url: url,
        method: method,
        data: data,
        cb: function (err, response) {
            if (!!err){
                if (!!cbFail){
                    utils.invokeCallback(cbFail, err);
                }else{
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addTipDialog("网络异常，请检查网络连接");
                }
            }else{
                if (response.code !==0){
                    if (!!cbFail){
                        utils.invokeCallback(cbFail, response.code);
                    }else{
                        Global.DialogManager.removeLoadingCircle();
                        Global.DialogManager.addTipDialog(code[response.code] + "");
                    }
                }else{
                    utils.invokeCallback(cbSuccess, response);
                }
            }
        }
    };
    Global.CCHelper.httpRequest(params);
};
