cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        uidLabel: cc.Label,
        nicknameLabel: cc.Label,
        rebateLabel: cc.Label,
        yesterdayUse: cc.Label,
        todayUse: cc.Label,
        rebateEditBox: cc.EditBox,

        myRebateLabel: cc.Label,

        modifyRebateRateNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.unionID = this.dialogParameters.unionID;
        this.userInfo = this.dialogParameters.userInfo;

        Global.CCHelper.updateSpriteFrame(this.userInfo.avatar, this.avatar);
        this.uidLabel.string = this.userInfo.uid;
        this.nicknameLabel.string = this.userInfo.nickname;
        this.rebateLabel.string = this.userInfo.rebateRate * 100 + "%";
        this.yesterdayUse.string = parseFloat(this.userInfo.yesterdayRebate.toFixed(2));
        this.todayUse.string = parseFloat(this.userInfo.todayRebate.toFixed(2));

        let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
        this.myRebateLabel.string = unionInfoItem.rebateRate * 100 + '%';
    },

    start () {
    },

    onBtnClick(event, parameter){
        if (parameter === "close"){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'confirm'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            let rebateRate = parseInt(this.rebateEditBox.string);
            if (rebateRate < 0){
                Global.DialogManager.addTipDialog("点位不能小于0");
                return;
            }
            if (rebateRate > unionInfoItem.rebateRate * 100){
                Global.DialogManager.addTipDialog("合伙人的点位不能大于自己的点位");
                return;
            }
            if (rebateRate < this.userInfo.rebateRate * 100){
                Global.DialogManager.addTipDialog("只能调高合伙人点位，不能调低");
                return;
            }
            let content = "将合伙人" + this.userInfo.nickname + "的点位从" + this.userInfo.rebateRate * 100 + "%调至" + rebateRate + "%，调高后无法再降低请谨慎操作，是否确定调整";
            Global.DialogManager.addPopDialog(content, function () {
                if (rebateRate === this.userInfo.rebateRate * 100){

                    this.modifyRebateRateNode.active = false;
                    this.rebateEditBox.string = "";

                    Global.DialogManager.addTipDialog("修改成功");
                    return;
                }
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.updateUnionRebateRequest(this.unionID, this.userInfo.uid, rebateRate/100, function () {
                    Global.DialogManager.removeLoadingCircle();

                    this.rebateLabel.string = rebateRate + "%";
                    this.rebateEditBox.string = "";
                    this.modifyRebateRateNode.active = false;
                    this.userInfo.rebateRate = rebateRate/100;

                    Global.DialogManager.addTipDialog("修改成功");
                }.bind(this));
            }.bind(this), function () {});
        } else if (parameter === 'closeNode'){
            this.modifyRebateRateNode.active = false;
        } else if (parameter === 'modify'){
            this.modifyRebateRateNode.active = true;

            this.rebateEditBox.string = "";
        }
    }
});
