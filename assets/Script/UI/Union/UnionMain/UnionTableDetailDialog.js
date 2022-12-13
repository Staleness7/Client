cc.Class({
    extends: cc.Component,

    properties: {
        userInfoRoot: cc.Node,
        userItemWidgetPrefab: cc.Prefab,

        title: cc.Label,
        ruleInfo:cc.Label,
        drawCount: cc.Label,
        userCount: cc.Label,
        scoreLowLimit: cc.Label,
        scoreDismissLimit: cc.Label,

        enterBtn: cc.Node,
        dismissBtn: cc.Node
    },

    onLoad(){
        this.unionID = this.dialogParameters.unionInfo.unionID;
        this.unionOwnerID = this.dialogParameters.unionInfo.ownerUid;

        this.updateRoomInfo(this.dialogParameters.roomInfo);

        Global.MessageCallback.addListener('UpdateUnionInfo', this);
        Global.MessageCallback.addListener('UpdateUnionRoomList', this);
    },

    start () {

    },

    onDestroy(){
        Global.MessageCallback.removeListener('UpdateUnionInfo', this);
        Global.MessageCallback.removeListener('UpdateUnionRoomList', this);
    },

    messageCallbackHandler: function(router, data) {
        switch (router) {
            case 'UpdateUnionInfo':
            case 'UpdateUnionRoomList':
                if (!this.roomInfo.roomID) return;
                let roomList = data.msg.roomList;
                let roomInfo = roomList.find(function (element) {
                    return element.roomID === this.roomInfo.roomID;
                }.bind(this));
                if (!roomInfo){
                    Global.DialogManager.addTipDialog("当前房间已解散");
                    Global.DialogManager.destroyDialog(this);
                } else{
                    this.updateRoomInfo(roomInfo);
                }
                break;
        }
    },

    updateRoomInfo(roomInfo){
        this.roomInfo = roomInfo;

        let gameType = roomInfo.gameRule.gameType;
        let gameName = "";
        switch (gameType){
            case Global.Enum.gameType.SZ:
                gameName = "赢三张";
                break;
            case Global.Enum.gameType.NN:
                gameName = "牛牛";
                break;
            case Global.Enum.gameType.SG:
                gameName = "三公";
                break;
            case Global.Enum.gameType.PDK:
                gameName = "跑得快";
                break;
            case Global.Enum.gameType.SY:
                gameName = "水鱼";
                break;
            case Global.Enum.gameType.ZNMJ:
                gameName = "红中麻将";
                break;
            case Global.Enum.gameType.DGN:
                gameName = "斗公牛";
                break;
        }
        this.title.string = gameName + '-' + roomInfo.gameRule.ruleName;
        this.ruleInfo.string = this.getRuleDescribe(roomInfo.gameRule);

        if (roomInfo.gameStarted){
            this.drawCount.string = roomInfo.curBureau + '/' + roomInfo.gameRule.bureau;
            this.drawCount.node.color = cc.Color.RED;
        }else{
            this.drawCount.string = roomInfo.gameRule.bureau.toString();
            this.drawCount.node.color = cc.Color.BLACK;
        }
        this.scoreLowLimit.string = roomInfo.gameRule.scoreLowLimit;
        this.scoreDismissLimit.string = roomInfo.gameRule.scoreDismissLimit;

        this.userCount.string = roomInfo.gameRule.maxPlayerCount.toString();

        this.userInfoRoot.removeAllChildren();
        for (let i = 0; i < roomInfo.gameRule.maxPlayerCount; ++i){
            let node = cc.instantiate(this.userItemWidgetPrefab);
            let ctrl = node.getComponent("TableUserItemWidgetCtrl");
            if (roomInfo.roomUserInfoArr.length > i){
                ctrl.initWidget(roomInfo.roomUserInfoArr[i]);
            }
            node.parent = this.userInfoRoot;
        }

        this.enterBtn.active = (roomInfo.gameRule.maxPlayerCount > roomInfo.roomUserInfoArr.length || (!!roomInfo.gameRule.canEnter && !!roomInfo.gameRule.canWatch));
        this.dismissBtn.active = (this.unionOwnerID === Global.UserModel.uid) && !!this.roomInfo.roomID
    },

    onBtnClick(event, parameter) {
        if (parameter === 'close'){
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'dismiss'){
            if (!this.roomInfo.roomID) return;
            Global.DialogManager.addPopDialog("是否确定要强制解散当前房间", function () {
                Global.DialogManager.addLoadingCircle(1);
                Global.API.hall.dismissRoomRequest(this.unionID, this.roomInfo.roomID, function (data) {
                    Global.DialogManager.removeLoadingCircle();
                    Global.DialogManager.addTipDialog("解散成功");
                    Global.DialogManager.destroyDialog(this);

                    Global.MessageCallback.emitMessage("UpdateUnionInfo", data);
                }.bind(this));
            }.bind(this), function () {});
        } else if (parameter === 'enter'){
            if (!this.dialogParameters.unionInfo.opening){
                Global.DialogManager.addTipDialog("联盟已打烊，无法进入游戏");
                return;
            }
            let scoreLowLimit = this.roomInfo.gameRule.scoreLowLimit;
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            if (this.unionOwnerID === Global.UserModel.uid){
                Global.DialogManager.addTipDialog("盟主不能进入游戏");
                return;
            }
            if (!!unionInfoItem.prohibitGame){
                Global.DialogManager.addPopDialog("被盟主限制加入游戏");
                return;
            }
            if (!this.roomInfo.gameStarted && unionInfoItem.score < scoreLowLimit){
                Global.DialogManager.addTipDialog("积分不足,无法进入");
                return;
            }
            if (!!this.roomInfo.gameStarted && (this.roomInfo.gameRule.gameType === Global.Enum.gameType.PDK || !this.roomInfo.gameRule.canEnter)){
                Global.DialogManager.addTipDialog("该房间无法中途加入");
                return;
            }
            if (this.roomInfo.roomUserInfoArr.length >= this.roomInfo.gameRule.maxPlayerCount && !this.roomInfo.gameRule.canWatch){
                Global.DialogManager.addTipDialog("该房间无法观战");
                return;
            }
            if (!!this.roomInfo.roomID){
                Global.DialogManager.addLoadingCircle();
                Global.API.hall.joinRoomRequest(this.roomInfo.roomID);
            } else{
                Global.DialogManager.addLoadingCircle();
                Global.API.hall.createRoomRequest(null, this.roomInfo.gameRule._id, this.unionID);
            }
        }
    },

    getRuleDescribe(gameRule){
        let str = gameRule.baseScore + "倍底分/";
        if (gameRule.gameType === Global.Enum.gameType.SZ){
            let rule = {
                'lunshu': ['', '10轮', '15轮', '20轮'][gameRule.roundType],
                'wanfa': ['不闷', '闷一轮', '闷二轮', '闷三轮'][gameRule.gameFrameType],
                'gaoji': (gameRule.cuopai? '/允许搓牌':'') + (gameRule.canTrust? '/允许托管':'') + (gameRule.canEnter? '/中途进人':'') + (gameRule.canWatch? '/允许观战':''),
            };
            if (rule['gaoji'].length === 0) {
                rule['gaoji'] = '';
            }
            str += (rule.lunshu);
            str += "/";
            str += (rule.wanfa);
            str += (rule.gaoji);
        } else if (gameRule.gameType === Global.Enum.gameType.NN){
            let rule = {
                'moshi': ['', '牛牛上庄', '自由抢庄', '轮庄', '通比', '房主坐庄', '明牌抢庄'][gameRule.gameFrameType],
                'wanfa': ['', '全暗', '明3暗2', '明4暗1'][gameRule.sendCardType],
                'fanbei': ['', '牛牛(x4)牛九(x3)牛八(x2)牛七(x2)', '牛牛(x3)牛九(x2)牛八(x2)'][gameRule.scaleType],
                'gaoji': (gameRule.cuopai? '/允许搓牌':'') + (gameRule.canTrust? '/允许托管':'/不托管') + (gameRule.canEnter? '/中途进人':'') + (gameRule.canWatch? '/允许观战':''),
                'teshu': (gameRule.cardsType.TONGHUASHUN? '/同花顺(10倍)':'') + (gameRule.cardsType.YITIAOLONG? '/一条龙(9倍)':'') + (gameRule.cardsType.ZHADANNIU? '/炸弹牛(8倍)':'') + (gameRule.cardsType.WUXIAONIU? '/五小牛(7倍)':'') + (gameRule.cardsType.HULUNIU? '/葫芦牛(6倍)':'') + (gameRule.cardsType.WUHUANIU? '/五花牛(5倍)':'') + (gameRule.cardsType.TONGHUANIU? '/同花牛(5倍)':'') + (gameRule.cardsType.SHUNZINIU? '/顺子牛(4倍)':''),
            };
            if (rule['teshu'].length === 0) {
                rule['teshu'] = '';
            }
            str += (rule.moshi);
            str += "/";
            str += (rule.wanfa);
            str += "/";
            str += (rule.fanbei);
            str += (rule.gaoji);
            str += (rule.teshu);
        } else if (gameRule.gameType === Global.Enum.gameType.SG){
            let rule = {
                'wanfa': ['', '全暗', '明1暗2', '明2暗1'][gameRule.sendCardType],
                'moshi': ['', '抢庄', '大吃小', '霸王庄', '轮庄', '三公坐庄', '牌大坐庄'][gameRule.gameFrameType],
                'fanbei': ['', '8点2倍9点3倍三公4倍豹子5倍', '平赔'][gameRule.scaleType],
                'gaoji': (gameRule.cuopai? '/允许搓牌':'') + (gameRule.canTrust? '/允许托管':'/不托管') + (gameRule.canEnter? '/中途进人':'') + (gameRule.canWatch? '/允许观战':'') + (gameRule.canTrust? '/托管':'/不托管'),
            };
            str += (rule.wanfa);
            str += "/";
            str += (rule.moshi);
            str += "/";
            str += (rule.fanbei);
            str += (rule.gaoji);
        } else if (gameRule.gameType === Global.Enum.gameType.PDK){
            let rule = {
                'wanfa': ['', '经典玩法', '15张玩法', '平江玩法'][gameRule.gameFrameType] + (gameRule.showCardsCount? '/显示牌数':'/不显示牌数') + (gameRule.fangzuobi? '/防作弊':'') + (gameRule.heitao3? '/首局出黑桃3':''),
                'chupai': (gameRule.bichu? '必须出牌':'可不出牌'),
                'gaoji': (gameRule.canTrust? '/托管':'/不托管') + (gameRule.fourTakeTwo? '/允许4带2':'') + (gameRule.fourTakeThree? '/允许4带3':'') + (gameRule.ThreeABomb? '/三A算炸':'') + (gameRule.chaizhadan? '/可拆炸弹':'/不可拆炸弹') + (gameRule.hongtao10? '/红桃10双倍':''),
            };
            str += (rule.wanfa);
            str += "/";
            str += (rule.chupai);
            str += (rule.gaoji);
        } else if (gameRule.gameType === Global.Enum.gameType.ZNMJ){
            let rule = {
                'wanfa': (gameRule.ma === 1?"一马全中/": (gameRule.ma + "马/")) + ['','4张红中', '8张红中'][gameRule.gameFrameType],
                'gaoji': (gameRule.canTrust? '/托管':'/不托管') + (gameRule.qidui? '/七对':'') + (gameRule.chunniunai?'/纯牛奶':"")
            };
            str += (rule.wanfa);
            str += (rule.gaoji);
        }
        return str;
    }
});
