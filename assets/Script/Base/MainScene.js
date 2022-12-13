cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        // 初始设置
        cc.debug.setDisplayStats(false);
        // 如果是网页版本，则降低帧率
        if (cc.sys.isBrowser) cc.game.setFrameRate(30);
        // 初始化全局变量
        this.initGlobal();
        // 适配处理
        Global.CCHelper.screenAdaptation(new cc.Size(1334, 750), this.node.getComponent(cc.Canvas));

        // 初始化界面管理器
        Global.DialogManager.init(this.node);

        //音乐音效初始化
        Global.AudioManager.init();

        // 初始化网络
        Global.NetworkLogic.init();

        cc.game.on(cc.game.EVENT_HIDE, this.onEventHide.bind(this));
        cc.game.on(cc.game.EVENT_SHOW, this.onEventShow.bind(this));

        let serverIndex = cc.sys.localStorage.getItem("SERVER_INDEX");
        if (!serverIndex){
            serverIndex = Global.Constant.debug?1:2;
        } else{
            serverIndex = parseInt(serverIndex);
        }
        this.updateServer(serverIndex);

        if (Global.Constant.isCheckUpdate) {
            Global.DialogManager.createDialog('UI/Update/UpdateDialog', {cb: function () {
                this.enterGame();
            }.bind(this)});
        } else {
            this.enterGame();
        }
    },

    onDestroy: function () {
        cc.game.off(cc.game.EVENT_HIDE, this.onEventHide.bind(this));
        cc.game.off(cc.game.EVENT_SHOW, this.onEventShow.bind(this));

        Global.NetworkLogic.deInit();
    },

    initGlobal: function(){
        Global.Constant = require('../Constant/Constant');
        Global.Enum = require('../Constant/enumeration');
        Global.Code = require('../Constant/code');

        Global.MessageCallback = require('./MessageCallback');
        Global.DialogManager = require('./DialogManager');
        Global.AudioManager = require('./AudioManager');
        Global.NetworkManager = require('./NetworkManager');
        Global.NetworkLogic = require('./NetworkLogic');

        Global.CCHelper = require('../Utils/CCHelper');
        Global.Utils = require('../Utils/utils');
        Global.LoginHelper = require('../Utils/LoginHelper');
        Global.GameHelper = require('../Utils/GameHelper');
        Global.PlatformHelper = require('../Utils/PlatformHelper');
        Global.LogHelper = require('../Utils/LogHelper');
        Global.LogHelper.replaceConsole();

        Global.API = require('../API/Api');

        Global.UserModel = require('../Models/UserModel');
        Global.GameModel = require('../Models/GameModel');
        Global.ConfigModel = require('../Models/ConfigModel');
    },

    onEventHide: function () {
        Global.MessageCallback.emitMessage("GAME_EVENT", cc.game.EVENT_HIDE);
    },

    onEventShow: function () {
        Global.MessageCallback.emitMessage("GAME_EVENT", cc.game.EVENT_SHOW);
    },

    enterGame: function () {
        let loadDirArr = [
            "Common", "UI","Game/Common"
        ];
        Global.DialogManager.createDialog("UI/Loading/LoadingDialog", {loadDirArr: loadDirArr, cb: function () {
            if (Global.Constant.isAutoLogin){
                Global.DialogManager.addLoadingCircle();
                Global.LoginHelper.quickLogin(null, false, function (err) {
                    if (!!err){
                        Global.DialogManager.createDialog("UI/Login/LoginDialog", null, function () {
                            Global.DialogManager.destroyDialog("UI/Loading/LoadingDialog");
                            Global.DialogManager.removeLoadingCircle();
                        });
                    }else{
                        Global.DialogManager.createDialog("UI/Hall/HallDialog", {lastDialog: "login"}, function () {
                            Global.DialogManager.destroyDialog("UI/Loading/LoadingDialog");
                            Global.DialogManager.removeLoadingCircle();
                        });
                    }
                });
            }else{
                Global.DialogManager.createDialog("UI/Login/LoginDialog", null, function () {
                    Global.DialogManager.destroyDialog("UI/Loading/LoadingDialog");
                    Global.DialogManager.removeLoadingCircle();
                });
            }
        }.bind(this)});
    },

    updateServer: function (serverIndex) {
        serverIndex = serverIndex % Global.Constant.serverAddressArr.length;
        let serverInfo = Global.Constant.serverAddressArr[this.serverIndex];
        if (!serverInfo){
            console.warn("not find server index:", this.serverIndex);
            return;
        }
        cc.sys.localStorage.setItem("SERVER_INDEX", serverIndex.toString());
        //this.serverName.string = serverInfo.name;
        Global.Constant.gateServerAddress = serverInfo.gateServerAddress;
    }
});
