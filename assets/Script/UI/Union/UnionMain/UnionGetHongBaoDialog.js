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
        hongBaoNode: cc.Node,
        animationNode: cc.Node,
        animationCircleNode:  cc.Node,

        hongBaoBg: cc.Node,
        hongBaoShow: cc.Node,

        score1Label: cc.Label,
        score2Label: cc.Label,

        notHongBaoNode: cc.Node,

        lizi1: cc.Node,
        lizi2: cc.Node,

        description: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let action1 = cc.sequence([cc.scaleTo(0.8, 1.1, 0.95), cc.scaleTo(0.8, 0.9, 1.05)]);
        this.hongBaoNode.runAction(cc.repeatForever(action1));

        this.unionID = this.dialogParameters.unionInfo.unionID;
        this.hongBaoInfo = this.dialogParameters.unionInfo.hongBaoInfo;
        this.unionInfo = this.dialogParameters.unionInfo;
        if (!this.hongBaoInfo || !this.hongBaoInfo.status){
            this.description.string = "暂未开启活动";
        } else{
            this.description.string = "每天" + this.hongBaoInfo.startTime + "点~" + this.hongBaoInfo.endTime + "点分发红包,发完即止！先到先得！"
        }
    },

    onBtnClick(event, parameter){
        switch (parameter){
            case "close":
                Global.DialogManager.destroyDialog(this);
                break;
            case "open":
                let hongBaoInfo = this.hongBaoInfo;
                if (!hongBaoInfo || !hongBaoInfo.status) {
                    Global.DialogManager.addTipDialog("活动暂未开启~");
                    return;
                }
                let time = new Date().getHours();
                if (hongBaoInfo.startTime > time || hongBaoInfo.endTime <= time) {
                    Global.DialogManager.addTipDialog("活动暂未开启~");
                    return;
                }
                let hongBaoUidList = this.unionInfo.hongBaoUidList || [];
                let hongBaoScoreList = this.unionInfo.hongBaoScoreList || [];
                // 已经领取过
                if (hongBaoUidList.indexOf(Global.UserModel.uid) !== -1) {
                    Global.DialogManager.addTipDialog("今天已领取，明天再来吧~");
                    return;
                }
                // 没有红包，判断今天是否已经抢过红包
                if (hongBaoScoreList.length === 0){
                    let getHongBaoTime = cc.sys.localStorage.getItem("GET_HONG_BAO_TIME" + this.unionID);
                    let timeStr = new Date().format("yyyyMMdd");
                    if (timeStr === getHongBaoTime){
                        Global.DialogManager.addTipDialog("红包领完了，明天再来吧~");
                        return;
                    }
                }
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.getHongBaoRequest(this.unionID, function (data) {
                    Global.DialogManager.removeLoadingCircle();
                    cc.sys.localStorage.setItem("GET_HONG_BAO_TIME" + this.unionID, new Date().format("yyyyMMdd"));
                    let score = data.msg.score;
                    if (score === -1){
                        Global.DialogManager.addTipDialog("活动暂未开启~");
                        return;
                    }
                    this.startAnimation(score);
                }.bind(this));
                break;
        }
    },

    startAnimation(score){
        this.animationNode.active = true;
        this.animationNode.opacity = 255;
        this.animationNode.scale = 1;
        this.animationCircleNode.active = true;
        this.animationCircleNode.opacity = 150;
        this.animationCircleNode.scale = 1;

        this.hongBaoBg.active = true;
        this.hongBaoShow.active = false;

        let action1 = cc.scaleTo(0.5, 6);
        action1.easing(cc.easeOut(3));
        this.animationNode.runAction(cc.sequence([action1, cc.fadeOut(0.3)]));

        let action2 = cc.scaleTo(0.6, 4);
        action2.easing(cc.easeOut(3));
        this.animationCircleNode.runAction(cc.sequence([cc.delayTime(0.1), action2, cc.fadeOut(0.2)]));

        this.lizi1.active = true;

        this.scheduleOnce(function () {
            this.hongBaoNode.stopAllActions();
            this.hongBaoNode.runAction(cc.scaleTo(0.3, 1));

            this.hongBaoBg.active = false;
            this.hongBaoShow.active = true;

            this.score2Label.string = score.toString();
            this.score1Label.string = score.toString();
            if (score === 0){
                this.score1Label.string = "";

                this.notHongBaoNode.active = true;
            } else {
                this.lizi2.active = true;
            }
        }, 0.3);
    }
});
