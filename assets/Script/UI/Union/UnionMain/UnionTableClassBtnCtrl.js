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
        ruleNameArr: [cc.Label],
        allToggle: cc.Toggle
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        this.ruleIDArr = [];
        this.curSelectIndex = -1;
    },

    initWidget(cb){
        this.callback = cb;
    },

    updateBtn(gameType, unionInfo){
        if (gameType === -1) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        this.ruleIDArr = [];
        for (let i = 0; i < this.ruleNameArr.length; ++i){
            this.ruleNameArr[i].node.parent.active = false;
        }
        for (let i = 0; i < unionInfo.roomRuleList.length; ++i){
            let roomRule = unionInfo.roomRuleList[i];
            if (roomRule.gameType !== gameType) continue;
            this.ruleNameArr[this.ruleIDArr.length].string = roomRule.ruleName || "";
            this.ruleNameArr[this.ruleIDArr.length].node.parent.active = true;
            this.ruleIDArr.push(roomRule._id);
            if (this.ruleIDArr.length === this.ruleNameArr.length) break;
        }
        this.maskEvnet = true;
        this.curSelectIndex = -1;
        this.allToggle.isChecked = true;
        this.maskEvnet = false;
    },
    
    onBtnClick: function (event, parameter) {
        if (this.maskEvnet) return;
        this.curSelectIndex = parseInt(parameter);
        this.callback();
    },
    
    getSelectRuleType: function () {
        if (!this.ruleIDArr || this.ruleIDArr.length === 0) return null;
        return this.ruleIDArr[this.curSelectIndex];
    }

    // update (dt) {},
});
