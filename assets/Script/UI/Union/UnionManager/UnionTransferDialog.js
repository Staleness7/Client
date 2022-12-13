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
        inviteUserPhone: cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.queryUserData = null;
        this.unionID = this.dialogParameters.unionInfo.unionID;
    },

    onBtnClick(event, parameter){
        if (parameter === 'query'){
            if (this.inviteUserPhone.string.length !== 8){
                Global.DialogManager.addTipDialog("请输入正确的用户ID");
                return;
            }
            if (this.inviteUserPhone.string === Global.UserModel.uid){
                Global.DialogManager.addTipDialog("不能转移给自己");
                return;
            }
            Global.API.hall.searchRequest(this.inviteUserPhone.string, function (data) {
                let userData = data.msg.userData;
                Global.CCHelper.updateSpriteFrame(userData.avatar, this.avatar);
                this.nickname.string = "昵称:" + userData.nickname;
                this.uid.string = "ID:" + userData.uid;

                this.queryUserInfo.active = true;

                this.queryUserData = userData;
            }.bind(this));
        } else if (parameter === 'confirm'){
            if (!this.queryUserData) return;
            let unionInfoItem = this.queryUserData.unionInfo.find(function (ele) {
                return ele.unionID === this.unionID
            }.bind(this));
            if (!unionInfoItem){
                Global.DialogManager.addTipDialog("转移目标玩家必须在联盟中");
                return;
            }
            Global.DialogManager.addPopDialog("是否确定转移联盟", function () {
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.transferUnionRequest(this.unionID, this.queryUserData.uid, function (data) {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addTipDialog("转移成功");

                    Global.MessageCallback.emitMessage("UpdateUnionInfo", data);

                    Global.DialogManager.destroyDialog(this);
                });
            }.bind(this), function () {});
        } else if (parameter === 'cancel'){
            this.queryUserInfo.active = false;
        } else if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        }
    }

    // update (dt) {},
});
