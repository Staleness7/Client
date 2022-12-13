cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        time: cc.Label,
        content: cc.Label,
        rewardNode: cc.Node,
        rewardGold: cc.Node,
        rewardScore: cc.Node,
        rewardGoldNum: cc.Label,
        rewardScoreNum: cc.Label,
        getBtn: cc.Button,
        alreadyGetNode: cc.Node,
        getRewardNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.rewardGold.active = false;
        this.rewardScore.active = false;

        this.data = this.dialogParameters.mailData;

        this.title.string = this.data.title.substr(0, 10);
        this.time.string = '时间：' + (new Date(this.data.createTime)).format("yyyy/MM/dd/h:m");
        this.content.string = this.data.content;

        this.getBtn.node.active = false;
        this.alreadyGetNode.active = false;
        if (this.rewardGoldNum.active || this.rewardScore.active) {
            if (parseInt(this.data.status) === Global.Enum.emailStatus.NOT_RECEIVE) {
                this.getBtn.node.active = true;
            }else{
                this.alreadyGetNode.active = true;
            }
        }else{
            this.rewardNode.active = false;
        }

        if (!this.data.isRead){
            Global.UserModel.setMailRead(this.data.id);
            Global.API.hall.readEmailRequest(this.data.id, function () {
                Global.MessageCallback.emitMessage('UpdateUserInfoUI');
            });
        }
    },

    onBtnClk: function (event, param) {
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'delete':
                Global.API.hall.deleteEmailRequest(this.data.id, function () {
                    Global.DialogManager.addTipDialog('删除成功');
                    Global.DialogManager.destroyDialog(this);
                    Global.MessageCallback.emitMessage('UpdateUserInfoUI');
                }.bind(this));
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
