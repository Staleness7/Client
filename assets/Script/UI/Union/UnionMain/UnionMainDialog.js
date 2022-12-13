cc.Class({
    extends: cc.Component,

    properties: {
        tableItemWidgetPrefab: cc.Prefab,
        tableList: cc.Node,
        gameList: cc.Node,

        unionName: cc.Label,
        score: cc.Label,
        inviteIDLabel: cc.Label,
        playingCount: cc.Label,

        partnerNode: cc.Node,

        broadcastPosNode: cc.Node,
        broadcastWidget: cc.Prefab,

        unionBgSprite: cc.Sprite,

        uidLabel: cc.Label,

        closedTip: cc.Node,

        rankNode: cc.Node,
        unionActiveNode: cc.Node,
        singleRankNode: cc.Node,

        tableOrder: cc.Toggle,

        hongBaoNode: cc.Node,

        debugMsg: cc.Node,

        tableClassBtnCtrl: require('UnionTableClassBtnCtrl')
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.unionID = this.dialogParameters.unionID;
        this.lastDialog = this.dialogParameters.lastDialog;

        // 记录最后一次进入联盟的ID
        cc.sys.localStorage.setItem("LAST_ENTER_UNION_ID", this.unionID);

        if (this.lastDialog !== 'hall'){
            // 播放背景音乐
            let hallMusic = cc.sys.localStorage.getItem("hallMusic");
            Global.AudioManager.startPlayBgMusic("UI/Hall/Sound/" + (hallMusic === "hallMusic2"? "hall_bg_music2": "hall_bg_music1"));
        }

        this.tableCtrlList = [];
        this.selectGameType = parseInt(cc.sys.localStorage.getItem("lastSelectGameType") || "-1");
        let toggle = this.gameList.getChildByName(this.selectGameType.toString()).getComponent(cc.Toggle);
        toggle.isChecked = true;

        this.fullTableCtrlList = [];

        // 初始化广播组件
        {
            // 初始化广播组件
            let node = cc.instantiate(this.broadcastWidget);
            this.broadcastWidgetCtrl = node.getComponent("BroadcastWidgetCtrl");
            node.parent = this.broadcastPosNode;
        }
        this.debugMsg.active = !cc.sys.isNative;
        // 更新背景
        this.updateUnionBg();

        this.tableClassBtnCtrl.initWidget(this.tableClassBtnCallback.bind(this));

        Global.MessageCallback.addListener('SelfEntryRoomPush', this);
        Global.MessageCallback.addListener('UpdateUserInfoUI', this);
        Global.MessageCallback.addListener('ReConnectSuccess', this);
        Global.MessageCallback.addListener('ServerDisconnection', this);
        Global.MessageCallback.addListener('UpdateUnionInfo', this);
        Global.MessageCallback.addListener('UpdateUnionBg', this);
    },

    start () {
        this.updateInfo(true);
    },

    onDestroy(){
        Global.MessageCallback.removeListener('SelfEntryRoomPush', this);
        Global.MessageCallback.removeListener('UpdateUserInfoUI', this);
        Global.MessageCallback.removeListener('ReConnectSuccess', this);
        Global.MessageCallback.removeListener('ServerDisconnection', this);
        Global.MessageCallback.removeListener('UpdateUnionInfo', this);
        Global.MessageCallback.removeListener('UpdateUnionBg', this);
    },

    messageCallbackHandler: function(router, data) {
        switch (router) {
            case 'SelfEntryRoomPush':
                Global.GameHelper.enterGame(data.gameType, function (err, gameInfo) {
                    if (!err){
                        Global.DialogManager.destroyAllDialog([gameInfo.gameDialog]);
                    }
                }.bind(this));
                break;
            case 'UpdateUserInfoUI':
            case 'ReConnectSuccess':
                this.unscheduleAllCallbacks();
                this.scheduleOnce(this.updateInfo, Global.Constant.updateUnionTime);

                this.updatePlayerInfo();
                break;
            case 'ServerDisconnection':
                this.unscheduleAllCallbacks();
                break;
            case 'UpdateUnionInfo':
                this.unscheduleAllCallbacks();
                this.scheduleOnce(this.updateInfo, Global.Constant.updateUnionTime);

                this.unionInfo = data.msg.unionInfo;
                this.roomList = data.msg.roomList;

                this.updatePlayerInfo();
                this.updateUnionInfo();
                this.updateTableList(this.selectGameType);

                this.updateNotice();
                break;
            case 'UpdateUnionBg':
                this.updateUnionBg();
                break;
        }
    },

    onBtnClick(event, parameter){
        if (parameter === 'back'){
            Global.DialogManager.createDialog("UI/Hall/HallDialog");
            Global.DialogManager.destroyDialog(this);
        } else if (parameter === 'game_all'){
            if (!this.unionInfo) return;
            this.selectGameType = -1;
            // 更新按钮状态
            this.tableClassBtnCtrl.updateBtn(this.selectGameType, this.unionInfo);
            this.updateTableList(-1);
        } else if (parameter === 'game_1'){
            if (!this.unionInfo) return;
            this.selectGameType = 1;
            // 更新按钮状态
            this.tableClassBtnCtrl.updateBtn(this.selectGameType, this.unionInfo);
            this.updateTableList(1);
        } else if (parameter === 'game_2'){
            if (!this.unionInfo) return;
            this.selectGameType = 2;
            // 更新按钮状态
            this.tableClassBtnCtrl.updateBtn(this.selectGameType, this.unionInfo);
            this.updateTableList(2);
        } else if (parameter === 'game_3'){
            if (!this.unionInfo) return;
            this.selectGameType = 3;
            // 更新按钮状态
            this.tableClassBtnCtrl.updateBtn(this.selectGameType, this.unionInfo);
            this.updateTableList(3);
        } else if (parameter === 'game_4'){
            if (!this.unionInfo) return;
            this.selectGameType = 4;
            // 更新按钮状态
            this.tableClassBtnCtrl.updateBtn(this.selectGameType, this.unionInfo);
            this.updateTableList(4);
        } else if (parameter === 'game_5'){
            if (!this.unionInfo) return;
            this.selectGameType = 5;
            // 更新按钮状态
            this.tableClassBtnCtrl.updateBtn(this.selectGameType, this.unionInfo);
            this.updateTableList(5);
        } else if (parameter === 'unionManager'){
            if (this.unionInfo.ownerUid !== Global.UserModel.uid){
                Global.DialogManager.addTipDialog("盟主才可以操作");
                return;
            }
            Global.DialogManager.createDialog("UI/Union/UnionManager/UnionManagerDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'switchUnion'){
            Global.DialogManager.createDialog("UI/Union/UnionList/UnionListDialog", {cb: function (unionID) {
                if (unionID !== this.unionID){
                    this.unionID = unionID;
                    this.updateInfo();
                }
            }.bind(this)});
        } else if (parameter === 'memberList'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionMemberListDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'safeBox'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/UnionBankDialog", {unionID: this.unionID});
        } else if (parameter === 'memberManager'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionLowMemberListDialog", {unionID: this.unionID, unionOwnerID: this.unionInfo.ownerUid, userInfo: {
                uid: Global.UserModel.uid,
                avatar: Global.UserModel.avatar,
                nickname: Global.UserModel.nickname,
                score: unionInfoItem.score,

                yesterdayDraw: unionInfoItem.yesterdayDraw,
                yesterdayProvideRebate: unionInfoItem.yesterdayProvideRebate,
                yesterdayBigWinDraw: unionInfoItem.yesterdayBigWinDraw,
                totalDraw: unionInfoItem.totalDraw
            }});
        } else if (parameter === 'partnerManager'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionPartnerListDialog", {unionID: this.unionID, unionOwnerID: this.unionInfo.ownerUid, userInfo: {
                uid: Global.UserModel.uid,
                avatar: Global.UserModel.avatar,
                nickname: Global.UserModel.nickname,
                score: unionInfoItem.score,

                yesterdayDraw: unionInfoItem.yesterdayDraw,
                yesterdayProvideRebate: unionInfoItem.yesterdayProvideRebate,
                yesterdayBigWinDraw: unionInfoItem.yesterdayBigWinDraw,
                totalDraw: unionInfoItem.totalDraw
            }});
        } else if (parameter === 'scoreManager'){
            let unionInfoItem = Global.UserModel.getUnionInfoItemByUnionID(this.unionID);
            Global.DialogManager.createDialog("UI/Union/UnionPartner/UnionMemberScoreListDialog", {unionID: this.unionID, unionOwnerID: this.unionInfo.ownerUid, userInfo: {
                uid: Global.UserModel.uid,
                avatar: Global.UserModel.avatar,
                nickname: Global.UserModel.nickname,
                score: unionInfoItem.score,

                yesterdayDraw: unionInfoItem.yesterdayDraw,
                yesterdayProvideRebate: unionInfoItem.yesterdayProvideRebate,
                yesterdayBigWinDraw: unionInfoItem.yesterdayBigWinDraw,
                totalDraw: unionInfoItem.totalDraw
            }});
        } else if (parameter === 'settings'){
            Global.DialogManager.createDialog("UI/Setting/SettingDialog", {type: "union"});
        } else if (parameter === 'invite'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/AddMemberDialog", {unionID: this.unionInfo.unionID});
        } else if (parameter === 'giveScore'){
            Global.DialogManager.createDialog("UI/Union/UnionPartner/GiveScoreDialog", {unionID: this.unionInfo.unionID, unionOwnerID: this.unionInfo.ownerUid});
        } else if (parameter === 'gameRecord'){
            Global.DialogManager.createDialog("UI/Record/GameRecordDialog", {unionID: this.unionInfo.unionID, type: "union"});
        } else if (parameter === 'rank'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/UnionAllRankDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'unionActive'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/UnionActiveDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'singleRank'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/UnionSingleDrawRankDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'tableOrder'){
            for (let i = 0; i < this.fullTableCtrlList.length; ++i){
                if (this.tableOrder.isChecked) this.fullTableCtrlList[i].node.zIndex += 1000;
                else this.fullTableCtrlList[i].node.zIndex -= 1000;
            }
        } else if (parameter === 'quickJoin'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/UnionQuickJoinDialog", {ruleList: this.unionInfo.roomRuleList, unionInfo: this.unionInfo});
        } else if (parameter === 'hongbao'){
            Global.DialogManager.createDialog("UI/Union/UnionMain/UnionGetHongBaoDialog", {unionInfo: this.unionInfo});
        } else if (parameter === 'sendTestData'){
            Global.DialogManager.createDialog('UI/SendTestData/SendTestData');
        }
    },

    updateUnionBg(){
        let unionBg = cc.sys.localStorage.getItem("unionBg");
        let img = "UI/Union/UnionMain/" + (unionBg !== "unionBg2"?"phall_bg":"phall_bg2");
        Global.CCHelper.updateSpriteFrame(img, this.unionBgSprite);
    },

    updateInfo (isStart){
        if (isStart === true) Global.DialogManager.addLoadingCircle();
        Global.API.hall.getUnionInfoRequest(this.unionID, function (data) {
            if (isStart === true) Global.DialogManager.removeLoadingCircle();
            if(this.isDestroy) return;
            this.unionInfo = data.msg.unionInfo;
            this.roomList = data.msg.roomList;

            Global.MessageCallback.emitMessage("UpdateUnionRoomList", data);

            this.updatePlayerInfo();
            this.updateUnionInfo();
            this.updateTableList(this.selectGameType);
            this.updateNotice();

            this.doDialogAction();

            this.unscheduleAllCallbacks();
            this.scheduleOnce(this.updateInfo, Global.Constant.updateUnionTime);
        }.bind(this));
    },

    updateNotice(){
        this.broadcastWidgetCtrl.setUnionNotice(this.unionInfo.notice);
    },

    updatePlayerInfo(){
        let unionInfoItem = Global.UserModel.unionInfo.find(function (ele) {
			if (this.unionInfo) {
				return ele.unionID === this.unionInfo.unionID;
			}
			else {
				return false;
			}
        }.bind(this));
        if (!unionInfoItem) return;
        this.score.string = "积分:" + Math.floor(unionInfoItem.score);
        this.inviteIDLabel.string = unionInfoItem.inviteID;
        this.uidLabel.string = Global.UserModel.uid;
    },

    updateUnionInfo(){
        this.unionName.string = this.unionInfo.unionName || "";
        this.closedTip.active = !this.unionInfo.opening;

        let unionItem  = Global.UserModel.unionInfo.find(function (e) {
            return e.unionID === this.unionInfo.unionID;
        }.bind(this));
        if (!!unionItem.partner){
            this.partnerNode.active = true;
        }
        this.rankNode.active = !!this.unionInfo.showRank;
        this.unionActiveNode.active = !!this.unionInfo.showUnionActive;
        this.singleRankNode.active = !!this.unionInfo.showSingleRank;

        // 检查是否需要开启抢红包界面
        if (Global.DialogManager.isDialogExit("UI/Union/UnionMain/UnionGetHongBaoDialog")) return;
        // 创建领取红包界面
        //Global.DialogManager.createDialog("UI/Union/UnionMain/UnionGetHongBaoDialog", {unionInfo: this.unionInfo});

        let hongBaoInfo = this.unionInfo.hongBaoInfo;

        let canGet = true;
        if (!hongBaoInfo || !hongBaoInfo.status) canGet = false;
        let time = new Date().getHours();
        if (hongBaoInfo.startTime > time || hongBaoInfo.endTime <= time) canGet = false;;
        let hongBaoUidList = this.unionInfo.hongBaoUidList || [];
        let hongBaoScoreList = this.unionInfo.hongBaoScoreList || [];
        // 已经领取过
        if (hongBaoUidList.indexOf(Global.UserModel.uid) !== -1) canGet = false;
        if (hongBaoScoreList.length === 0) canGet = false;
        this.hongBaoNode.active = canGet;
        if (!canGet) return;
        if (this.hongBaoNode.active){
            let node = this.hongBaoNode.getChildByName("hongbao_icon");
            node.stopAllActions();
            node.runAction(cc.repeatForever(cc.sequence([cc.scaleTo(1,1.2),cc.scaleTo(1,1)])));
        }

        // 没有红包，判断今天是否已经抢过红包
        if (hongBaoScoreList.length === 0){
            let getHongBaoTime = cc.sys.localStorage.getItem("GET_HONG_BAO_TIME" + this.unionID);
            let timeStr = new Date().format("yyyyMMdd");
            if (timeStr === getHongBaoTime) return;
        }
        // 创建领取红包界面
        Global.DialogManager.createDialog("UI/Union/UnionMain/UnionGetHongBaoDialog", {unionInfo: this.unionInfo});
    },

    updateTableList(gameType){
        //this.tableList.removeAllChildren();
        //this.tableCtrlList = [];
        cc.sys.localStorage.setItem("lastSelectGameType", this.selectGameType.toString());
        let playingCount = 0;
        let selectRuleID = this.tableClassBtnCtrl.getSelectRuleType();
        //let emptyGameRuleIDArr = [];
        let showTableCount = 0;

        this.fullTableCtrlList = [];
        if (!!this.unionInfo.opening){
            this.roomList.sort(function (a, b) {
                if (a.gameStarted === b.gameStarted) return 0;
                else {return !a.gameStarted?-1:1}
            });
            for (let i = 0; i < this.roomList.length; ++i){
                let roomInfo = this.roomList[i];
                // 查找是否现在已经有桌子
                let tableCtrl = this.tableCtrlList.find(function (e) {
                    return roomInfo.roomID === e.roomInfo.roomID;
                });
                let isHide = (!!selectRuleID && selectRuleID !== roomInfo.gameRule._id) || (gameType !== -1 && gameType !== roomInfo.gameRule.gameType);
                let isFull = roomInfo.roomUserInfoArr.length >= roomInfo.gameRule.maxPlayerCount;
                // 显示全部时，如果桌子数量大于10，则不再显示已经坐满的桌子
                if (gameType === -1 && showTableCount >= 20){
                    isHide = isFull;
                }
                if (!!tableCtrl){
                    if (isHide) {
                        tableCtrl.node.active = false;
                        if (gameType !== -1) continue;
                    }
                    else{
                        tableCtrl.node.active = true;
                        tableCtrl.updateRoomInfo(roomInfo);

                        tableCtrl.node.zIndex = (this.tableOrder.isChecked && isFull)?(1000+i):i;

                        showTableCount++;

                        if (isFull) this.fullTableCtrlList.push(tableCtrl);
                    }
                } else{
                    if (isHide){
                        if (gameType !== -1) continue;
                    } else{
                        let node = cc.instantiate(this.tableItemWidgetPrefab);
                        let ctrl = node.getComponent("TableItemWidgetCtrl");
                        ctrl.initWidget(roomInfo, this.unionInfo);
                        node.parent = this.tableList;
                        this.tableCtrlList.push(ctrl);

                        ctrl.node.zIndex = (this.tableOrder.isChecked && isFull)?(1000+i):i;

                        showTableCount++;

                        if (isFull) this.fullTableCtrlList.push(ctrl);
                    }
                }
                playingCount += this.roomList[i].roomUserInfoArr.length;
            }
            // 移除不存在桌子
            for (let i = this.tableCtrlList.length - 1; i >= 0; --i){
                let ctrl = this.tableCtrlList[i];
                if (ctrl.roomInfo.roomID === "") continue;
                let roomInfo = this.roomList.find(function (e) {
                    return e.roomID === ctrl.roomInfo.roomID;
                });
                if (!roomInfo){
                    ctrl.node.destroy();
                    this.tableCtrlList.splice(i, 1);
                }
            }
        }
        // 判断是否需要加空桌
        if (showTableCount < 50 || gameType !== -1){
            // 刷新原来的桌子
            for (let i = 0; i < this.unionInfo.roomRuleList.length; ++i){
                let temp = this.unionInfo.roomRuleList[i];
                let gameRule = JSON.parse(temp.gameRule);
                let isHide = (temp.gameType !== gameType && gameType !== -1) || (!!selectRuleID && selectRuleID !== temp._id);
                let tableCtrl = this.tableCtrlList.find(function (e) {
                    return e.roomInfo.roomID === "" && e.roomInfo.gameRule._id === temp._id;
                });
                gameRule._id = temp._id;
                gameRule.gameType = temp.gameType;
                gameRule.ruleName = temp.ruleName;
                let roomInfo = {
                    roomID: "",
                    gameRule: gameRule,
                    gameStarted: false,
                    curBureau: 0,
                    roomUserInfoArr: []
                };
                if (!!tableCtrl){
                    if (!isHide){
                        tableCtrl.updateRoomInfo(roomInfo);
                        tableCtrl.node.zIndex = 100 + i;

                        showTableCount++;
                    }
                    tableCtrl.node.active = !isHide;
                } else{
                    if (gameType === -1 && showTableCount >= 50) continue;
                    if (isHide) continue;

                    let node = cc.instantiate(this.tableItemWidgetPrefab);
                    let ctrl = node.getComponent("TableItemWidgetCtrl");
                    ctrl.initWidget(roomInfo, this.unionInfo);
                    node.parent = this.tableList;

                    ctrl.node.zIndex = 100 + i;

                    showTableCount++;

                    this.tableCtrlList.push(ctrl);
                }
            }
            // 移除不存在桌子
            for (let i = this.tableCtrlList.length - 1; i >= 0; --i){
                let ctrl = this.tableCtrlList[i];
                if (ctrl.roomInfo.roomID !== "") continue;
                let roomInfo = this.unionInfo.roomRuleList.find(function (e) {
                    return e._id === ctrl.roomInfo.gameRule._id;
                });
                if (!roomInfo){
                    ctrl.node.destroy();
                    this.tableCtrlList.splice(i, 1);
                }
            }
        }

        this.playingCount.string = "入座人数:" + playingCount;
    },

    doDialogAction(){

    },

    createUnionList(unionList){
        this.unionList.removeAllChildren();
        for (let i = 0; i < unionList.length; ++i){
            let node = cc.instantiate(this.unionListItemWidgetPrefab);
            let ctrl = node.getComponent('TableItemWidgetCtrl');
            ctrl.initWidget(unionList[i], this.enterUnion.bind(this));
            node.parent = this.unionList;
        }
    },

    tableClassBtnCallback(){
        this.updateTableList(this.selectGameType);
    }
});
