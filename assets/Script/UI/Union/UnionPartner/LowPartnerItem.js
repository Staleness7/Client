cc.Class({
    extends: cc.Component,

    properties: {
        uid: cc.Label,
        nickname: cc.Label,
        avatar: cc.Sprite,
        rebateRate: cc.Label,
        yesterdayDraw: cc.Label,
        yesterdayBigWin: cc.Label,
        yesterdayUser: cc.Label,

        operationNode: cc.Node
    },

    start () {

    },

    initWidget(userInfo, unionID){
        this.unionID = unionID;
        this.userInfo = userInfo;

        this.uid.string = userInfo.uid;
        Global.CCHelper.updateSpriteFrame(userInfo.avatar, this.avatar);
        this.nickname.string = userInfo.nickname;

        this.rebateRate.string = userInfo.rebateRate * 100 + "%";
        this.yesterdayDraw.string = userInfo.memberYesterdayDraw;
        this.yesterdayBigWin.string = parseFloat(userInfo.todayRebate.toFixed(2));
        this.yesterdayUser.string = parseFloat(userInfo.yesterdayRebate.toFixed(2));

        this.operationNode.active = userInfo.spreaderID === Global.UserModel.uid;
    },

    onBtnClick(event, parameter){
        if (this.userInfo.spreaderID !== Global.UserModel.uid) return;
        if (parameter === 'partner'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionPartnerListDialog", {unionID: this.unionID, userInfo: this.userInfo}, null, "UnionPartnerListDialog" + Date.now())
        } else if (parameter === 'member'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionLowMemberListDialog", {unionID: this.unionID, userInfo: this.userInfo}, null, "UnionLowMemberListDialog" + Date.now())
        }else if (parameter === 'modifyRebate'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionModifyPartnerRebateDialog", {unionID: this.unionID, userInfo: this.userInfo});
        }
    }
});
