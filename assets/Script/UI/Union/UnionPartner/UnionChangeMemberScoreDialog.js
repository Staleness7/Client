cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        selfScoreLabel: cc.Label,
        scoreEditBox: cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.unionID = this.dialogParameters.unionID;
        this.unionOwnerID = this.dialogParameters.unionOwnerID;
        this.score = this.dialogParameters.score;
        this.memberUid = this.dialogParameters.memberUid;

        this.scoreLabel.string = parseFloat(this.score.toFixed(2));
        let unionInfoItem = Global.UserModel.unionInfo.find(function (ele) {
            return ele.unionID === this.unionID;
        }.bind(this));
        this.selfScoreLabel.string = parseFloat(unionInfoItem.score.toFixed(2));

        if (this.dialogParameters.operationType === 'add'){
            this.scoreEditBox.placeholder = "请输入增加的积分数量";
        } else{
            this.scoreEditBox.placeholder = "请输入减少的积分数量";
        }
    },

    start () {
    },

    onBtnClick(event, parameter){
        if (parameter === "close"){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'confirm'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            let count = parseFloat(parseFloat(this.scoreEditBox.string).toFixed(2));
            if (!count || count <= 0){
                Global.DialogManager.addTipDialog("请输入正确的积分数量");
                return;
            }
            if (this.dialogParameters.operationType === 'add'){
                if (this.unionOwnerID !== Global.UserModel.uid && count > unionInfoItem.score){
                    Global.DialogManager.addTipDialog("积分不足");
                    return;
                }
            } else {
                if (count > this.score){
                    Global.DialogManager.addTipDialog("积分不足");
                    return;
                }
                count *= -1;
            }
            Global.DialogManager.addLoadingCircle(1);
            Global.API.hall.modifyScoreRequest(this.unionID, this.memberUid, count, function () {
                Global.DialogManager.removeLoadingCircle();
                Global.DialogManager.addTipDialog("操作成功");

                this.score += count;

                Global.MessageCallback.emitMessage("UpdateMemberScoreList", {uid: this.memberUid, score: this.score, changeScore: count});

                this.scoreEditBox.string = "";

                this.updateScore();

                Global.DialogManager.destroyDialog(this);
            }.bind(this));
        }else if (parameter === 'input'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/InputDialog", {cb: function (content) {
                    this.scoreEditBox.string = content;
                }.bind(this), maxLength: 8});
        }
    },

    updateScore(){
        this.scoreLabel.string = parseFloat(this.score.toFixed(2));
        let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
        this.selfScoreLabel.string = parseFloat(unionInfoItem.score.toFixed(2));
    }
});
