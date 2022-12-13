cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        nicknameText: cc.Label,
        idText: cc.Label,
        goldNumText: cc.Label,
        sexLabel: cc.Label,
        phoneLabel: cc.Label,
        addressLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    updatePlayerInfo: function () {
        this.avatar.node.active = false;
        Global.CCHelper.updateSpriteFrame(Global.UserModel.avatar, this.avatar, function () {
            this.avatar.node.active = true;
        }.bind(this));

        this.nicknameText.string = Global.UserModel.nickname;
        this.idText.string = Global.UserModel.uid;
        this.goldNumText.string = Global.UserModel.gold;

        if(Global.UserModel.sex === 0){
            this.sexLabel.string = "男";
        } else{
            this.sexLabel.string = "女";
        }

        this.phoneLabel.string = Global.UserModel.mobilePhone;
        this.addressLabel.string = Global.UserModel.location;
    },

    start () {
        this.updatePlayerInfo();
        Global.MessageCallback.addListener('UpdateUserInfoUI', this);
    },

    onDestroy () {
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
    },

    messageCallbackHandler: function(router, msg) {
        switch (router) {
            case 'UpdateUserInfoUI':
                this.updatePlayerInfo();
                break;
        }
    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'changeAvatar':
                Global.DialogManager.createDialog('UserInfo/ChangeAvatarDialog');
                break;
            case 'settings':
                Global.DialogManager.createDialog('Settings/SettingDialog');
                break;
            case 'addGold':
                Global.DialogManager.addTipDialog("暂未开启");
                break;
            case 'logout':
                Global.NetworkLogic.disconnect(false);
                Global.DialogManager.destroyAllDialog();
                Global.DialogManager.createDialog('UI/Login/LoginDialog', {logoutEvent: true});
                break;
            case 'bindPhone':
                Global.DialogManager.createDialog("UI/UserInfo/BindPhoneDialog");
                break;

        }
    },

    // update (dt) {},
});
