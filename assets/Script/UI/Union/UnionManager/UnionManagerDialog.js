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
        closeBtn: cc.Node,
        openingBtn: cc.Node,
        lotteryCloseBtn: cc.Node,
        lotteryOpenBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.unionInfo = this.dialogParameters.unionInfo;

        this.closeBtn.active = !!this.unionInfo.opening;
        this.openingBtn.active = !this.unionInfo.opening;

        this.lotteryCloseBtn.active = !!this.unionInfo.resultLotteryInfo && !!this.unionInfo.resultLotteryInfo.status;
        this.lotteryOpenBtn.active = !this.lotteryCloseBtn.active;
    },

    onBtnClick(event, parameter){
        if (parameter === 'transfer'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionTransferDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'changeName'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionChangeNameDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'gameRule'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionRoomRuleDialog", {unionID: this.unionInfo.unionID, ruleList: this.unionInfo.roomRuleList});
        } else if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'updateNotice'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionManagerNoticeDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'rank'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionRankDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'data'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionDataDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'unionOpening'){
            Global.DialogManager.addPopDialog("是否停止打烊？", function () {
                Global.API.hall.updateOpeningStatusRequest(this.unionInfo.unionID, true, function (data) {
                    this.closeBtn.active = true;
                    this.openingBtn.active = false;

                    Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
                }.bind(this))
            }.bind(this), function () {});
        } else if (parameter === 'unionClose'){
            Global.DialogManager.addPopDialog("是否开始打烊，所有玩家将无法开始新的牌局？", function () {
                Global.API.hall.updateOpeningStatusRequest(this.unionInfo.unionID, false, function (data) {
                    this.closeBtn.active = false;
                    this.openingBtn.active = true;

                    Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
                }.bind(this))
            }.bind(this), function () {});
        } else if (parameter === 'hongbao'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionHongBaoDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'lotteryClose'){
            Global.DialogManager.addPopDialog("是否确定关闭红包抽奖？", function () {
                Global.API.hall.updateLotteryStatusRequest(this.unionInfo.unionID, false, function (data) {
                    this.lotteryCloseBtn.active = false;
                    this.lotteryOpenBtn.active = true;
                }.bind(this))
            }.bind(this), function () {});
        } else if (parameter === 'lotteryOpen'){
            Global.DialogManager.addPopDialog("是否确定开启红包抽奖？", function () {
                Global.API.hall.updateLotteryStatusRequest(this.unionInfo.unionID, true, function (data) {
                    this.lotteryCloseBtn.active = true;
                    this.lotteryOpenBtn.active = false;
                }.bind(this))
            }.bind(this), function () {});
        }
    }


    // update (dt) {},
});
