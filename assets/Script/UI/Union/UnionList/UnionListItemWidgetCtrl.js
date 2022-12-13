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
        unionName: cc.RichText,
        inviteCode: cc.Label,
        ownerAvatar: cc.Sprite,
        ownerNickname: cc.Label,
        ownerUid: cc.Label,
        memberCount: cc.Label,
        onlineCount: cc.Label
    },

    start () {

    },

    initWidget(unionInfo, cb){
        this.unionName.string = "<outline width=2 color=#8C5229><color=#fffcf4>" + unionInfo.unionName + "</c></outline>";
        let unionList = Global.UserModel.unionInfo;
        let unionItem = unionList.find(function (ele) {
            return ele.unionID === unionInfo.unionID;
        });
        this.inviteCode.string = unionItem.inviteID;
        this.ownerNickname.string = "******";
        this.ownerUid.string = "******";
        this.memberCount.string = "****";
        this.onlineCount.string = "***";

        Global.CCHelper.updateSpriteFrame(unionInfo.ownerAvatar, this.ownerAvatar);

        this.unionInfo = unionInfo;
        this.callback = cb;
    },

    onBtnClick(){
        this.callback(this.unionInfo.unionID);
    }

    // update (dt) {},
});
