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
        ruleName: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initWidget(gameRule, deleteCallback, updateCallback){
        this.gameRule = gameRule;
        this.callback = deleteCallback;
        this.updateCallback = updateCallback;

        let gameType = this.gameRule.gameType;
        let gameName = "";
        if (gameType === Global.Enum.gameType.SG){
            gameName = "三公";
        }
		else if (gameType === Global.Enum.gameType.SZ){
            gameName = "赢三张";
        }
		else if (gameType === Global.Enum.gameType.NN){
            gameName = "牛牛";
        }
		else if (gameType === Global.Enum.gameType.PDK){
            gameName = "跑得快";
        }
		else if (gameType === Global.Enum.gameType.ZNMJ){
            gameName = "红中麻将";
        }
		else if (gameType === Global.Enum.gameType.DGN){
            gameName = "斗公牛";
        }
        this.ruleName.string = gameName + "-" + this.gameRule.ruleName;
    },

    onBtnClick(event, parameter){
        if (parameter === 'detail'){
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionAddRuleDialog", {gameRule: this.gameRule, cb: function (gameType, ruleName, gameRule) {
                this.updateCallback(this.gameRule._id, gameType, ruleName, gameRule);
                this.initWidget({
                    _id: this.gameRule._id,
                    gameType: gameType,
                    ruleName: ruleName,
                    gameRule: JSON.stringify(gameRule)
                }, this.callback, this.updateCallback);
            }.bind(this)});
        } else if (parameter === 'delete'){
            Global.DialogManager.addPopDialog("是否确定删除玩法？", function () {
                this.callback(this, this.gameRule._id);
            }.bind(this), function () {});
        }
    }

    // update (dt) {},
});
