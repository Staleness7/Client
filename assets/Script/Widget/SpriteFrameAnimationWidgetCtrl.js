cc.Class({
    extends: cc.Component,

    properties: {
        intervalTime: 0,
        spriteFrameArr: [cc.SpriteFrame],
        startIndex: 0,
        baseSprite: cc.Sprite
    },

    start () {
        this.curFrameIndex = this.startIndex;

        this.count = this.spriteFrameArr.length;

        this.setCurFrameIndex(this.curFrameIndex);
    },

    initAnimation(spriteFrameArr, intervalTime, startIndex){
        this.intervalTime = intervalTime || this.intervalTime;
        this.spriteFrameArr = spriteFrameArr || this.spriteFrameArr;
        this.startIndex = startIndex || 0;
        this.count = this.spriteFrameArr.length;
    },

    setCurFrameIndex(index){
        this.curFrameIndex = index % this.count;
        //let rect = new cc.Rect(( this.curFrameIndex%this.wCount) * this.size.width, Math.floor(this.curFrameIndex/this.wCount) * this.size.height, this.size.width, this.size.height);
        this.baseSprite.spriteFrame = this.spriteFrameArr[this.curFrameIndex];//new cc.SpriteFrame(this.texture, rect);
    },

    startAnimation(loop, speed, completeCallback){
        if (!this.count) this.initAnimation();
        if (!speed || speed <= 0) speed = 1;
        let intervalTime = this.intervalTime/speed;
        this.node.stopAllActions();
        this.setCurFrameIndex(0);
        let self = this;
        function callback() {
            let curIndex = ++self.curFrameIndex % self.count;
            self.curFrameIndex = curIndex;
            //let rect = new cc.Rect((curIndex%self.wCount) * self.size.width, Math.floor(curIndex/self.wCount) * self.size.height, self.size.width, self.size.height);
            self.baseSprite.spriteFrame = self.spriteFrameArr[self.curFrameIndex];//new cc.SpriteFrame(self.texture, rect);
            if(!!completeCallback && (curIndex === (self.count - 1))){
                completeCallback();
            }
        }
        if (!!loop){
            this.node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(intervalTime), cc.callFunc(callback)])));
        }else{
            this.node.runAction(cc.repeat(cc.sequence([cc.delayTime(intervalTime), cc.callFunc(callback)]), this.count));
        }
    },

    stopAnimation(){
        this.node.stopAllActions();
    }
});
