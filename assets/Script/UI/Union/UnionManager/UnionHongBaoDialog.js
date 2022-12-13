cc.Class({
    extends: cc.Component,

    properties: {
        openStatus: cc.Toggle,
        startTime: cc.EditBox,
        endTime: cc.EditBox,
        count: cc.EditBox,
        totalScore: cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.unionInfo = this.dialogParameters.unionInfo;
        this.unionID = this.dialogParameters.unionInfo.unionID;

        let hongBaoInfo = this.dialogParameters.unionInfo.hongBaoInfo;
        if (!!hongBaoInfo){
            this.openStatus.isChecked = hongBaoInfo.status;
            this.startTime.string = hongBaoInfo.startTime.toString();
            this.endTime.string = hongBaoInfo.endTime.toString();
            this.count.string = hongBaoInfo.count.toString();
            this.totalScore.string = hongBaoInfo.totalScore.toString();
        }
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        }else if (parameter === 'confirm'){
            let status = this.openStatus.isChecked;
            if (this.startTime.string.length === 0){
                Global.DialogManager.addTipDialog("请输入正确活动开始时间");
                return;
            }
            let startTime = parseInt(this.startTime.string);
            if(startTime < 0 || startTime > 23){
                Global.DialogManager.addTipDialog("请输入正确活动开始时间");
                return;
            }
            if (this.endTime.string.length === 0){
                Global.DialogManager.addTipDialog("请输入正确活动结束时间");
                return;
            }
            let endTime = parseInt(this.endTime.string);
            if(endTime < 0 || endTime > 23){
                Global.DialogManager.addTipDialog("请输入正确活动结束时间");
                return;
            }
            if(endTime <= startTime){
                Global.DialogManager.addTipDialog("活动结束时间必须大于活动开始时间");
                return;
            }
            if (this.count.string.length === 0){
                Global.DialogManager.addTipDialog("请输入正确红包个数");
                return;
            }
            let count = parseInt(this.count.string);
            if (count <= 0){
                Global.DialogManager.addTipDialog("请输入正确红包个数");
                return;
            }
            if (this.totalScore.string.length === 0){
                Global.DialogManager.addTipDialog("请输入正确红包总分");
                return;
            }
            let totalScore = parseInt(this.totalScore.string);
            if (totalScore <= 0){
                Global.DialogManager.addTipDialog("请输入正确红包总分");
                return;
            }
            if(totalScore < count){
                Global.DialogManager.addTipDialog("红包总分过低，请重新设置");
                return;
            }
            let self = this;
            Global.DialogManager.addLoadingCircle(1);
            Global.API.hall.hongBaoSettingRequest(this.unionID, status, startTime, endTime, count, totalScore, function () {
                Global.DialogManager.removeLoadingCircle();

                Global.DialogManager.addPopDialog("设置成功", function () {
                    Global.DialogManager.destroyDialog(self);
                })
            })
        }
    }
});
