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
        recordListRoot: cc.Node,
        recordListItem: cc.Prefab,

        yesterdayTotalDraw: cc.Label,
        memberCount: cc.Label,
        yesterdayTotalUse: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.startIndex = 0;
        this.perCount = 10;
        this.maxCount = 10;

        this.unionID = this.dialogParameters.unionID;
        this.unionOwnerID = this.dialogParameters.unionOwnerID;
        this.userInfo = this.dialogParameters.userInfo;

        this.updateList();

        // 获取统计信息
        let matchData = {
            unionInfo: {
                $elemMatch: {
                    unionID: this.unionID,
                    $or: [{spreaderID: this.userInfo.uid, partner: false}, {uid: this.userInfo.uid}]
                }
            }
        };
        Global.API.hall.getMemberStatisticsInfoRequest(this.unionID, matchData, function (data) {
            this.yesterdayTotalDraw.string = data.msg.yesterdayTotalDraw || 0;
            this.yesterdayTotalUse.string = data.msg.yesterdayTotalProvideRebate || 0;
            this.memberCount.string = data.msg.totalCount || 0;
        }.bind(this));
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        }else if (parameter === 'addMember'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/AddMemberDialog", {unionID: this.unionID});
        }
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
        Global.DialogManager.addLoadingCircle();
        let matchData = {
            unionInfo: {
                $elemMatch: {
                    unionID: this.unionID,
                    $or: [{spreaderID: this.userInfo.uid, partner: false}, {uid: this.userInfo.uid}]
                }
            }
        };
        Global.API.hall.getMemberListRequest(this.unionID, matchData, this.startIndex, this.perCount, function (data) {
            Global.DialogManager.removeLoadingCircle();
            /*if (this.startIndex === 0){
                let item = cc.instantiate(this.recordListItem);
                item.parent = this.recordListRoot;
                let ctrl = item.getComponent("LowMemberItem");
                ctrl.initWidget(this.userInfo, this.unionID);
            }*/
            let recordArr = data.msg.recordArr;
            this.maxCount = data.msg.totalCount;
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordListItem);
                item.parent = this.recordListRoot;
                let ctrl = item.getComponent("LowMemberItem");
                ctrl.initWidget(record, this.unionID, this.unionOwnerID, "member");
            }
            if (recordArr.length > 0) {
                this.startIndex += this.perCount;
            }
        }.bind(this));
    }
});
