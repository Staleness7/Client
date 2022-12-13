cc.Class({
    extends: cc.Component,

    properties: {
        listContent: cc.Node,
        emptyNode: cc.Node,
        recordItem: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.unionID = this.dialogParameters.unionInfo.unionID;

        this.startIndex = 0;
        this.perCount = 10;
        this.maxCount = 10;

        this.rankType = "pdk";
        this.sortType = "zheng";

        this.updateList();
    },

    updateList: function () {
        if (this.gaiveStartIndex >= this.gaiveMaxCount) return;
        let matchData = {
            "unionID": this.unionID
        };
        if (this.rankType === 'pdk'){
            matchData.gameType = Global.Enum.gameType.PDK;
        }else if (this.rankType === 'sz'){
            matchData.gameType = Global.Enum.gameType.SZ;
        }else if (this.rankType === 'sg'){
            matchData.gameType = Global.Enum.gameType.SG;
        }else if (this.rankType === 'hzmj'){
            matchData.gameType = Global.Enum.gameType.ZNMJ;
        }else if (this.rankType === 'nn'){
            matchData.gameType = Global.Enum.gameType.NN;
        }
        let sortData = {score: -1};
        if (this.sortType === 'fu'){
            sortData = {score: 1};
        }
        Global.DialogManager.addLoadingCircle();
        Global.API.hall.getRankSingleDrawRequest(this.unionID, matchData, 0, 20, sortData, function (data) {
            Global.DialogManager.removeLoadingCircle();
            let recordArr = data.msg.recordArr;
            this.maxCount = data.msg.totalCount;
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordItem);
                item.parent = this.listContent;
                let ctrl = item.getComponent("SingleDrawRankItemCtrl");
                ctrl.initWidget(record, this.startIndex + i);
            }
            if (recordArr.length > 0) {
                this.startIndex += recordArr.length;
            }
            this.emptyNode.active = this.listContent.childrenCount === 0;
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
            case 'pdk':
                this.rankType = 'pdk';
                this.reloadList();
                break;
            case 'sg':
                this.rankType = "sg";
                this.reloadList();
                break;
            case 'sz':
                this.rankType = "sz";
                this.reloadList();
                break;
            case 'nn':
                this.rankType = "nn";
                this.reloadList();
                break;
            case 'hzmj':
                this.rankType = "hzmj";
                this.reloadList();
                break;
            case 'zheng':
                this.sortType = "zheng";
                this.reloadList();
                break;
            case 'fu':
                this.sortType = "fu";
                this.reloadList();
                break;
        }
    }
});
