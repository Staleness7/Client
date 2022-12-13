cc.Class({
    extends: cc.Component,

    properties: {
        versionLabel: cc.Label,
        switchNode: cc.Node,
        serverName: cc.Label,
        lowFrameToggle: cc.Toggle,
        switchAccount: cc.Node,
        accountNickname: cc.Label,
        accountAvatar: cc.Sprite,
    },

    onLoad: function () {
        this.versionLabel.string = Global.Constant.version;
        this.switchNode.active = Global.Constant.debug;
        this.lowFrameToggle.node.active = Global.Constant.debug;
        this.switchAccount.active = Global.Constant.switchAccountEnable;

        if (!!this.switchNode.active){
            let serverIndex = cc.sys.localStorage.getItem("SERVER_INDEX");
            serverIndex = parseInt(serverIndex || "0");
            this.updateServer(serverIndex);
        }

        Global.AudioManager.stopBgMusic();

        Global.MessageCallback.addListener('PlatformLogin', this);

    },

    onDestroy: function () {
        Global.MessageCallback.removeListener('PlatformLogin', this);
    },

    messageCallbackHandler: function(router, msg) {
        switch (router) {
            case 'PlatformLogin':
                if (Global.Enum.loginPlatform.WEI_XIN){
                    let accountData={
                        account: msg.userInfo.openid,
                        password: msg.userInfo.openid,
                        loginPlatform: Global.Enum.loginPlatform.WEI_XIN
                    };
                    let userInfo = {
                        nickname: msg.userInfo.nickname,
                        avatar: msg.userInfo.headimgurl,
                        sex: msg.userInfo.sex
                    };
                    Global.DialogManager.addLoadingCircle();
                    console.log('===================='+msg.userInfo.openid);
                    Global.LoginHelper.register(accountData, userInfo, function () {
                        accountData.nickname = Global.UserModel.nickname;
                        cc.sys.localStorage.setItem('account', accountData.account);
                        cc.sys.localStorage.setItem('accountDataArr', JSON.stringify([accountData]));
                        this.enterGame();
                    }.bind(this), function (data) {
                        let err = data.code;
                        if (err === Global.Code.ACCOUNT_OR_PASSWORD_ERROR){
                            Global.DialogManager.addPopDialog("帐号或密码错误，是否清除当前帐号", function () {
                                cc.sys.localStorage.setItem('accountDataArr', "");
                            }.bind(this), function () {});
                        }else{
                            Global.DialogManager.addPopDialog("登录失败，请检查网络后重试");
                        }
                    });
                }
                break;
        }
    },
    
    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'quickStart':
                this.quickLogin();
                break;
            case 'visitorLogin':
                Global.DialogManager.addLoadingCircle();

                let account = cc.sys.localStorage.getItem('account');
                if(account){
                    account = JSON.parse(account);
                    Global.LoginHelper.login(account, null,
                        function () {
                            Global.DialogManager.removeLoadingCircle();
                            this.enterGame();
                        }.bind(this),
                        function () {
                            Global.DialogManager.addPopDialog("登录失败");
                        });
                }else{
                    account = {
                        account: Global.Utils.randomString(16),
                        password: Global.Utils.randomString(16),
                        loginPlatform: Global.Enum.loginPlatform.ACCOUNT
                    };
                    Global.LoginHelper.register(account, null, function () {
                        account.nickname = Global.UserModel.nickname;
                        cc.sys.localStorage.setItem('account', JSON.stringify(account));
                        cc.sys.localStorage.setItem('accountDataArr', JSON.stringify([account]));
                        Global.DialogManager.removeLoadingCircle();
                        this.enterGame();
                    }.bind(this), function (data) {
                        let err = data.code;
                        if (err === Global.Code.ACCOUNT_OR_PASSWORD_ERROR){
                            Global.DialogManager.addPopDialog("帐号或密码错误，是否清除当前帐号", function () {
                                cc.sys.localStorage.setItem('accountDataArr', "");
                            }.bind(this), function () {});
                        }else{
                            Global.DialogManager.addPopDialog("登录失败，请检查网络后重试");
                        }
                    });
                }

                break;
            case 'phone':
                Global.DialogManager.createDialog("UI/Account/LoginPhoneDialog");
                break;
            case 'wxLogin':
                Global.PlatformHelper.wxLogin();
                break;
            case "switchServer":
                this.updateServer(this.serverIndex + 1);
                break;
            case 'lowFrame':
                cc.game.setFrameRate(this.lowFrameToggle.isChecked?12:30);
                break;
            case 'switchAccount':
                Global.DialogManager.createDialog("UI/Login/WxAccountListDialog", {cb: this.updateAccountInfo.bind(this)});
                break;

        }
    },

    enterGame: function () {
        Global.DialogManager.createDialog('UI/Hall/HallDialog', {lastDialog: "login"}, function () {
            Global.DialogManager.destroyDialog(this);
        }.bind(this));
    },

    quickLogin: function () {
        Global.DialogManager.addLoadingCircle();
        Global.LoginHelper.quickLogin(null, true, function (err) {
            Global.DialogManager.removeLoadingCircle();
            if (!!err) {
                if (err === Global.Code.ACCOUNT_OR_PASSWORD_ERROR) {
                    Global.DialogManager.addPopDialog("帐号或密码错误，是否清除当前帐号", function () {
                        cc.sys.localStorage.setItem('accountDataArr', "");
                    }.bind(this), function () {});
                }else{
                    Global.DialogManager.addPopDialog("登录失败，请检查网络后重试");
                }
            }else{
                this.enterGame();
            }
        }.bind(this));
    },
    
    updateServer: function (serverIndex) {
        this.serverIndex = serverIndex % Global.Constant.serverAddressArr.length;
        let serverInfo = Global.Constant.serverAddressArr[this.serverIndex];
        if (!serverInfo){
            console.warn("not find server index:", this.serverIndex);
            return;
        }
        cc.sys.localStorage.setItem("SERVER_INDEX", this.serverIndex.toString());
        this.serverName.string = serverInfo.name;
        Global.Constant.gateServerAddress = serverInfo.gateServerAddress;
    },
    
    updateAccountInfo: function () {
        if (!Global.wxAccountInfo){
            this.accountAvatar.spriteFrame = null;
            this.accountNickname.string = "未选择";
        } else{
            Global.CCHelper.updateSpriteFrame(Global.wxAccountInfo.avatar, this.accountAvatar);
            this.accountNickname.string = Global.wxAccountInfo.nickname;
        }
    }
});
