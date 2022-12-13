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
        this.unionID = this.dialogParameters.unionID;
    },

    onBtnClick(event, parameter){
        if (parameter === 'query'){
            if (this.inviteUserPhone.string.length !== 6){
                Global.DialogManager.addTipDialog("请输入正确的用户ID");
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
            Global.DialogManager.addLoadingCircle(1);
            Global.API.hall.addPartnerRequest(this.unionID, this.queryUserData.uid, function () {
                Global.DialogManager.removeLoadingCircle();
                Global.DialogManager.addTipDialog("邀请成功");
            });
        } else if (parameter === 'cancel'){
            this.queryUserInfo.active = false;
        } else if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'input'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/InputDialog", {cb: function (content) {
                    this.inviteUserPhone.string = content;
                }.bind(this), maxLength: 6});
        }
    }

    // update (dt) {},
});
