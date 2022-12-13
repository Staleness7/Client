cc.Class({
    extends: cc.Component,

    properties: {
        rootNode: cc.Node,
        tipWidget: cc.Node
    },

    // use this for initialization
    onLoad: function () {

    },

    addTip: function (content) {
        for (let i = 0; i < this.rootNode.childrenCount; ++i){
            let child = this.rootNode.children[i];
            child.runAction(cc.moveBy(0.1, cc.v2(0, 65)));
        }
        let tipWidget = cc.instantiate(this.tipWidget);
        tipWidget.getChildByName("content").getComponent(cc.Label).string = content;
        tipWidget.active = true;
        tipWidget.scale = 1.05;
        tipWidget.parent = this.rootNode;
        let scaleAction = cc.scaleTo(0.2, 1);
        scaleAction.easing(cc.easeBackIn());
        tipWidget.runAction(cc.sequence([scaleAction, cc.delayTime(1.5), cc.fadeOut(0.3), cc.removeSelf()]));
    }
});
