cc.Class({
    extends: cc.Component,

    properties: {
        nicknameText: cc.Label,
        headIcon: cc.Sprite,
        headFrame: cc.Sprite,
        scoreText: cc.Label,

        uidLabel: cc.Label,

        inviteBtn: cc.Node,

        broadcastNode: cc.Node,
        broadcastWidget: cc.Prefab,

        debugMsg: cc.Node,
    },

    onLoad: function () {
        //界面数据更新，填充
        Global.MessageCallback.addListener('SelfEntryRoomPush', this);
        Global.MessageCallback.addListener('UpdateUserInfoUI', this);
        Global.MessageCallback.addListener('ReConnectSuccess', this);

        // 初始化广播组件
        let node = cc.instantiate(this.broadcastWidget);
        node.parent = this.broadcastNode;

        // 播放背景音乐
        let hallMusic = cc.sys.localStorage.getItem("hallMusic");
        Global.AudioManager.startPlayBgMusic("UI/Hall/Sound/" + (hallMusic === "hallMusic2"? "hall_bg_music2": "hall_bg_music1"));

        this.debugMsg.active = !cc.sys.isNative;
        this.checkJoinRoom();
        this.updatePlayerInfo();

        // 每次登录时重新获取定位信息
        if (!!this.dialogParameters && this.dialogParameters.lastDialog === 'login'){
            Global.PlatformHelper.getLocation( (err, result)=> {
                if(!!err){
                    Global.API.hall.updateUserAddressRequest("", "");
                }else{
                    Global.API.hall.updateUserAddressRequest(result.address || "", result.location || "");
                }
            });
        }
    },

    start: function () {
	},

    onDestroy: function() {
        Global.MessageCallback.removeListener('SelfEntryRoomPush', this);
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
        Global.MessageCallback.removeListener('ReConnectSuccess', this);
    },

    messageCallbackHandler: function(router, data) {
        switch (router) {
            case 'SelfEntryRoomPush':
                Global.GameHelper.enterGame(data.gameType, function (err, gameInfo) {
                    if (!err){
                        Global.DialogManager.destroyAllDialog([gameInfo.gameDialog]);
                    }
                }.bind(this));
                break;
            case 'UpdateUserInfoUI':
            case 'ReConnectSuccess':
                this.updatePlayerInfo();
                break;
        }
    },

    updatePlayerInfo: function() {
        //大厅
        this.nicknameText.string = Global.UserModel.convertNickname(Global.UserModel.nickname);
        this.scoreText.string = Global.UserModel.gold;
        Global.CCHelper.updateSpriteFrame(Global.UserModel.avatar, this.headIcon);
        this.uidLabel.string = "ID:" + Global.UserModel.uid;

        this.inviteBtn.active = Global.UserModel.inviteMsg.length > 0;
    },

    checkJoinRoom: function () {
        //玩家在房间
        let roomID = Global.UserModel.roomID;
        if (!!roomID) {
            Global.DialogManager.addLoadingCircle(1);
            Global.API.hall.joinRoomRequest(roomID, function () {}, function () {
                Global.DialogManager.removeLoadingCircle();
            });
        }
    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'head':
                Global.DialogManager.createDialog('UI/UserInfo/UserInfoDialog');
                break;
            case 'shop':
            case 'addGold':
                Global.DialogManager.addTipDialog("暂未开启，敬请期待");
                break;
            case 'createRoom':
                Global.DialogManager.createDialog('UI/Room/CreateRoomDialog');
                break;
            case 'joinRoom':
                Global.DialogManager.createDialog('UI/Room/JoinRoomDialog');
                break;
            case 'union':
                Global.DialogManager.createDialog("UI/Union/UnionList/UnionListDialog");
                break;
            case 'settings':
                Global.DialogManager.createDialog("UI/Setting/SettingDialog", {type: "hall"});
                break;
            case 'realname':
                Global.DialogManager.createDialog("UI/UserInfo/AuthDialog");
                break;
            case 'email':
                Global.DialogManager.createDialog('UI/Mail/MailDialog');
                break;
            case 'share':
                Global.DialogManager.createDialog('UI/Share/ShareDialog');
                break;
            case 'notice':
                Global.DialogManager.createDialog('UI/Active/ActiveDialog');
                break;
            case 'inviteMsg':
                let msg = Global.UserModel.inviteMsg[0];
                if (!msg) return;
                Global.DialogManager.addPopDialog(msg.nickname + "邀请你加入" + msg.unionName + "亲友圈", function () {
                    Global.API.hall.operationInviteJoinUnionRequest(msg.uid, msg.unionID, true);
                }.bind(this), function () {
                    Global.API.hall.operationInviteJoinUnionRequest(msg.uid, msg.unionID, false);
                }.bind(this));
                break;
            case 'record':
                Global.DialogManager.createDialog('UI/Record/GameRecordDialog');
                break;
            case 'sendTestData':
                Global.DialogManager.createDialog('UI/SendTestData/SendTestData');
                break;
        }
    }
});
