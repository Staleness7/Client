cc.Class({
    extends: cc.Component,

    properties: {
        listRoot: cc.Node,
        unionRoomRuleItemWidget: cc.Prefab,
        emptyNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.ruleList = this.dialogParameters.ruleList;
        this.unionID = this.dialogParameters.unionID;

        this.updateList();
    },

    onBtnClick(event, parameter){
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        }else if (parameter === 'addRule'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionAddRuleDialog", {cb: this.addCallback.bind(this)});
        }
    },

    updateList(){
        this.listRoot.removeAllChildren();
        for (let i = 0; i < this.ruleList.length; ++i){
            let node = cc.instantiate(this.unionRoomRuleItemWidget);
            let ctrl = node.getComponent('UnionRoomRuleItemWidget');
            ctrl.initWidget(this.ruleList[i], this.deleteCallback.bind(this), this.updateCallback.bind(this));
            node.parent = this.listRoot;
        }
        this.emptyNode.active = this.ruleList.length === 0;
    },

    deleteCallback(ctrl, ruleID){
        Global.DialogManager.addLoadingCircle(1);
        Global.API.hall.removeRoomRuleListRequest(this.unionID, ruleID, function (data) {
            Global.DialogManager.removeLoadingCircle();
            for (let i = 0; i < this.ruleList.length; ++i){
                if (this.ruleList[i].gameRule._id === ruleID){
                    this.ruleList.splice(i, 1);
                    break;
                }
            }
            ctrl.node.removeFromParent();

            this.emptyNode.active = this.ruleList.length === 0;

            Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
        }.bind(this));
    },

    updateCallback(_id, gameType, ruleName, gameRule){
        Global.DialogManager.addLoadingCircle(1);
        Global.API.hall.updateRoomRuleListRequest(this.unionID, _id, gameType, ruleName, gameRule, function (data) {
            Global.DialogManager.removeLoadingCircle();
            Global.DialogManager.addTipDialog("修改成功");

            Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
        }.bind(this));
    },

    addCallback(gameType, ruleName, gameRule){
        Global.DialogManager.addLoadingCircle(1);
        Global.API.hall.addRoomRuleListRequest(this.unionID, gameType, ruleName, gameRule, function (data) {
            Global.DialogManager.removeLoadingCircle();

            this.ruleList = data.msg.unionInfo.roomRuleList;
            this.updateList();

            Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
        }.bind(this));
    }

    // update (dt) {},
});
