cc.Class({
    extends: cc.Component,

    properties: {
        recordItem: cc.Prefab,

        giveContentRoot: cc.Node,
        gainContentRoot: cc.Node,

        giveEmptyNode: cc.Node,
        gainEmptyNode: cc.Node,

        totalGiveLabel: cc.Label,
        totalGainLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gaiveStartIndex = 0;
        this.gaivePerCount = 10;
        this.gaiveMaxCount = 10;

        this.isGetTotalData = true;

        this.gainStartIndex = 0;
        this.gainPerCount = 10;
        this.gainMaxCount = 10;

        this.unionID = this.dialogParameters.unionID;

        this.updateGiveList();
    },

    updateGiveList: function () {
        if (this.gaiveStartIndex >= this.gaiveMaxCount) return;
        Global.DialogManager.addLoadingCircle();
        let matchData = {
            "unionID": this.unionID,
            uid: Global.UserModel.uid
        };
        Global.API.hall.getGiveScoreRecordRequest(this.unionID, matchData, this.gaiveStartIndex, this.gaiveMaxCount, this.isGetTotalData, function (data) {
            Global.DialogManager.removeLoadingCircle();
            let recordArr = data.msg.recordArr;
            this.gaiveMaxCount = data.msg.totalCount;
            if ("totalGiveCount" in data.msg){
                this.totalGiveLabel.string = data.msg.totalGiveCount;
                this.isGetTotalData = false;
            }
            if ("totalGainCount" in data.msg){
                this.totalGainLabel.string = data.msg.totalGainCount;
            }
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordItem);
                item.parent = this.giveContentRoot;
                let ctrl = item.getComponent("GiveScoreRecordItem");
                ctrl.initWidget(record);
            }
            if (recordArr.length > 0) {
                this.gaiveStartIndex += this.gaivePerCount;
            }

            if (this.gaiveMaxCount === 0){
                this.giveEmptyNode.active = true;
            }
        }.bind(this));
    },

    onGiveScrollEvent: function (target, eventType) {
        switch (eventType) {
            case cc.ScrollView.EventType.SCROLL_TO_BOTTOM:
                this.updateGiveList();
                break;
        }
    },

    updateGainList: function () {
        if (this.gainStartIndex >= this.gainMaxCount) return;
        Global.DialogManager.addLoadingCircle();
        let matchData = {
            "unionID": this.unionID,
            gainUid: Global.UserModel.uid
        };
        Global.API.hall.getGiveScoreRecordRequest(this.unionID, matchData, this.gainStartIndex, this.gainMaxCount, this.isGetTotalData, function (data) {
            Global.DialogManager.removeLoadingCircle();
            let recordArr = data.msg.recordArr;
            this.gainMaxCount = data.msg.totalCount;
            if ("totalGiveCount" in data.msg){
                this.totalGiveLabel.string = data.msg.totalGiveCount;
                this.isGetTotalData = false;
            }
            if ("totalGainCount" in data.msg){
                this.totalGainLabel.string = data.msg.totalGainCount;
            }
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordItem);
                item.parent = this.gainContentRoot;
                let ctrl = item.getComponent("GiveScoreRecordItem");
                ctrl.initWidget(record);
            }
            if (recordArr.length > 0) {
                this.gainStartIndex += this.gainPerCount;
            }

            if (this.gainMaxCount === 0){
                this.gainEmptyNode.active = true;
            }
        }.bind(this));
    },

    onGainScrollEvent: function (target, eventType) {
        switch (eventType) {
            case cc.ScrollView.EventType.SCROLL_TO_BOTTOM:
                this.updateGainList();
                break;
        }
    },

    onBtnClick: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'give':
                this.giveContentRoot.parent.parent.active = true;
                this.gainContentRoot.parent.parent.active = false;
                break;
            case 'gain':
                this.gainContentRoot.parent.parent.active = true;
                this.giveContentRoot.parent.parent.active = false;
                if (this.gainStartIndex === 0){
                    this.updateGainList();
                }
                break;
        }
    }
});
