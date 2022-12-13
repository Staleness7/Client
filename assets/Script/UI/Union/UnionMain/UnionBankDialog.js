cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        safeScoreLabel: cc.Label,
        todayUseLabel: cc.Label,
        yesterdayUseLabel: cc.Label,

        recordListRoot: cc.Node,
        recordListItem: cc.Prefab
    },

    start () {
        this.startIndex = 0;
        this.perCount = 10;
        this.maxCount = 10;

        this.unionID = this.dialogParameters.unionID;

        this.updateScore();

        this.updateList();

        Global.MessageCallback.addListener('UpdateUserInfoUI', this);
        Global.MessageCallback.addListener('UpdateOperationSafeBoxList', this);
    },

    onDestroy () {
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
        Global.MessageCallback.removeListener('UpdateOperationSafeBoxList', this);
    },

    messageCallbackHandler: function(router, msg) {
        switch (router) {
            case 'UpdateUserInfoUI':
                this.updateScore();
                break;
            case 'UpdateOperationSafeBoxList':
                this.startIndex = 0;
                this.perCount = 10;
                this.maxCount = 10;

                this.recordListRoot.removeAllChildren();
                this.updateList();
                break;
        }
    },

    onBtnClk: function (event, param) {
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'save':
                Global.DialogManager.createDialog("UI/Union/UnionMain/UnionOperationScoreDialog", {unionID: this.unionID, operationType: "save"});
                break;
            case 'take':
                Global.DialogManager.createDialog("UI/Union/UnionMain/UnionOperationScoreDialog", {unionID: this.unionID, operationType: "take"});
                break;
            case 'record':
                Global.DialogManager.createDialog("UI/Union/UnionMain/UnionRebateRecordDialog", {unionID: this.unionID});
                break;
            case 'modifyRecord':
                Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionChangeScoreRecordDialog", {unionID: this.unionID});
                break;
        }
    },

    onScrollEvent: function (target, eventType) {
        switch (eventType) {
            case cc.ScrollView.EventType.SCROLL_TO_BOTTOM:
                this.updateList();
                break;
        }
    },

    updateScore: function () {
        let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
        if (!unionInfoItem) return;
        this.scoreLabel.string = parseFloat(unionInfoItem.score.toFixed(2));
        this.safeScoreLabel.string = parseFloat(unionInfoItem.safeScore.toFixed(2));

        this.todayUseLabel.string = parseFloat(unionInfoItem.todayRebate.toFixed(2));
        this.yesterdayUseLabel.string = parseFloat(unionInfoItem.yesterdayRebate.toFixed(2));
    },

    updateList () {
        if (this.startIndex >= this.maxCount) return;
        Global.DialogManager.addLoadingCircle();
        Global.API.hall.safeBoxOperationRecordRequest(this.unionID, this.startIndex, this.perCount, function (data) {
            let recordArr = data.msg.recordArr;
            this.maxCount = data.msg.totalCount;
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordListItem);
                item.parent = this.recordListRoot;
                item.getChildByName('index').getComponent(cc.Label).string = record.index.toString();
                item.getChildByName('time').getComponent(cc.Label).string = new Date(record.createTime).format('yyyy-MM-dd hh:mm');
                item.getChildByName('type').getComponent(cc.Label).string = record.count > 0?"存入":"提取";
                item.getChildByName('score').getComponent(cc.Label).string = Math.abs(record.count);
            }

            if (recordArr.length > 0) {
                this.startIndex += recordArr.length;
            }
            Global.DialogManager.removeLoadingCircle();
        }.bind(this));
    },
});
