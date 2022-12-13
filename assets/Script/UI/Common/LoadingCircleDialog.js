cc.Class({
    extends: cc.Component,

    properties: {
        circle: cc.Node
    },

    // use this for initialization
    onLoad: function () {
    },

    addLoadingCircle: function (delay){
        cc.log('显示loading');
        this.unscheduleAllCallbacks();
        if (!!delay){
            this.node.active = true;
            this.circle.stopAllActions();
            this.circle.parent.active = false;
            this.scheduleOnce(function () {
                this.circle.parent.active = true;
                this.circle.runAction(cc.repeatForever(cc.rotateBy(2, 360, 360)));
            }.bind(this), delay);
        }else{
            this.node.active = true;
            this.circle.parent.active = true;
            this.circle.stopAllActions();
            this.circle.runAction(cc.repeatForever(cc.rotateBy(2, 360, 360)));
        }
    },

    removeLoadingCircle: function (){
        cc.log('移除loading');

        this.unscheduleAllCallbacks();
        this.circle.stopAllActions();
        this.node.active = false;
    }
});
