cc.Class({
    extends: cc.Component,

    properties: {
        intervalTime: 0,
        spriteAtlas: cc.SpriteAtlas,
        baseSprite: cc.Sprite,

        playOnLoad: true,
        startIndex: 0,
        loop: true
    },

    onLoad () {
        this.curFrameIndex = this.startIndex;
        this.spriteFrameArr = this.spriteAtlas.getSpriteFrames();

        this.count = this.spriteFrameArr.length;

        this.setCurFrameIndex(this.curFrameIndex);
        if (this.playOnLoad){
            this.initAnimation();
            this.startAnimation(this.loop, 1);
        }
    },

    initAnimation(spriteFrameArr, intervalTime, startIndex){
        this.intervalTime = intervalTime || this.intervalTime;
        this.spriteFrameArr = spriteFrameArr || this.spriteFrameArr;
        this.startIndex = startIndex || 0;
        if (!!spriteFrameArr) this.count = spriteFrameArr.length;
    },

    setCurFrameIndex(index){
        this.curFrameIndex = index % this.count;
        this.baseSprite.spriteFrame = this.spriteFrameArr[this.curFrameIndex];
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
            this.node.runAction(cc.repeat(cc.sequence([cc.delayTime(intervalTime), cc.callFunc(callback)]), this.count - 1));
        }
    },

    stopAnimation(){
        this.node.stopAllActions();
    }
});
