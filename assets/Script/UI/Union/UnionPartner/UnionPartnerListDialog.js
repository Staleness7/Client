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

        queryUid: cc.EditBox,

        myRebateLabel: cc.Label,

        pageLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.curIndex = 0;
        this.maxIndex = 0;
        this.perCount = 5;

        this.unionID = this.dialogParameters.unionID;
        this.userInfo = this.dialogParameters.userInfo;
        this.unionOwnerID = this.dialogParameters.unionOwnerID;

        let unionInfoItem = Global.UserModel.unionInfo.find(function (ele) {
            return ele.unionID === this.unionID;
        }.bind(this));
        this.myRebateLabel.string = unionInfoItem.rebateRate * 100 + "%";

        this.updateList();
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'lowMember'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionLowMemberListDialog", {unionID: this.unionID, userInfo: this.userInfo});
        } else if (parameter === 'addPartner'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/AddPartnerDialog", {unionID: this.unionID});
        } else if (parameter === 'query'){
            if (this.lastQueryUid === this.queryUid.string) return;
            if (this.queryUid.string.length > 0){
                if (this.queryUid.string.length !== 6){
                    Global.DialogManager.addTipDialog("请输入正确的玩家ID");
                    return;
                }
            }
            this.curIndex = 0;
            this.maxIndex = 0;
            this.perCount = 5;
            this.recordListRoot.removeAllChildren();
            this.updateList();
        } else if (parameter === 'left'){
            if (this.curIndex === 0) return;
            this.curIndex--;
            this.updateList();
        } else if (parameter === 'right'){
            if (this.curIndex >= this.maxIndex) return;
            this.curIndex++;
            this.updateList();
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
        let matchData = {
            unionInfo: {
                $elemMatch:{
                    unionID: this.unionID,
                    spreaderID: this.userInfo.uid,
                    partner: true
                }
            }
        };
        if (this.queryUid.string.length > 0){
            if (this.queryUid.string.length !== 6){
                Global.DialogManager.addTipDialog("请输入正确的玩家ID");
                return;
            }
            matchData.uid = this.queryUid.string;
        }
        Global.DialogManager.addLoadingCircle();
        this.lastQueryUid = this.queryUid.string;
        Global.API.hall.getMemberListRequest(this.unionID, matchData, this.curIndex * this.perCount, this.perCount, function (data) {
            Global.DialogManager.removeLoadingCircle();
            let recordArr = data.msg.recordArr;
            this.maxIndex = Math.floor((data.msg.totalCount + 1)/this.perCount);
            if ((data.msg.totalCount + 1)%this.perCount === 0){
                this.maxIndex--;
            }
            this.pageLabel.string = (this.curIndex + 1) + "/" + (this.maxIndex + 1);
            this.recordListRoot.removeAllChildren();

            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordListItem);
                item.parent = this.recordListRoot;
                let ctrl = item.getComponent("LowPartnerItem");
                ctrl.initWidget(record, this.unionID);
            }
        }.bind(this));
    }
});
