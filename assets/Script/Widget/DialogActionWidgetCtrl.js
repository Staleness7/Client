// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: cc.Node,
        popUpNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.dialogIn();
    },
    
    dialogIn: function () {
        if (!!this.maskNode){
            this.maskNode.opacity = 0;
            this.maskNode.runAction(cc.fadeTo(0.3, 150));
        }
        if (!!this.popUpNode){
            this.popUpNode.scale = 0.1;
            let action = cc.scaleTo(0.2, 1);
            action.easing(cc.easeBackOut());
            this.popUpNode.runAction(action);
        }
    },

    dialogOut: function (cb) {
        if (!this.maskNode && !this.popUpNode) {
            Global.Utils.invokeCallback(cb);
            return;
        }
        if (!!this.maskNode){
            this.maskNode.runAction(cc.sequence([cc.fadeTo(0.3, 0), cc.callFunc(function () {
                Global.Utils.invokeCallback(cb);
            })]));
        }
        if (!!this.popUpNode){
            let action = cc.scaleTo(0.2, 0);
            action.easing(cc.easeBackIn());
            if (!this.maskNode){
                this.popUpNode.runAction(cc.sequence([action, cc.callFunc(function () {
                    Global.Utils.invokeCallback(cb);
                })]));
            }else{
                this.popUpNode.runAction(action);
            }
        }
    }

    // update (dt) {},
});
