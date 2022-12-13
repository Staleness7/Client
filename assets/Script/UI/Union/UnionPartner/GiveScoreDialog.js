// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        queryUserInfo: cc.Node,
        avatar: cc.Sprite,
        nickname: cc.Label,
        uid: cc.Label,
        selfScoreLabel: cc.Label,
        selfScoreLabel2: cc.Label,
        giveUid: cc.EditBox,
        giveCount: cc.EditBox,
        giveNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.queryUserData = null;
        this.unionID = this.dialogParameters.unionID;
        this.unionOwnerID = this.dialogParameters.unionOwnerID;

        Global.MessageCallback.addListener('UpdateUserInfoUI', this);

        this.updateInfo();
    },

    onDestroy(){
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
    },

    messageCallbackHandler: function(router, data) {
        switch (router) {
            case 'UpdateUserInfoUI':
                this.updateInfo();
                break;
        }
    },

    onBtnClick(event, parameter){
        if (parameter === 'query'){
            if (this.giveUid.string.length !== 6){
                Global.DialogManager.addTipDialog("请输入正确的玩家ID");
                return;
            }
            Global.API.hall.searchRequest(this.giveUid.string, function (data) {
                let userData = data.msg.userData;
                Global.CCHelper.updateSpriteFrame(userData.avatar, this.avatar);
                this.nickname.string = "昵称:" + userData.nickname;
                this.uid.string = "ID:" + userData.uid;

                this.queryUserInfo.active = true;

                this.queryUserData = userData;
            }.bind(this));
        }  else if (parameter === 'confirm'){
            if (!this.queryUserData) return;
            let count = parseInt(this.giveCount.string) || 0;
            if (count <= 0){
                Global.DialogManager.addTipDialog("赠送积分必须大于0");
                return;
            }
            let unionInfoItem = Global.UserModel.unionInfo.find(function (ele) {
                return ele.unionID === this.unionID;
            }.bind(this));
            if (this.unionOwnerID !== Global.UserModel.uid && count > unionInfoItem.score){
                Global.DialogManager.addTipDialog("积分不足");
                return;
            }
            if (this.queryUserData.uid === Global.UserModel.uid){
                Global.DialogManager.addTipDialog("无法给自己赠送积分");
                return;
            }
            Global.DialogManager.addPopDialog("赠送给" + this.queryUserData.nickname + count + "积分，是否确定", function () {
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.giveScoreRequest(this.unionID, this.queryUserData.uid, count, function () {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addTipDialog("赠送成功");

                    this.giveNode.active = false;
                }.bind(this));
            }.bind(this), function () {});
        } else if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'closeNode'){
            this.giveNode.active = false;
        } else if (parameter === 'giveRecord'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionGiveScoreRecordDialog", {unionID: this.unionID});
        } else if (parameter === 'giveScore'){
            if (!this.queryUserData) return;
            this.giveCount.string = "";
            let unionInfoItem = this.queryUserData.unionInfo.find(function (ele) {
                return ele.unionID === this.unionID;
            }.bind(this));
            if (!unionInfoItem){
                Global.DialogManager.addTipDialog("玩家不在本亲友圈中");
                return;
            }
            this.giveNode.active = true;
        } else if (parameter === 'inputUid'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/InputDialog", {cb: function (content) {
                    this.giveUid.string = content;
                }.bind(this), maxLength: 6});
        }else if (parameter === 'inputScore'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/InputDialog", {cb: function (content) {
                    this.giveCount.string = content;
                }.bind(this), maxLength: 6});
        }
    },

    updateInfo: function () {
        let unionInfoItem = Global.UserModel.unionInfo.find(function (ele) {
            return ele.unionID === this.unionID;
        }.bind(this));

        this.selfScoreLabel.string = parseFloat(unionInfoItem.score.toFixed(2));
        this.selfScoreLabel2.string = parseFloat(unionInfoItem.score.toFixed(2));
    }

    // update (dt) {},
});
