cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel: cc.Label,
        scoreLabel: cc.Label,
        scoreEditBox: cc.EditBox,
        saveAllBtn: cc.Node,
        takeAllBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.unionID = this.dialogParameters.unionID;
        this.saveAllBtn.active =  this.dialogParameters.operationType === 'save';
        this.takeAllBtn.active =  !this.saveAllBtn.active;

        let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
        if (this.dialogParameters.operationType === 'save'){
            this.saveAllBtn.active =  true;
            this.takeAllBtn.active =  false;
            this.tipLabel.string = "可存入积分:";
            this.scoreLabel.string = parseFloat(unionInfoItem.score.toFixed(2));
        } else{
            this.saveAllBtn.active =  false;
            this.takeAllBtn.active =  true;
            this.tipLabel.string = "可提取积分:";

            this.scoreLabel.string = parseFloat(unionInfoItem.safeScore.toFixed(2));
        }

        Global.MessageCallback.addListener('UpdateUserInfoUI', this);
    },

    start () {
    },

    onDestroy () {
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
    },

    messageCallbackHandler: function(router, msg) {
        switch (router) {
            case 'UpdateUserInfoUI':
                this.updateScore();
                break;
        }
    },

    onBtnClick(event, parameter){
        if (parameter === "close"){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'takeAll'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            this.scoreEditBox.string = Math.floor(unionInfoItem.safeScore);
        } else if (parameter === 'saveAll'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            this.scoreEditBox.string = Math.floor(unionInfoItem.score);
        } else if (parameter === 'confirm'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            let count = parseFloat(this.scoreEditBox.string);
            if (!count){
                Global.DialogManager.addTipDialog("请输入积分");
                return;
            }
            if (this.dialogParameters.operationType !== 'save'){
                if (count > unionInfoItem.safeScore){
                    Global.DialogManager.addTipDialog("积分不足");
                    return;
                }
                count *= -1
            } else {
                if (count > unionInfoItem.score){
                    Global.DialogManager.addTipDialog("积分不足");
                    return;
                }
            }
            Global.DialogManager.addLoadingCircle(1);
            Global.API.hall.safeBoxOperationRequest(this.unionID, count, function () {
                Global.DialogManager.removeLoadingCircle();
                Global.MessageCallback.emitMessage("UpdateOperationSafeBoxList");
            });
        } else if (parameter === 'input'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/InputDialog", {cb: function (content) {
                this.scoreEditBox.string = content;
            }.bind(this), maxLength: 8});
        }
    },

    updateScore(){
        let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
        if (this.dialogParameters.operationType === 'save'){
            this.scoreLabel.string = parseFloat(unionInfoItem.score.toFixed(2));
        }else{
            this.scoreLabel.string = parseFloat(unionInfoItem.safeScore.toFixed(2));
        }
    }
});
