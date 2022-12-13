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
        ruleNameLabel: cc.Label,
        baseScoreLabel: cc.Label,
        scoreLowLimit: cc.EditBox,
        scoreDismissLimit: cc.EditBox,

        allDrawMode: cc.Toggle,
        oneDrawMode: cc.Toggle,
        avgMode: cc.Toggle,

        bigWinCount1: cc.Toggle,
        bigWinCount2: cc.Toggle,
        bigWinCount3: cc.Toggle,
        bigWinCountAll: cc.Toggle,

        everyFixedScore: cc.EditBox,
        everyAgentFixedScore: cc.EditBox,
        fixedScore: cc.EditBox,
        fixedMinWinScore: cc.EditBox,
        percentScore: cc.EditBox,
        percentMinWinScore: cc.EditBox,

        changeName: cc.EditBox,
        changeNameNode: cc.Node,

        changeBaseScore: cc.EditBox,
        changeBaseScoreNode: cc.Node,

        modifyBtn: cc.Node,

        maskNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.callback = this.dialogParameters.cb;

        this.baseScore = 1;

        if (!!this.dialogParameters.gameRule){
            this.modifyBtn.active = true;
            this.gameRule = JSON.parse(this.dialogParameters.gameRule.gameRule || "{}");
            this.gameType = this.dialogParameters.gameRule.gameType;
            this.ruleNameLabel.string = this.dialogParameters.gameRule.ruleName;

            this.baseScore = this.gameRule.baseScore;
            this.baseScoreLabel.string = "1:" + (this.gameRule.baseScore || 1);

            this.scoreLowLimit.string = (this.gameRule.scoreLowLimit || 0).toString();
            this.scoreDismissLimit.string = (this.gameRule.scoreDismissLimit || 0).toString();

            let roomPayRule = this.gameRule.roomPayRule;
            /*if (roomPayRule.payMode === Global.Enum.roomRentPayType.BIG_WIN){
                this.bigWinMode.isChecked = true;

                this.bigWinCount1.node.parent.parent.active = true;
                this.everyFixedScore.node.parent.active = false;
            } else{
                this.normalMode.isChecked = true;

                this.everyFixedScore.node.parent.active = true;
                this.bigWinCount1.node.parent.parent.active = false;
            }*/
            if (!!roomPayRule.fixedScore) this.fixedScore.string = roomPayRule.fixedScore.toString();
            if (!!roomPayRule.fixedMinWinScore) this.fixedMinWinScore.string = roomPayRule.fixedMinWinScore.toString();
            if (!!roomPayRule.percentScore) this.percentScore.string = roomPayRule.percentScore.toString();
            if (!!roomPayRule.percentMinWinScore) this.percentMinWinScore.string = roomPayRule.percentMinWinScore.toString();
            if (!!roomPayRule.everyFixedScore) this.everyFixedScore.string = roomPayRule.everyFixedScore.toString();
            if (!!roomPayRule.everyAgentFixedScore) this.everyAgentFixedScore.string = roomPayRule.everyAgentFixedScore.toString();
            if (!!roomPayRule.bigWinCount){
                if (roomPayRule.bigWinCount === -1){
                    this.bigWinCountAll.isChecked = true;
                } else if (roomPayRule.bigWinCount === 1){
                    this.bigWinCount1.isChecked = true;
                } else if (roomPayRule.bigWinCount === 2){
                    this.bigWinCount2.isChecked = true;
                } else if (roomPayRule.bigWinCount === 3){
                    this.bigWinCount3.isChecked = true;
                }
            }
            if (roomPayRule.rebateType === 'one'){
                this.oneDrawMode.isChecked = true;
            }else{
                this.allDrawMode.isChecked = true;
            }

            if (roomPayRule.isAvg !== false){
                this.avgMode.isChecked = true;
            }

            //this.maskNode.active = true;
        }
    },

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'addRule':
                Global.DialogManager.createDialog("UI/Room/CreateRoomDialog", {isAddGameRule: true, gameRule: this.gameRule, cb: function (gameType, gameRule) {
                    this.gameType = gameType;
                    this.gameRule = gameRule;

                    if (this.ruleNameLabel.string.length === 0){
                        if (this.gameType === Global.Enum.gameType.SG){
                            this.ruleNameLabel.string = "三公";
                        }
						else if (this.gameType === Global.Enum.gameType.SZ){
                            this.ruleNameLabel.string = "赢三张";
                        }
						else if (this.gameType === Global.Enum.gameType.NN){
                            this.ruleNameLabel.string = "牛牛";
                        }
						else if (this.gameType === Global.Enum.gameType.PDK){
                            this.ruleNameLabel.string = "跑得快";
                        }
						else if (this.gameType === Global.Enum.gameType.ZNMJ){
                            this.ruleNameLabel.string = "红中麻将";
                        }
						else if (this.gameType === Global.Enum.gameType.DGN){
                            this.ruleNameLabel.string = "斗公牛";
                        }
                    }
                }.bind(this)});
                break;
            case 'changeName':
                this.changeName.string = this.ruleNameLabel.string;
                this.changeNameNode.active = true;
                break;
            case 'changeNameConfirm':
                this.changeNameNode.active = false;
                if (this.changeName.string.length > 0){
                    this.ruleNameLabel.string = this.changeName.string;
                }
                break;
            case 'closeChangeName':
                this.changeNameNode.active = false;
                break;
            case 'changeBaseScore':
                this.changeBaseScore.string = this.baseScore.toString();
                this.changeBaseScoreNode.active = true;
                break;
            case 'changeBaseScoreConfirm':
                let baseScore = Math.floor(parseFloat(this.changeBaseScore.string) * 100)/100;
                if (baseScore <= 0){
                    Global.DialogManager.addTipDialog("请输入正确的分数比例");
                    return;
                }
                this.baseScore = baseScore;
                this.changeBaseScoreNode.active = false;
                this.baseScoreLabel.string = "1:" + baseScore;
                break;
            case 'closeBaseScoreNode':
                this.changeBaseScoreNode.active = false;
                break;
            case 'bigWinMode':
                this.bigWinCount1.node.parent.parent.active = true;
                this.everyFixedScore.node.parent.active = false;
                this.everyAgentFixedScore.node.parent.active = false;
                break;
            case 'AAMode':
                this.everyFixedScore.node.parent.active = true;
                this.everyAgentFixedScore.node.parent.active = true;
                this.bigWinCount1.node.parent.parent.active = false;
                break;
            case 'finished':
                if (!this.gameRule) {
                    Global.DialogManager.addTipDialog("请添加游戏规则");
                    return;
                }
                if (!this.ruleNameLabel.string){
                    Global.DialogManager.addTipDialog("请输入规则名字");
                    return;
                }
                if (this.baseScore < 1){
                    Global.DialogManager.addTipDialog("请输入正确的分数比例");
                    return;
                }
                this.gameRule.baseScore = this.baseScore;

                let scoreLowLimit = Math.floor(parseFloat(this.scoreLowLimit.string) * 100)/100;
                let scoreDismissLimit = Math.floor(parseFloat(this.scoreDismissLimit.string) * 100)/100;
                if (scoreLowLimit <= 0) {
                    Global.DialogManager.addTipDialog("请输入参与游戏分数");
                    return;
                }
                if (scoreDismissLimit <= 0) {
                    Global.DialogManager.addTipDialog("请输入解散的最低分数");
                    return;
                }
                if (scoreLowLimit <= scoreDismissLimit){
                    Global.DialogManager.addTipDialog("参与游戏分数必须高于解散最低分数");
                    return;
                }

                this.gameRule.scoreLowLimit = scoreLowLimit;
                this.gameRule.scoreDismissLimit = scoreDismissLimit;

                let roomPayRule = {};
                // 模式选择
                /*if(!!this.bigWinMode.isChecked){
                    roomPayRule.payMode = Global.Enum.roomRentPayType.BIG_WIN;
                    roomPayRule.bigWinCount = 1;
                    if (this.bigWinCount1.isChecked){
                        roomPayRule.bigWinCount = 1;
                    }else if (this.bigWinCount2.isChecked){
                        roomPayRule.bigWinCount = 2;
                    }else if (this.bigWinCount3.isChecked){
                        roomPayRule.bigWinCount = 3;
                    } else if (this.bigWinCountAll.isChecked){
                        roomPayRule.bigWinCount = -1;
                    }
                }else{
                    roomPayRule.payMode = Global.Enum.roomRentPayType.AA;
                    roomPayRule.everyFixedScore = this.everyFixedScore.string.length === 0?null:parseInt(this.everyFixedScore.string);
                }*/
                roomPayRule.bigWinCount = 1;
                if (this.bigWinCount1.isChecked){
                    roomPayRule.bigWinCount = 1;
                }else if (this.bigWinCount2.isChecked){
                    roomPayRule.bigWinCount = 2;
                }else if (this.bigWinCount3.isChecked){
                    roomPayRule.bigWinCount = 3;
                } else if (this.bigWinCountAll.isChecked){
                    roomPayRule.bigWinCount = -1;
                }
                roomPayRule.rebateType = "all";
                if (this.oneDrawMode.isChecked){
                    roomPayRule.rebateType = "one";
                }

                roomPayRule.isAvg = this.avgMode.isChecked;

                roomPayRule.everyFixedScore = this.everyFixedScore.string.length === 0?null:(Math.floor(parseFloat(this.everyFixedScore.string) * 100)/100);
                roomPayRule.everyAgentFixedScore = this.everyAgentFixedScore.string.length === 0?null:(Math.floor(parseFloat(this.everyAgentFixedScore.string) * 100)/100);

                roomPayRule.fixedScore = this.fixedScore.string.length === 0?null:(Math.floor(parseFloat(this.fixedScore.string) * 100)/100);
                roomPayRule.fixedMinWinScore = this.fixedMinWinScore.string.length === 0?null:(Math.floor(parseFloat(this.fixedMinWinScore.string) * 100)/100);
                roomPayRule.percentScore = this.percentScore.string.length === 0?null:(Math.floor(parseFloat(this.percentScore.string) * 100)/100);
                roomPayRule.percentMinWinScore = this.percentMinWinScore.string.length === 0?null:(Math.floor(parseFloat(this.percentMinWinScore.string) * 100)/100);

                this.gameRule.roomPayRule = roomPayRule;
                this.callback(this.gameType, this.ruleNameLabel.string, this.gameRule);
                Global.DialogManager.destroyDialog(this);
                break;
        }
    }

    // update (dt) {},
});
