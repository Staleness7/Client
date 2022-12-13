cc.Class({
    extends: cc.Component,

    properties: {
        listRoot: cc.Node,
        unionRoomRuleItemWidget: cc.Prefab,
        emptyNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        this.ruleList = this.dialogParameters.ruleList;
        this.unionID = this.dialogParameters.unionInfo.unionID;
        this.unionOwnerID = this.dialogParameters.unionInfo.ownerUid;

        this.ruleList.sort(function (a, b) {
            return a.gameType - b.gameType;
        });
        if (this.ruleList.length === 0){
            this.emptyNode.active = true;
            return;
        }
        for (let i = 0; i < this.ruleList.length; ++i){
            let node = cc.instantiate(this.unionRoomRuleItemWidget);
            let ctrl = node.getComponent("UnionQuickJoinItem");
            ctrl.initWidget(this.ruleList[i], this.unionID, this.unionOwnerID);
            node.parent = this.listRoot;
        }
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        }
    }
});
