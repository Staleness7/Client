cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        nicknameText: cc.Label,
        idText: cc.Label,
        status: cc.Label,

        spreaderID: cc.Label,
        joinTime: cc.Label,
        score_safeScore: cc.Label,

        forbidBtn: cc.Node,
        cancelForbidBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let userInfo = this.dialogParameters.userInfo;
        this.callback = this.dialogParameters.cb;
        this.unionID = this.dialogParameters.unionID;
        this.unionOwnerID = this.dialogParameters.unionOwnerID;

        this.nicknameText.string = userInfo.nickname;
        this.idText.string = userInfo.uid;
        Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);

        this.status.string = userInfo.prohibitGame?"禁止游戏":"正常";

        this.forbidBtn.active = !userInfo.prohibitGame;
        this.cancelForbidBtn.active = userInfo.prohibitGame;

        this.spreaderID.string = userInfo.spreaderID;
        this.joinTime.string = new Date(userInfo.joinTime || 0).format("yyyy-MM-dd hh:mm:ss");
        this.score_safeScore.string = userInfo.score + ' / ' + userInfo.safeScore ;

        this.userInfo = userInfo;

        Global.MessageCallback.addListener("UpdateMemberScoreList", this);
    },

    onDestroy(){
        Global.MessageCallback.removeListener("UpdateMemberScoreList", this);
    },

    messageCallbackHandler: function(router, data) {
        switch (router) {
            case 'UpdateMemberScoreList':
                this.userInfo.score = data.score;
                break;
        }
    },


    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'forbid':
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.updateForbidGameStatusRequest(this.unionID, this.userInfo.uid, true, function () {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addTipDialog("操作成功");

                    this.status.string = "禁止游戏";
                    this.forbidBtn.active = false;
                    this.cancelForbidBtn.active = true;
                    Global.Utils.invokeCallback(this.callback, true);
                }.bind(this));
                break;
            case 'cancelForbid':
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.updateForbidGameStatusRequest(this.unionID, this.userInfo.uid, false, function () {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addTipDialog("操作成功");

                    this.status.string = "正常";
                    this.forbidBtn.active = true;
                    this.cancelForbidBtn.active = false;
                    Global.Utils.invokeCallback(this.callback, false);
                }.bind(this));
                break;
            case 'addScore':
                Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionChangeMemberScoreDialog", {unionID: this.unionID, memberUid: this.userInfo.uid, score: this.userInfo.score, operationType: 'add', unionOwnerID: this.unionOwnerID});
                break;
            case 'jianScore':
                Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionChangeMemberScoreDialog", {unionID: this.unionID, memberUid: this.userInfo.uid, score: this.userInfo.score, operationType: 'jian', unionOwnerID: this.unionOwnerID});
                break;
            case 'scoreDetail':

                break;
        }
    },

    // update (dt) {},
});
