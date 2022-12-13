cc.Class({
    extends: cc.Component,

    properties: {
        recordListRoot: cc.Node,
        recordListItem: cc.Prefab,

        queryEditBox: cc.EditBox,
        memberTotalScore: cc.Label,

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

        this.ctrlArr = [];

        Global.MessageCallback.addListener("UpdateMemberScoreList", this);

        this.updateList();
    },

    onDestroy(){
        Global.MessageCallback.removeListener("UpdateMemberScoreList", this);
    },

    messageCallbackHandler: function(router, data) {
        switch (router) {
            case 'UpdateMemberScoreList':
                this.updateItem(data.uid, data.score, data.changeScore);
                break;
        }
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        }else if (parameter === 'query'){
            if (this.lastQueryUid === this.queryEditBox.string) return;
            if (this.queryEditBox.string.length > 0){
                if (this.queryEditBox.string.length !== 6){
                    Global.DialogManager.addTipDialog("请输入正确的玩家ID");
                    return;
                }
            }
            this.curIndex = 0;
            this.maxIndex = 0;
            this.perCount = 5;
            this.ctrlArr = [];
            this.recordListRoot.removeAllChildren();
            this.updateList();
        } else if (parameter === 'modifyRecord'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionChangeScoreRecordDialog", {unionID: this.unionID});
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
            "unionInfo.unionID": this.unionID,
            "unionInfo.spreaderID": Global.UserModel.uid
        };

        let matchData1 = {
            unionInfo: {
                $elemMatch: {
                    unionID: this.unionID,
                    spreaderID: Global.UserModel.uid
                }
            }
        };

        if (this.queryEditBox.string.length > 0){
            if (this.queryEditBox.string.length !== 6){
                Global.DialogManager.addTipDialog("请输入正确的玩家ID");
                return;
            }
            matchData.uid = this.queryEditBox.string;
        }
        Global.DialogManager.addLoadingCircle();
        this.lastQueryUid = this.queryEditBox.string;
        Global.API.hall.getMemberScoreListRequest(this.unionID, matchData, this.curIndex * this.perCount, this.perCount,  function(data) {
            Global.DialogManager.removeLoadingCircle();
            let recordArr = data.msg.recordArr;

            this.maxIndex = Math.floor((data.msg.totalCount + 1)/this.perCount);
            if ((data.msg.totalCount + 1)%this.perCount === 0){
                this.maxIndex--;
            }
            this.pageLabel.string = (this.curIndex + 1) + "/" + (this.maxIndex + 1);

            this.recordListRoot.removeAllChildren();

            this.memberTotalScore.string = data.msg.totalScore;
            for (let i = 0; i < recordArr.length; i ++) {
                let record = recordArr[i];
                let item = cc.instantiate(this.recordListItem);
                item.parent = this.recordListRoot;
                let ctrl = item.getComponent("MemberScoreItem");
                ctrl.initWidget(record, this.unionID, this.unionOwnerID);

                this.ctrlArr.push(ctrl);
            }
        }.bind(this));
    },

    updateItem(uid, score, changeScore){
        for (let i = 0; i < this.ctrlArr.length; ++i){
            let ctrl = this.ctrlArr[i];
            if (ctrl.userInfo.uid === uid){
                ctrl.updateScore(score);
                break;
            }
        }
        this.memberTotalScore.string = Global.Utils.formatNumberToString(parseFloat(this.memberTotalScore.string) + changeScore);
    }
});
