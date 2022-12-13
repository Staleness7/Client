cc.Class({
    extends: cc.Component,

    properties: {
        listContent: cc.Node,
        emptyNode: cc.Node,
        recordItem: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.unionInfo = this.dialogParameters.unionInfo;

        this.startIndex = 0;
        this.perCount = 10;
        this.maxCount = 10;

        this.rankType = "day";

        this.updateList();
    },

    updateList: function () {
        if (this.gaiveStartIndex >= this.gaiveMaxCount) return;
        let matchData = {
            "unionInfo.unionID": this.unionInfo.unionID
        };
        let sortData = {};
        if (this.rankType === 'week'){
            sortData["unionInfo.weekDraw"] = -1;
        }else if (this.rankType === 'day'){
            sortData["unionInfo.todayDraw"] = -1;
        }else if (this.rankType === 'total'){
            sortData["unionInfo.totalDraw"] = -1;
        }
        Global.DialogManager.addLoadingCircle();
        Global.API.hall.getRankRequest(this.unionInfo.unionID, matchData, this.startIndex, this.perCount, sortData, function (data) {
            Global.DialogManager.removeLoadingCircle();
            let recordArr = data.msg.recordArr;
            this.maxCount = data.msg.totalCount;
            if(this.maxCount > 200) this.maxCount = 200;
            this.emptyNode.active = this.maxCount === 0;
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordItem);
                item.parent = this.listContent;
                let ctrl = item.getComponent("AllRankItemCtrl");
                ctrl.initWidget(record, this.startIndex + i);
            }
            if (recordArr.length > 0) {
                this.startIndex += recordArr.length;
            }
        }.bind(this));
    },

    onScrollEvent: function (target, eventType) {
        switch (eventType) {
            case cc.ScrollView.EventType.SCROLL_TO_BOTTOM:
                this.updateList();
                break;
        }
    },

    reloadList: function () {
        this.startIndex = 0;
        this.perCount = 10;
        this.maxCount = 10;

        this.listContent.removeAllChildren();

        this.emptyNode.active = false;

        this.updateList();
    },

    onBtnClick: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'day':
                this.rankType = 'day';
                this.reloadList();
                break;
            case 'week':
                this.rankType = "week";
                this.reloadList();
                break;
            case 'total':
                this.rankType = "total";
                this.reloadList();
                break;
        }
    }
});
