cc.Class({
    extends: cc.Component,

    properties: {
        recordItem: cc.Prefab,
        listContent: cc.Node,
        emptyNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.startIndex = 0;
        this.perCount = 10;
        this.maxCount = 10;

        this.unionID = this.dialogParameters.unionID;

        this.updateList();
    },

    onScrollEvent: function (target, eventType) {
        switch (eventType) {
            case cc.ScrollView.EventType.SCROLL_TO_BOTTOM:
                this.updateList();
                break;
        }
    },

    updateList () {
        if (this.startIndex >= this.maxCount) return;
        let matchData = {
            unionID: this.unionID,
            uid: Global.UserModel.uid
        };
        Global.DialogManager.addLoadingCircle();
        Global.API.hall.getUnionRebateRecordRequest(matchData, this.startIndex, this.perCount, function (data) {
            Global.DialogManager.removeLoadingCircle();
            let recordArr = data.msg.recordArr;
            this.maxCount = data.msg.totalCount;
            this.emptyNode.active = data.msg.totalCount === 0;
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordItem);
                item.parent = this.listContent;
                let ctrl = item.getComponent("UnionRebateRecordItemCtrl");
                ctrl.initWidget(record);
            }
            if (recordArr.length > 0) {
                this.startIndex += recordArr.length;
            }
        }.bind(this));
    },

    onBtnClick: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
        }
    }
});
