cc.Class({
    extends: cc.Component,

    properties: {
        noticeText: cc.RichText,
        rootNode: cc.Node
    },

    start () {
        Global.MessageCallback.addListener("BroadcastPush", this);

        this.broadcastContents = [];
        //广播数据
        let content = Global.ConfigModel.getData('loopBroadcastContent');
        if (!!content){
            this.broadcastContents.push({
                type: Global.Enum.broadcastType.LOOP,
                content: content
            });
        }
        this.startNext();

        // 没30秒插入一条循环广播
        this.schedule(function () {
            if (this.broadcastContents.length > 0) return;
            let content = Global.ConfigModel.getData('loopBroadcastContent');
            if (!!content){
                this.broadcastContents = [{
                    type: Global.Enum.broadcastType.LOOP,
                    content: content
                }];
            }
            this.startNext();
        }.bind(this), 30);
        // this.noticeText.string = '玩家<color=#00ff00>123</c>在<color=#D66F00>抢庄牛牛</color>中抢到<color=#E4D313>牛牛</color>，一把赢得<color=#E4D313>285.00元</color>！';

    },

    onDestroy: function () {
        Global.MessageCallback.removeListener("BroadcastPush", this);
    },

    setUnionNotice(content){
        if (content === this.content) return;
        this.content = content;
        this.unscheduleAllCallbacks();
        Global.MessageCallback.removeListener("BroadcastPush", this);
        this.broadcastContents = [];

        if (!!content){
            this.broadcastContents.push({
                type: Global.Enum.broadcastType.LOOP,
                content: content
            });
        }

        // 没30秒插入一条循环广播
        this.schedule(function () {
            if (this.broadcastContents.length > 0) return;
            if (!!content){
                this.broadcastContents = [{
                    type: Global.Enum.broadcastType.LOOP,
                    content: content
                }];
            }
            this.startNext();
        }.bind(this), 30);
    },

    startNext: function () {
        if (this.rootNode.active) return;
        if (this.broadcastContents.length === 0){
            this.rootNode.active = false;
            return;
        }
        this.rootNode.active = true;
        this.noticeText.node.x = 0;

        let scrollSpeed = 100;
        let distance = this.noticeText.node.width + this.noticeText.node.parent.width + 50;
        let time = distance / scrollSpeed;
        let move = cc.moveBy(time, -distance, 0);

        let broadcastContent = this.broadcastContents.shift();
        if (broadcastContent.type === Global.Enum.broadcastType.LOOP || broadcastContent.type === Global.Enum.broadcastType.SYSTEM){
            this.noticeText.string = "<outline width=1 color=#000000><color=#ffffff>" + broadcastContent.content + "</c></outline>";
        }else if(broadcastContent.type === Global.Enum.broadcastType.BIG_WIN){
            let gameName = "";
            switch (broadcastContent.content.kind){
                case 1:
                    gameName = "扎金花";
                    break;
                case 10:
                    gameName = "抢庄牛牛";
                    break;
                case 11:
                    gameName = "百人牛牛";
                    break;
                case 20:
                    gameName = "十三张";
                    break;
                case 30:
                    gameName = "推筒子";
                    break;
                case 40:
                    gameName = "红黑大战";
                    break;
                case 50:
                    gameName = "百家乐";
                    break;
                case 60:
                    gameName = "龙虎斗";
                    break;
                case 70:
                    gameName = "捕鱼";
                    break;
                case 80:
                    gameName = "斗地主";
                    break;
                case 90:
                    gameName = "21点";
                    break;
                case 100:
                    gameName = "德州扑克";
                    break;
                case 110:
                    gameName = "跑得快";
                    break;
            }
            let nickname = Global.UserModel.convertNickname(broadcastContent.content.nickname);
            let goldCount = Global.Utils.formatNumberToString(broadcastContent.content.gold, 2);
            this.noticeText.string = '玩家<color=#00ff00>' + nickname + '</c>财运亨通,在<color=#D66F00>'+ gameName + '</color>一把赢得<color=#E4D313>' + goldCount + '元</color>！';
        }
        let moveEnd = cc.callFunc(function () {
            this.rootNode.active = false;
            this.startNext();
        }.bind(this));
        let actions= cc.sequence([move, moveEnd]);
        this.noticeText.node.runAction(actions);
    },

    messageCallbackHandler: function(router, msg) {
        switch (router) {
            case 'BroadcastPush':
                if (msg.type === Global.Enum.broadcastType.BIG_WIN){
                    for (let i = 0; i < msg.broadcastContentArr.length; ++i){
                        this.broadcastContents.push({
                            type: msg.type,
                            content: msg.broadcastContentArr[i]
                        });
                        if (this.broadcastContents.length > 10){
                            this.broadcastContents.shift();
                        }
                    }
                }else{
                    this.broadcastContents.push(msg);
                    if (this.broadcastContents.length > 10){
                        this.broadcastContents.shift();
                    }
                }
                this.startNext();
                break;
        }
    }
});
