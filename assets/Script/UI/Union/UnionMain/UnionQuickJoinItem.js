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
        ruleName: cc.Label,
        kindName: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initWidget(ruleInfo, unionID, unionOwnerID){
        this.ruleInfo = ruleInfo;
        this.unionID = unionID;
        this.unionOwnerID = unionOwnerID;

        this.ruleName.string = this.ruleInfo.ruleName;

        let gameType = this.ruleInfo.gameType;
        let tableRes = "";
        if (gameType === Global.Enum.gameType.PDK){
            tableRes = "跑得快";
        } else if (gameType === Global.Enum.gameType.SZ){
            tableRes = "赢三张";
        } else if (gameType === Global.Enum.gameType.SG){
            tableRes = "三公";
        } else if (gameType === Global.Enum.gameType.NN){
            tableRes = "牛牛"
        } else if (gameType === Global.Enum.gameType.ZNMJ){
            tableRes = "红中麻将";
        }
        this.kindName.string = "(" + tableRes + ")";
    },

    onBtnClick(){
        if (this.unionOwnerID === Global.UserModel.uid){
            Global.DialogManager.addTipDialog("盟主不能加入游戏");
            return;
        }
        Global.DialogManager.addLoadingCircle();
        Global.API.hall.quickJoinRequest(this.unionID, this.ruleInfo._id);
    }

    // update (dt) {},
});
