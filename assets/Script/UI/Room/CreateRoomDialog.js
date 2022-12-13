let NNProto     = require('../../Game/Niuniu/NNProto');
let DGNProto    = require('../../Game/Dougongniu/DGNProto');
let SGProto     = require('../../Game/Sangong/SGProto');
let SZProto     = require('../../Game/Sanzhang/SZProto');
let PDKProto    = require('../../Game/PaoDeKuai/PDKProto');
let MJProto     = require('../../Game/Majiang/MJProto');
let enumeration = require('../../Constant/enumeration');

cc.Class({
    extends: cc.Component,

    properties: {
		ruleNode: cc.Node,//跑得快
		nnRuleNode: cc.Node,//牛牛
		dgnRuleNode: cc.Node,//斗公牛
		sgRuleNode: cc.Node,//三公
		szRuleNode: cc.Node,//三张
		znmjRuleNode: cc.Node,//麻将
		nnRulePanel: cc.Node,//牛牛特殊规则
		dgnRulePanel: cc.Node,//斗公牛特殊规则

		xiaojuNode: cc.Node,

		nnRobBankEdit: cc.EditBox,
		nnXiazhuangfenEdit: cc.EditBox,

        addRuleTitleNode: cc.Node, //创建房间标题-亲友圈
        createRoomTitleNode: cc.Node,//创建房间标题-普通

		leftPdkToggle: cc.Toggle,
		leftPszToggle: cc.Toggle,
		leftNnToggle: cc.Toggle,
		leftDgnToggle: cc.Toggle,
		leftSgToggle: cc.Toggle,
		leftZNMJToggle: cc.Toggle,
		maxPourScoreEdit: cc.EditBox,
    },

    start () {
        this.gameType = Global.Enum.gameType.PDK;

        this.isAddGameRule = !!this.dialogParameters && !!this.dialogParameters.isAddGameRule;
		this.pdkGameRule = { /* 跑得快默认规则 */ 
			bureau:         10,
            payDiamond:     4,
            payType:        this.isAddGameRule ? enumeration.roomPayType.WOZHIFU : enumeration.roomPayType.AAZHIFU,
			minPlayerCount: 2,
			maxPlayerCount: 2,
			gameType:       Global.Enum.gameType.PDK,
			gameFrameType:  PDKProto.gameType.JINGDIAN,
			fangzuobi:      false, /* 防作弊 */
			showCardsCount: true,  /* 显示牌数 */
			heitao3:        false, /* 黑桃3必出 */
			baiwei:         true,  /* 必须3带2摆尾 */
			chaizhadan:     false, /* 炸弹不可拆 */
			hongtao10:      false, /* 红桃10双倍 */
			bichu:          true,  /* 必须出牌 */
			zhinengshunzi:  false, /* 智能顺子 */
			canTrust:       true,  /* 能否托管 */
			trustTm:        30,    /* 托管时间 */
			xiaojuTrust:    false, /* 小局托管 */
			canWatch:       false,
			fourTakeTwo:    false, /* 四代二 */
			fourTakeThree:  false, /* 四代三 */
			ThreeABomb:     false, /* 三A算炸 */ 
			yuyin:          false,
			baseScore:      1,     /* 基础分 */ 
		};
		this.nnGameRule = { /* 牛牛默认规则 */ 
			bureau:         10,
            payDiamond:     4,
            payType:        this.isAddGameRule ? enumeration.roomPayType.WOZHIFU : enumeration.roomPayType.AAZHIFU,
			minPlayerCount: 2,
			maxPlayerCount: 6,
			gameType:       Global.Enum.gameType.NN, 
			gameFrameType:  NNProto.gameType.NIUNIU,
			sendCardType:   NNProto.sendCardType.QUANAN,
			scaleType:      NNProto.scaleType.LITTLE,
			tuiScale:       [3, 10],
			canPourScores:  [1, 2],
			canTrust:       false,
			trustTm:        10,
			canEnter:       false,
			cuopai:         false,
			cardsType: {
				MEINIU: NNProto.cardsType.MEINIU,
				YOUNIU: NNProto.cardsType.YOUNIU,
				NIUNIU: NNProto.cardsType.NIUNIU,
			},
			canWatch:   false, /* 允许观战 */
			yuyin:      false,
			baseScore:      1,
			tuizhu:     false,
			robBankLimit: 0,
		};
		this.dgnGameRule = { /* 牛牛默认规则 */ 
			bureau:         10,
            payDiamond:     4,
            payType:        this.isAddGameRule ? enumeration.roomPayType.WOZHIFU : enumeration.roomPayType.AAZHIFU,
			minPlayerCount: 2,
			maxPlayerCount: 6,
			gameType:       Global.Enum.gameType.DGN,
			scaleType:      NNProto.scaleType.LITTLE,
			canTrust:       false,
			trustTm:        10,
			canEnter:       false,
			cuopai:         false,
			cardsType: {
				MEINIU: NNProto.cardsType.MEINIU,
				YOUNIU: NNProto.cardsType.YOUNIU,
				NIUNIU: NNProto.cardsType.NIUNIU,
			},
			firstBureauRate: 0.1, /* 首局下分最小比例 */ 
			bureauRate: 0.1, /* 下分最小比例 */ 
			beBankerScores: [50, 100, 200, 400, 500, 1000, 2000, 4000],
			shouzhuang: 200, /* 首庄大小 */ 
			lianzhuangType: DGNProto.lianzhuangType.SHENGZHUANG, /* 连庄类型 */ 
			lianzhuangCount: 1, /* 连庄次数 */ 
			canWatch:   false, /* 允许观战 */
			yuyin:      false,
			baseScore:      1,
			xiazhuangfen: 0,
		};
		this.sgGameRule = { /* 三公默认规则 */ 
			bureau:         10,
            payDiamond:     4,
            payType:        this.isAddGameRule ? enumeration.roomPayType.WOZHIFU : enumeration.roomPayType.AAZHIFU,
			minPlayerCount: 2,
			maxPlayerCount: 6,
			gameType:       Global.Enum.gameType.SG,
			gameFrameType:  SGProto.gameType.QIANGZHUANG,
			sendCardType:   SGProto.sendCardType.QUANAN,
			scaleType:      SGProto.scaleType.LITTLE,
			canPourScores:  [1, 2, 3, 4],
			canTrust:       false,
			trustTm:        15,
			canEnter:       false,
			cuopai:         false,
			canWatch:       false,
			yuyin:          false,
			baseScore:      1,
			maxCanPourGold: 4,
		};
		this.szGameRule = { /* 三张默认规则 */ 
			bureau:         6,
            payDiamond:     2,
            payType:        this.isAddGameRule ? enumeration.roomPayType.WOZHIFU : enumeration.roomPayType.AAZHIFU,
			minPlayerCount: 2,
			maxPlayerCount: 6,
			gameType:       Global.Enum.gameType.SZ,
			gameFrameType:  SZProto.gameType.NONE,
			roundType:      SZProto.roundType.ROUND10,
			fangzuobi:      false, /* 防作弊 */
			addScores:      [1], /* 加注分 */
			maxScore:       4, /* 最大加注分 */
			canTrust:       false,
			canEnter:       false,
			cuopai:         false,
			canWatch:       false,
			yuyin:          false,
			baseScore:      1,
		};
		this.znmjGameRule = { /* 麻将默认规则 */ 
			bureau:         8,
            payDiamond:     4,
            payType:        this.isAddGameRule ? enumeration.roomPayType.WOZHIFU : enumeration.roomPayType.AAZHIFU,
			minPlayerCount: 4,
			maxPlayerCount: 4,
			gameType:       Global.Enum.gameType.ZNMJ,
			gameFrameType:  MJProto.gameType.HONGZHONG4,
			ma:             2,
			canTrust:       false,
			trustTm:        0,    /* 托管时间 */
			canEnter:       false,
			yuyin:          false,
			baseScore:      1,
			qidui:          false,
			chunniunai:     false,
		};

        if (!!this.isAddGameRule){
            this.addGameRuleCallback = this.dialogParameters.cb;

            this.addRuleTitleNode.active = true;

            this.createRoomTitleNode.active = false;

            let gameRule = this.dialogParameters.gameRule;
            if (!!gameRule){
                this.setGameRule(gameRule);
            }
        }

    },

	setGameRule: function (gameRule) {
		this.gameType = gameRule.gameType;
		this.ruleNode.active = (this.gameType == Global.Enum.gameType.PDK);
		this.szRuleNode.active = (this.gameType == Global.Enum.gameType.SZ);
		this.nnRuleNode.active = (this.gameType == Global.Enum.gameType.NN);
		this.dgnRuleNode.active = (this.gameType == Global.Enum.gameType.DGN);
		this.sgRuleNode.active = (this.gameType == Global.Enum.gameType.SG);
		this.znmjRuleNode.active = (this.gameType == Global.Enum.gameType.ZNMJ);
		if (this.gameType == Global.Enum.gameType.PDK) {
			this.setPDKGameRule(gameRule);
			this.leftPdkToggle.isChecked = true;
		}
		else if (this.gameType == Global.Enum.gameType.SZ) {
			this.setSZGameRule(gameRule);
			this.leftPszToggle.isChecked = true;
		}
		else if (this.gameType == Global.Enum.gameType.NN) {
			this.setNNGameRule(gameRule);
			this.leftNnToggle.isChecked = true;
		}
		else if (this.gameType == Global.Enum.gameType.DGN) {
			this.setDGNGameRule(gameRule);
			this.leftDgnToggle.isChecked = true;
		}
		else if (this.gameType == Global.Enum.gameType.SG) {
			this.setSGGameRule(gameRule);
			this.leftSgToggle.isChecked = true;
		}
		else if (this.gameType == Global.Enum.gameType.ZNMJ) {
			this.setZNMJGameRule(gameRule);
			this.leftZNMJToggle.isChecked = true;
		}
	},

	onGameTypeClick: function (event, param) {
		if (param == 'PDK') {
			this.gameType = Global.Enum.gameType.PDK;
		}
		else if (param == 'NN') {
			this.gameType = Global.Enum.gameType.NN;
			this.nnRulePanel.active = false;
		}
		else if (param == 'SG') {
			this.gameType = Global.Enum.gameType.SG;
		}
		else if (param == 'SZ') {
			this.gameType = Global.Enum.gameType.SZ;
		}
		else if (param == 'ZNMJ') {
			this.gameType = Global.Enum.gameType.ZNMJ;
		}
		else if (param == 'DGN') {
			this.gameType = Global.Enum.gameType.DGN;
		}
		this.ruleNode.active = (param == 'PDK');
		this.nnRuleNode.active = (param == 'NN');
		this.sgRuleNode.active = (param == 'SG');
		this.szRuleNode.active = (param == 'SZ');
		this.znmjRuleNode.active = (param == 'ZNMJ');
		this.dgnRuleNode.active = (param == 'DGN');

	},

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
		switch (param) {
			case 'close':
				Global.DialogManager.destroyDialog(this);
				break;
			case 'createRoom':
				let gameRule = {};
				if (this.gameType == Global.Enum.gameType.NN) {
					gameRule = this.nnGameRule;
				}
				else if (this.gameType == Global.Enum.gameType.DGN) {
					gameRule = this.dgnGameRule;
					if (gameRule.xiazhuangfen <= 0) {
						Global.DialogManager.addTipDialog("您还没有设置下庄分！");
						return;
					}
				}
				else if (this.gameType == Global.Enum.gameType.SG) {
					gameRule = this.sgGameRule;
				}
				else if (this.gameType == Global.Enum.gameType.SZ) {
					gameRule = this.szGameRule;
				}
				else if (this.gameType == Global.Enum.gameType.PDK) {
					gameRule = this.pdkGameRule;
				}
				else if (this.gameType == Global.Enum.gameType.ZNMJ) {
					gameRule = this.znmjGameRule;
				}
				if (!!this.isAddGameRule){
					this.addGameRuleCallback(this.gameType, gameRule);
					Global.DialogManager.destroyDialog(this);
				} else{
					Global.DialogManager.addLoadingCircle();
					gameRule.roomType = this.gameType;
					if (!gameRule.payType) gameRule.payType = Global.Enum.roomPayType.AAZHIFU;
					// 测试使用，实际所需钻石数量需要做计算
					// 计算需要的钻石数量
					Global.API.hall.createRoomRequest(gameRule, null, 1);
				}
				break;
		}
	},

	/*
	 * 牛牛规则按钮
	 */
	onNNRuleButtonClick: function (event, param) {
		console.log('onNNRuleButtonClick', param);
		if (param.indexOf('bureau') != -1) {
            let bureau = parseInt(param.split('_')[1]);
            this.nnGameRule.bureau = bureau;
            let costDiamond = 4;
            if (bureau == 20) {
                costDiamond = 8;
            }
            else if (bureau == 30) {
                costDiamond = 12;
            }
            this.nnGameRule.payDiamond = costDiamond;
		}
		else if(['BIG', 'LITTLE', 'DIANZI'].indexOf(param) != -1) {
			this.nnGameRule.scaleType = NNProto.scaleType[param];
		}
		else if(['NIUNIU', 'ZHIYOUQZ', 'LUNZHUANG', 'TONGBI', 'FANGZHU', 'MINGPAIQZ'].indexOf(param) != -1) {
			this.nnGameRule.gameFrameType = NNProto.gameType[param];
		}
		else if(param.indexOf('member') != -1) {
			this.nnGameRule.maxPlayerCount = parseInt(param.slice(6));
		}
		else if(['AAZHIFU', 'YINGJIAZHIFU', 'WOZHIFU'].indexOf(param) != -1) {
			this.nnGameRule.payType = enumeration.roomPayType[param];
		}
		else if(param == 'ming3an2') {
			this.nnGameRule.sendCardType = NNProto.sendCardType.MING3AN2;
		}
		else if(param == 'ming4an1') {
			this.nnGameRule.sendCardType = NNProto.sendCardType.MING4AN1;
		}
		else if(param == 'quanan') {
			this.nnGameRule.sendCardType = NNProto.sendCardType.QUANAN;
		}
		else if(['SHUNZINIU', 'YINNIU', 'TONGHUANIU', 'WUHUANIU', 'HULUNIU', 'WUXIAONIU', 'ZHADANNIU', 'YITIAOLONG', 'TONGHUASHUN'].indexOf(param) != -1) {
			this.nnGameRule.cardsType[param] = (event.isChecked)? NNProto.cardsType[param]:null;
		}
		else if(param == 'jinren') {
			this.nnGameRule.canEnter = event.isChecked;
		}
		else if(param == 'guanzhan') {
			this.nnGameRule.canWatch = event.isChecked;
		}
		else if(param == 'cuopai') {
			this.nnGameRule.cuopai = event.isChecked;
		}
		else if(param == 'butuoguan') {
			this.nnGameRule.canTrust = false;
		}
		else if(param == 'tuoguan10') {
			this.nnGameRule.canTrust = true;
			this.nnGameRule.trustTm = 10;
		}
		else if(param == 'tuoguan15') {
			this.nnGameRule.canTrust = true;
			this.nnGameRule.trustTm = 15;
		}
		else if(param == 'tuoguan20') {
			this.nnGameRule.canTrust = true;
			this.nnGameRule.trustTm = 20;
		}
		else if(param == 'tuoguan30') {
			this.nnGameRule.canTrust = true;
			this.nnGameRule.trustTm = 30;
		}
		else if(param == 'yuyin') {
			this.nnGameRule.yuyin = event.isChecked;
		}
		else if(param == 'tuizhu') {
			this.nnGameRule.tuizhu = event.isChecked;
		}
		else if(param == 'tui10') {
			this.nnGameRule.tuiScale = [3, 10];
		}
		else if(param == 'tui20') {
			this.nnGameRule.tuiScale = [6, 20];
		}
		else if(param == 'fen12') {
			this.nnGameRule.canPourScores = [1, 2];
		}
		else if(param == 'fen24') {
			this.nnGameRule.canPourScores = [2, 4];
		}
		else if(param == 'fen48') {
			this.nnGameRule.canPourScores = [4, 8];
		}
		else if(param == 'rulepanel') {
			this.nnRulePanel.active = !this.nnRulePanel.active;
			if (this.nnGameRule.scaleType == NNProto.scaleType.DIANZI) {
				cc.find("tonghuashun/label", this.nnRulePanel).getComponent(cc.Label).string = "同花顺(16倍)";
				cc.find("yitiaolong/label", this.nnRulePanel).getComponent(cc.Label).string = "一条龙(15倍)";
				cc.find("zhadan/label", this.nnRulePanel).getComponent(cc.Label).string = "炸弹牛(14倍)";
				cc.find("wuxiaoniu/label", this.nnRulePanel).getComponent(cc.Label).string = "五小牛(13倍)";
				cc.find("huluniu/label", this.nnRulePanel).getComponent(cc.Label).string = "葫芦牛(12倍)";
				cc.find("wuhuaniu/label", this.nnRulePanel).getComponent(cc.Label).string = "五花牛(11倍)";
				cc.find("tonghuaniu/label", this.nnRulePanel).getComponent(cc.Label).string = "同花牛(11倍)";
				cc.find("shunziniu/label", this.nnRulePanel).getComponent(cc.Label).string = "顺子牛(11倍)";
			}
			else {
				cc.find("tonghuashun/label", this.nnRulePanel).getComponent(cc.Label).string = "同花顺(10倍)";
				cc.find("yitiaolong/label", this.nnRulePanel).getComponent(cc.Label).string = "一条龙(9倍)";
				cc.find("zhadan/label", this.nnRulePanel).getComponent(cc.Label).string = "炸弹牛(8倍)";
				cc.find("wuxiaoniu/label", this.nnRulePanel).getComponent(cc.Label).string = "五小牛(7倍)";
				cc.find("huluniu/label", this.nnRulePanel).getComponent(cc.Label).string = "葫芦牛(6倍)";
				cc.find("wuhuaniu/label", this.nnRulePanel).getComponent(cc.Label).string = "五花牛(6倍)";
				cc.find("tonghuaniu/label", this.nnRulePanel).getComponent(cc.Label).string = "同花牛(6倍)";
				cc.find("shunziniu/label", this.nnRulePanel).getComponent(cc.Label).string = "顺子牛(4倍)";
			}
		}
		else if(param == "banklimit") {
			let num = parseInt(this.nnRobBankEdit.string);
			if (isNaN(num) || num < 0) {
				Global.DialogManager.addTipDialog("输入格式不正确！");
			}
			else {
				this.nnGameRule.robBankLimit = num;
			}
		}
		console.log('this.nnGameRule', this.nnGameRule);
	},

	/*
	 * 斗公牛规则
	 */
	onDGNRuleButtonClick: function (event, param) {
		console.log('onDGNRuleButtonClick', param);
		if (param.indexOf('bureau') != -1) {
            let bureau = parseInt(param.split('_')[1]);
            this.dgnGameRule.bureau = bureau;
            let costDiamond = 4;
            if (bureau == 20) {
                costDiamond = 8;
            }
            else if (bureau == 30) {
                costDiamond = 12;
            }
            this.dgnGameRule.payDiamond = costDiamond;
		}
		else if(['BIG', 'LITTLE', 'DIANZI'].indexOf(param) != -1) {
			this.dgnGameRule.scaleType = DGNProto.scaleType[param];
		}
		else if(param.indexOf('member') != -1) {
			this.dgnGameRule.maxPlayerCount = parseInt(param.slice(6));
		}
		else if(['AAZHIFU', 'YINGJIAZHIFU', 'WOZHIFU'].indexOf(param) != -1) {
			this.dgnGameRule.payType = enumeration.roomPayType[param];
		}
		else if(['SHUNZINIU', 'YINNIU', 'TONGHUANIU', 'WUHUANIU', 'HULUNIU', 'WUXIAONIU', 'ZHADANNIU', 'YITIAOLONG', 'TONGHUASHUN'].indexOf(param) != -1) {
			this.dgnGameRule.cardsType[param] = (event.isChecked)? DGNProto.cardsType[param]:null;
		}
		else if(param == 'jinren') {
			this.dgnGameRule.canEnter = event.isChecked;
		}
		else if(param == 'guanzhan') {
			this.dgnGameRule.canWatch = event.isChecked;
		}
		else if(param == 'cuopai') {
			this.dgnGameRule.cuopai = event.isChecked;
		}
		else if(param == 'butuoguan') {
			this.dgnGameRule.canTrust = false;
		}
		else if(param == 'tuoguan10') {
			this.dgnGameRule.canTrust = true;
			this.dgnGameRule.trustTm = 10;
		}
		else if(param == 'tuoguan15') {
			this.dgnGameRule.canTrust = true;
			this.dgnGameRule.trustTm = 15;
		}
		else if(param == 'tuoguan20') {
			this.dgnGameRule.canTrust = true;
			this.dgnGameRule.trustTm = 20;
		}
		else if(param == 'tuoguan30') {
			this.dgnGameRule.canTrust = true;
			this.dgnGameRule.trustTm = 30;
		}
		else if(param == 'yuyin') {
			this.dgnGameRule.yuyin = event.isChecked;
		}
		else if(param == 'tuizhu') {
			this.dgnGameRule.tuizhu = event.isChecked;
		}
		else if(param == 'rulepanel') {
			this.dgnRulePanel.active = !this.dgnRulePanel.active;
			if (this.dgnGameRule.scaleType == DGNProto.scaleType.DIANZI) {
				cc.find("tonghuashun/label", this.dgnRulePanel).getComponent(cc.Label).string = "同花顺(16倍)";
				cc.find("yitiaolong/label", this.dgnRulePanel).getComponent(cc.Label).string = "一条龙(15倍)";
				cc.find("zhadan/label", this.dgnRulePanel).getComponent(cc.Label).string = "炸弹牛(14倍)";
				cc.find("wuxiaoniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "五小牛(13倍)";
				cc.find("huluniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "葫芦牛(12倍)";
				cc.find("wuhuaniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "五花牛(11倍)";
				cc.find("tonghuaniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "同花牛(11倍)";
				cc.find("shunziniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "顺子牛(11倍)";
			}
			else {
				cc.find("tonghuashun/label", this.dgnRulePanel).getComponent(cc.Label).string = "同花顺(10倍)";
				cc.find("yitiaolong/label", this.dgnRulePanel).getComponent(cc.Label).string = "一条龙(9倍)";
				cc.find("zhadan/label", this.dgnRulePanel).getComponent(cc.Label).string = "炸弹牛(8倍)";
				cc.find("wuxiaoniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "五小牛(7倍)";
				cc.find("huluniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "葫芦牛(6倍)";
				cc.find("wuhuaniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "五花牛(6倍)";
				cc.find("tonghuaniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "同花牛(6倍)";
				cc.find("shunziniu/label", this.dgnRulePanel).getComponent(cc.Label).string = "顺子牛(4倍)";
			}
		}
		else if(param == "xiazhuangfen") {
			let num = parseInt(this.nnXiazhuangfenEdit.string);
			if (isNaN(num) || num < 0) {
				Global.DialogManager.addTipDialog("输入格式不正确！");
			}
			else {
				this.dgnGameRule.xiazhuangfen = num;
			}
		}
		else if(["shouzhuang_50", "shouzhuang_100", "shouzhuang_200", "shouzhuang_400", "shouzhuang_500", "shouzhuang_1000", "shouzhuang_2000", "shouzhuang_4000"].indexOf(param) != -1) {
			this.dgnGameRule.shouzhuang = parseInt(param.split("_")[1]);
		}
		else if(["shouju_10", "shouju_20"].indexOf(param) != -1) {
			this.dgnGameRule.firstBureauRate = parseInt(param.split("_")[1])/100;
		}
		else if(["shoujuhou_10", "shoujuhou_5"].indexOf(param) != -1) {
			this.dgnGameRule.bureauRate = parseInt(param.split("_")[1])/100;
		}
		else if(param == "shengzhuang") {
			this.dgnGameRule.lianzhuangType = DGNProto.lianzhuangType.SHENGZHUANG;
		}
		else if(param == "lunzhuang") {
			this.dgnGameRule.lianzhuangType = DGNProto.lianzhuangType.LUNZHUANG;
		}
		else if (param == "lianzhuang_1") {
			this.dgnGameRule.lianzhuangCount = 1;
		}
		else if (param == "lianzhuang_2") {
			this.dgnGameRule.lianzhuangCount = 2;
		}
		console.log('this.dgnGameRule', this.dgnGameRule);
	},

    /*
     * 跑得快规则按钮
     */
    onPDKRuleButtonClick: function (event, param) {
        console.log('onPDKRuleButtonClick', param);
        if (param.indexOf('bureau') != -1) {
            let bureau = parseInt(param.split('_')[1]);
            this.pdkGameRule.bureau = bureau;
            let costDiamond = 4;
            if (bureau == 20) {
                costDiamond = 8;
            }
            this.pdkGameRule.payDiamond = costDiamond;
        }
        else if(['JINGDIAN', 'CARDS15', 'PINGJIANG'].indexOf(param) != -1) {
            this.pdkGameRule.gameFrameType = PDKProto.gameType[param];
        }
        else if(param == 'fangzuobi') {
            this.pdkGameRule.fangzuobi = event.isChecked;
        }
        else if (param == 'xianshipai') {
            this.pdkGameRule.showCardsCount = true;
        }
        else if(param == 'buxianshipai') {
            this.pdkGameRule.showCardsCount = false;
        }
        else if(param == 'heitao3') {
            this.pdkGameRule.heitao3 = event.isChecked;
        }
        else if(param == 'bubaiwei') {
            this.pdkGameRule.baiwei = !event.isChecked;
        }
        else if(param.indexOf('member') != -1) {
            this.pdkGameRule.maxPlayerCount = parseInt(param.slice(6));
            this.pdkGameRule.minPlayerCount = parseInt(param.slice(6));
        }
        else if(param == 'kechai') {
            this.pdkGameRule.chaizhadan = true;
        }
        else if(param == 'bukechai') {
            this.pdkGameRule.chaizhadan = false;
        }
        else if(param == 'hongtao10') {
            this.pdkGameRule.hongtao10 = event.isChecked;
        }
        else if(param == 'bichu') {
            this.pdkGameRule.bichu = true;
        }
        else if(param == 'bubichu') {
            this.pdkGameRule.bichu = false;
        }
        else if(param == 'zhineng') {
            this.pdkGameRule.zhinengshunzi = event.isChecked;
        }
        else if(param == 'butuoguan') {
            this.pdkGameRule.canTrust = false;
            this.xiaojuNode.active = false;
        }
        else if(['tuoguan30', 'tuoguan60', 'tuoguan120'].indexOf(param) != -1) {
            this.pdkGameRule.canTrust = true;
            this.pdkGameRule.trustTm = parseInt(param.slice(7));
            this.xiaojuNode.active = true;
        }
        else if(param == 'xiaoju') {
            this.pdkGameRule.xiaojuTrust = event.isChecked;
        }
        else if(param == '4dai2') {
            this.pdkGameRule.fourTakeTwo = event.isChecked;
        }
        else if(param == '4dai3') {
            this.pdkGameRule.fourTakeThree = event.isChecked;
        }
        else if(param == '3Azha') {
            this.pdkGameRule.ThreeABomb = event.isChecked;
        }
        else if(param == 'yuyin') {
            this.pdkGameRule.yuyin = event.isChecked;
        }
        console.log('this.pdkGameRule', this.pdkGameRule);
    },

	/*
	 * 三公规则按钮
	 */
	onSGRuleButtonClick: function (event, param) {
		console.log('onSGRuleButtonClick', param);
		if (param.indexOf('bureau') != -1) {
            let bureau = parseInt(param.split('_')[1]);
            this.sgGameRule.bureau = bureau;
            let costDiamond = 4;
            if (bureau == 20) {
                costDiamond = 8;
            }
            else if (bureau == 30) {
                costDiamond = 12;
            }
            this.sgGameRule.payDiamond = costDiamond;
		}
		else if(param.indexOf('member') != -1) {
			this.sgGameRule.maxPlayerCount = parseInt(param.slice(6));
		}
		else if(['BIG', 'LITTLE'].indexOf(param) != -1) {
			this.sgGameRule.scaleType = SGProto.scaleType[param];
		}
		else if(['QIANGZHUANG', 'DACHIXIAOZHUANG', 'BAWANGZHUANG', 'LUNZHUANG', 'SANGONGZHUANG', 'PAIDAZHUANG'].indexOf(param) != -1) {
			this.sgGameRule.gameFrameType = SGProto.gameType[param];
		}
		else if (['QUANAN', 'MING1AN2', 'MING2AN1'].indexOf(param) != -1) {
			this.sgGameRule.sendCardType = SGProto.sendCardType[param];
		}
		else if(param.indexOf('/') != -1) {
			let array = param.split('/');
			for (let i = 0; i < array.length; ++i) {
				array[i] = parseInt(array[i]);
			}
			this.sgGameRule.canPourScores = array;
			this.sgGameRule.maxCanPourGold = array[3];
			this.maxPourScoreEdit.string = ""+array[3];
		}
		else if(param == 'cuopai') {
			this.sgGameRule.cuopai = event.isChecked;
		}
		else if(param == 'jinren') {
			this.sgGameRule.canEnter = event.isChecked;
		}
		else if(param == 'guanzhan') {
			this.sgGameRule.canWatch = event.isChecked;
		}
		else if(param == 'tuoguan') {
			this.sgGameRule.canTrust = event.isChecked;
		}
		else if(param == 'yuyin') {
			this.sgGameRule.yuyin = event.isChecked;
		}
		else if(param == 'editbox') {
			let num = parseInt(this.maxPourScoreEdit.string);
			if (isNaN(num) || num <= 0) {
				Global.DialogManager.addTipDialog("输入格式不正确！");
				this.maxPourScoreEdit.string = ""+this.sgGameRule.canPourScores[3];
			}
			else if(num < this.sgGameRule.canPourScores[3]) {
				Global.DialogManager.addTipDialog("下限必须不小于"+this.sgGameRule.canPourScores[3]+"!");
				this.maxPourScoreEdit.string = ""+this.sgGameRule.canPourScores[3];
			}
			else {
				this.sgGameRule.maxCanPourGold = num;
			}
		}
		console.log('this.sgGameRule', this.sgGameRule);
	},

	/*
	 * 三张规则
	 */
	onSZRuleButtonClick: function (event, param) {
		console.log('onSZRuleButtonClick', param);
		if (param.indexOf('bureau') != -1) {
            let bureau = parseInt(param.split('_')[1]);
            this.szGameRule.bureau = bureau;
            let costDiamond = 2;
            if (bureau == 10) {
                costDiamond = 4;
            }
            else if (bureau == 15) {
                costDiamond = 6;
            }
            else if (bureau == 20) {
                costDiamond = 8;
            }
            this.szGameRule.payDiamond = costDiamond;
		}
		else if(param.indexOf('member') != -1) {
			this.szGameRule.maxPlayerCount = parseInt(param.slice(6));
		}
		else if (param.indexOf('ROUND') != -1) {
			this.szGameRule.roundType = SZProto.roundType[param];
		}
		else if(['1-4', '3-12', '5-20'].indexOf(param) != -1) {
			let array = param.split('-');
			for (let i = 0; i < array.length; ++i) {
				array[i] = parseInt(array[i]);
			}
			this.szGameRule.maxScore = array.pop();
			this.szGameRule.addScores = array;
		}
		else if(param == 'jinren') {
			this.szGameRule.canEnter = event.isChecked;
		}
		else if(param == 'guanzhan') {
			this.szGameRule.canWatch = event.isChecked;
		}
		else if(param == 'cuopai') {
			this.szGameRule.cuopai = event.isChecked;
		}
		else if(param == 'tuoguan') {
			this.szGameRule.canTrust = event.isChecked;
		}
		else if(['NONE', 'MEN1', 'MEN2', 'MEN3'].indexOf(param) != -1) {
			this.szGameRule.gameFrameType = SZProto.gameType[param];
		}
		else if(param == 'yuyin') {
			this.szGameRule.yuyin = event.isChecked;
		}
		else if(param == 'fangzuobi') {
			this.szGameRule.fangzuobi = event.isChecked;
		}
		console.log('this.sgGameRule', this.szGameRule);
	},

	/*
	 * 麻将规则
	 */
	onMJRuleButtonClick: function (event, param) {
		console.log('onMJRuleButtonClick', param);
		if (param.indexOf('bureau') != -1) {
            let bureau = parseInt(param.split('_')[1]);
            this.znmjGameRule.bureau = bureau;
            let costDiamond = 4;
            if (bureau == 16) {
                costDiamond = 8;
            }
            this.znmjGameRule.payDiamond = costDiamond;
		}
		else if(param.indexOf('member') != -1) {
			this.znmjGameRule.maxPlayerCount = parseInt(param.slice(6));
		}
		else if(param == 'hongzhong4') {
			this.znmjGameRule.gameFrameType = MJProto.gameType.HONGZHONG4;
		}
		else if(param == 'hongzhong8') {
			this.znmjGameRule.gameFrameType = MJProto.gameType.HONGZHONG8;
		}
		else if(param.indexOf('ma') != -1) {
			this.znmjGameRule.ma = parseInt(param.slice(2));
		}
		else if(['tuo_30', 'tuo_60', 'tuo_120'].indexOf(param) != -1) {
			this.znmjGameRule.canTrust = true;
			this.znmjGameRule.trustTm = parseInt(param.slice(4));
		}
		else if(param == 'tuo_0') {
			this.znmjGameRule.canTrust = false;
			this.znmjGameRule.trustTm = 0;
		}
		else if(param == 'qidui') {
			this.znmjGameRule.qidui = event.isChecked;
		}
		else if(param == 'chunniunai') {
			this.znmjGameRule.chunniunai = event.isChecked;
		}
		console.log(this.znmjGameRule);
	},

	setPDKGameRule: function (gameRule) {
		this.pdkGameRule = gameRule;
		/* 局数 */
		let toggle = cc.find('bureauNumber/ToggleContainer/toggle1', this.ruleNode);
		if (this.pdkGameRule.bureau == 20) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle3', this.ruleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 人数 */
		toggle = cc.find('renshu/ToggleContainer/toggle1', this.ruleNode);
		if (this.pdkGameRule.maxPlayerCount == 3) {
			toggle = cc.find('renshu/ToggleContainer/toggle2', this.ruleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 玩法 */
		toggle = cc.find('wanfa/ToggleContainer1/toggle1', this.ruleNode);
		if (this.pdkGameRule.gameFrameType == PDKProto.gameType.CARDS15) {
			toggle = cc.find('wanfa/ToggleContainer1/toggle2', this.ruleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 显示牌数 */
		toggle = cc.find('wanfa/ToggleContainer2/toggle1', this.ruleNode);
		if (this.pdkGameRule.showCardsCount == false) {
			toggle = cc.find('wanfa/ToggleContainer2/toggle2', this.ruleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 高级 托管 */
		toggle = cc.find('gaoji/ToggleContainer/toggle0', this.ruleNode);
		if (this.pdkGameRule.canTrust != false) {
			if (this.pdkGameRule.trustTm == 30) {
				toggle = cc.find('gaoji/ToggleContainer/toggle1', this.ruleNode);
			}
			else if (this.pdkGameRule.trustTm == 60) {
				toggle = cc.find('gaoji/ToggleContainer/toggle2', this.ruleNode);
			}
			else if (this.pdkGameRule.trustTm == 120) {
				toggle = cc.find('gaoji/ToggleContainer/toggle3', this.ruleNode);
			}
			cc.find('gaoji/xiaoju', this.ruleNode).active = true;
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		cc.find('gaoji/xiaoju', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.xiaojuTrust;
		cc.find('gaoji/4dai2', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.fourTakeTwo;
		cc.find('gaoji/4dai3', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.fourTakeThree;
		cc.find('gaoji/3Azha', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.ThreeABomb;
		cc.find('gaoji/yuyin', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.yuyin;
		/* 拆炸弹 */
		toggle = cc.find('gaoji/ToggleContainer2/toggle1', this.ruleNode);
		if (this.pdkGameRule.chaizhadan) {
			toggle = cc.find('gaoji/ToggleContainer2/toggle2', this.ruleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		cc.find('gaoji/shuangbei', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.hongtao10;
		cc.find('gaoji/fangzuobi', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.fangzuobi;
		cc.find('gaoji/heitao', this.ruleNode).getComponent(cc.Toggle).isChecked = this.pdkGameRule.heitao3;
		cc.find('gaoji/baiwei', this.ruleNode).getComponent(cc.Toggle).isChecked = !this.pdkGameRule.baiwei;
	},

	setSZGameRule: function (gameRule) {
		this.szGameRule = gameRule;
		/* 局数 */
		let toggle = cc.find('bureauNumber/ToggleContainer/toggle1', this.szRuleNode);
		if (this.szGameRule.bureau == 10) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle2', this.szRuleNode);
		}
		else if (this.szGameRule.bureau == 15) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle3', this.szRuleNode);
		}
		else if (this.szGameRule.bureau == 20) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle4', this.szRuleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 人数 */
		toggle = cc.find('renshu/ToggleContainer/toggle1', this.szRuleNode);
		if (this.szGameRule.maxPlayerCount == 8) {
			toggle = cc.find('renshu/ToggleContainer/toggle2', this.szRuleNode);
		}
		else if (this.szGameRule.maxPlayerCount == 10) {
			toggle = cc.find('renshu/ToggleContainer/toggle3', this.szRuleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 下注分 */
		toggle = cc.find('difen/ToggleContainer/toggle1', this.szRuleNode);
		if (this.szGameRule.maxScore == 12) {
			toggle = cc.find('difen/ToggleContainer/toggle2', this.szRuleNode);
		}
		else if (this.szGameRule.maxScore == 20) {
			toggle = cc.find('difen/ToggleContainer/toggle3', this.szRuleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 轮数 */
		toggle = cc.find('lunshu/ToggleContainer/toggle1', this.szRuleNode);
		if (this.szGameRule.roundType == SZProto.roundType.ROUND15) {
			toggle = cc.find('lunshu/ToggleContainer/toggle2', this.szRuleNode);
		}
		else if (this.szGameRule.roundType == SZProto.roundType.ROUND20) {
			toggle = cc.find('lunshu/ToggleContainer/toggle3', this.szRuleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 玩法 */
		toggle = cc.find('wanfa/ToggleContainer/toggle0', this.szRuleNode);
		if (this.szGameRule.gameFrameType == SZProto.gameType.MEN1) {
			toggle = cc.find('wanfa/ToggleContainer/toggle1', this.szRuleNode);
		}
		else if (this.szGameRule.gameFrameType == SZProto.gameType.MEN2) {
			toggle = cc.find('wanfa/ToggleContainer/toggle2', this.szRuleNode);
		}
		else if (this.szGameRule.gameFrameType == SZProto.gameType.MEN3) {
			toggle = cc.find('wanfa/ToggleContainer/toggle3', this.szRuleNode);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		/* 高级 */
		cc.find('gaoji/cuopai', this.szRuleNode).getComponent(cc.Toggle).isChecked = this.szGameRule.cuopai;
		cc.find('gaoji/tuoguan', this.szRuleNode).getComponent(cc.Toggle).isChecked = this.szGameRule.canTrust;
		cc.find('gaoji/jinren', this.szRuleNode).getComponent(cc.Toggle).isChecked = this.szGameRule.canEnter;
		cc.find('gaoji/guanzhan', this.szRuleNode).getComponent(cc.Toggle).isChecked = this.szGameRule.canWatch;
		cc.find('gaoji/yuyin', this.szRuleNode).getComponent(cc.Toggle).isChecked = this.szGameRule.yuyin;
		cc.find('gaoji/fangzuobi', this.szRuleNode).getComponent(cc.Toggle).isChecked = this.szGameRule.fangzuobi;
	},

	setSGGameRule: function (gameRule) {
		this.sgGameRule = gameRule;
		/* 局数 */
		let content = cc.find('view/content', this.sgRuleNode);
		let toggle = cc.find('bureauNumber/ToggleContainer/toggle1', content);
		if (this.sgGameRule.bureau == 20) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle3', content);
		}
		else if (this.sgGameRule.bureau == 30) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle4', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 人数 */
		toggle = cc.find('renshu/ToggleContainer/toggle1', content);
		if (this.sgGameRule.maxPlayerCount == 8) {
			toggle = cc.find('renshu/ToggleContainer/toggle2', content);
		}
		else if (this.sgGameRule.maxPlayerCount == 10) {
			toggle = cc.find('renshu/ToggleContainer/toggle3', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 翻倍 */
		toggle = cc.find('scales/ToggleContainer/toggle1', content);
		if (this.sgGameRule.scaleType == SGProto.scaleType.BIG) {
			toggle = cc.find('scales/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 玩法 */
		toggle = cc.find('sendCardType/ToggleContainer/toggle3', content);
		if (this.sgGameRule.sendCardType == SGProto.sendCardType.MING2AN1) {
			toggle = cc.find('sendCardType/ToggleContainer/toggle1', content);
		}
		else if (this.sgGameRule.sendCardType == SGProto.sendCardType.MING1AN2) {
			toggle = cc.find('sendCardType/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 模式 */
		toggle = cc.find('gameType/ToggleContainer/toggle1', content);
		if (this.sgGameRule.gameFrameType == SGProto.gameType.DACHIXIAOZHUANG) {
			toggle = cc.find('gameType/ToggleContainer/toggle2', content);
		}
		else if (this.sgGameRule.gameFrameType == SGProto.gameType.BAWANGZHUANG) {
			toggle = cc.find('gameType/ToggleContainer/toggle3', content);
		}
		else if (this.sgGameRule.gameFrameType == SGProto.gameType.LUNZHUANG) {
			toggle = cc.find('gameType/ToggleContainer/toggle4', content);
		}
		else if (this.sgGameRule.gameFrameType == SGProto.gameType.SANGONGZHUANG) {
			toggle = cc.find('gameType/ToggleContainer/toggle5', content);
		}
		else if (this.sgGameRule.gameFrameType == SGProto.gameType.PAIDAZHUANG) {
			toggle = cc.find('gameType/ToggleContainer/toggle6', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 下注分 */
		toggle = cc.find('scores/ToggleContainer/toggle1', content);
		if (this.sgGameRule.canPourScores[0] == 1 && this.sgGameRule.canPourScores[1] == 3) {
			toggle = cc.find('scores/ToggleContainer/toggle2', content);
		}
		else if (this.sgGameRule.canPourScores[0] == 1 && this.sgGameRule.canPourScores[1] == 5) {
			toggle = cc.find('scores/ToggleContainer/toggle3', content);
		}
		else if (this.sgGameRule.canPourScores[0] == 2 && this.sgGameRule.canPourScores[1] == 10) {
			toggle = cc.find('scores/ToggleContainer/toggle4', content);
		}
		else if (this.sgGameRule.canPourScores[0] == 5 && this.sgGameRule.canPourScores[1] == 20) {
			toggle = cc.find('scores/ToggleContainer/toggle5', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		this.maxPourScoreEdit.string = ""+this.sgGameRule.maxCanPourGold;
		/* 高级 */
		cc.find('gaoji/cuopai', content).getComponent(cc.Toggle).isChecked = this.sgGameRule.cuopai;
		cc.find('gaoji/tuoguan', content).getComponent(cc.Toggle).isChecked = this.sgGameRule.canTrust;
		cc.find('gaoji/jinren', content).getComponent(cc.Toggle).isChecked = this.sgGameRule.canEnter;
		cc.find('gaoji/guanzhan', content).getComponent(cc.Toggle).isChecked = this.sgGameRule.canWatch;
		cc.find('gaoji/yuyin', content).getComponent(cc.Toggle).isChecked = this.sgGameRule.yuyin;
	},

	setNNGameRule: function (gameRule) {
		this.nnGameRule = gameRule;
		/* 局数 */
		let content = cc.find('view/content', this.nnRuleNode);
		let toggle = cc.find('bureauNumber/ToggleContainer/toggle1', content);
		if (this.nnGameRule.bureau == 20) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle3', content);
		}
		else if (this.nnGameRule.bureau == 30) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle4', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 人数 */
		toggle = cc.find('renshu/ToggleContainer/toggle1', content);
		if (this.nnGameRule.maxPlayerCount == 8) {
			toggle = cc.find('renshu/ToggleContainer/toggle2', content);
		}
		else if (this.nnGameRule.maxPlayerCount == 10) {
			toggle = cc.find('renshu/ToggleContainer/toggle3', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 推注 */
		toggle = cc.find('tuizhu/ToggleContainer/toggle1', content);
		if (this.nnGameRule.tuiScale.indexOf(20) != -1) {
			toggle = cc.find('tuizhu/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 模式 */
		toggle = cc.find('gameType/ToggleContainer/toggle1', content);
		if (this.nnGameRule.gameFrameType == NNProto.gameType.MINGPAIQZ) {
			toggle = cc.find('gameType/ToggleContainer/toggle2', content);
		}
		else if (this.nnGameRule.gameFrameType == NNProto.gameType.FANGZHU) {
			toggle = cc.find('gameType/ToggleContainer/toggle3', content);
		}
		else if (this.nnGameRule.gameFrameType == NNProto.gameType.TONGBI) {
			toggle = cc.find('gameType/ToggleContainer/toggle4', content);
		}
		else if (this.nnGameRule.gameFrameType == NNProto.gameType.ZHIYOUQZ) {
			toggle = cc.find('gameType/ToggleContainer/toggle5', content);
		}
		else if (this.nnGameRule.gameFrameType == NNProto.gameType.LUNZHUANG) {
			toggle = cc.find('gameType/ToggleContainer/toggle6', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 玩法 */
		toggle = cc.find('sendCardType/ToggleContainer/toggle3', content);
		if (this.nnGameRule.sendCardType == NNProto.sendCardType.MING3AN2) {
			toggle = cc.find('sendCardType/ToggleContainer/toggle1', content);
		}
		else if (this.nnGameRule.sendCardType == NNProto.sendCardType.MING4AN1) {
			toggle = cc.find('sendCardType/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 翻倍 */
		toggle = cc.find('scales/ToggleContainer/toggle1', content);
		if (this.nnGameRule.scaleType == NNProto.scaleType.BIG) {
			toggle = cc.find('scales/ToggleContainer/toggle2', content);
		}
		else if (this.nnGameRule.scaleType == NNProto.scaleType.DIANZI) {
			toggle = cc.find('scales/ToggleContainer/toggle3', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 特殊 */
		cc.find('other/rule/tonghuashun', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.TONGHUASHUN;
		cc.find('other/rule/yitiaolong', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.YITIAOLONG;
		cc.find('other/rule/zhadan', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.ZHADANNIU;
		cc.find('other/rule/wuxiaoniu', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.WUXIAONIU;
		cc.find('other/rule/huluniu', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.HULUNIU;
		cc.find('other/rule/wuhuaniu', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.WUHUANIU;
		cc.find('other/rule/tonghuaniu', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.TONGHUANIU;
		cc.find('other/rule/shunziniu', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cardsType.SHUNZINIU;
		cc.find('tuizhu/tuizhu', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.tuizhu;

		/* 高级 */
		cc.find('gaoji/cuopai', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.cuopai;
		cc.find('gaoji/jinren', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.canEnter;
		cc.find('gaoji/guanzhan', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.canWatch;
		cc.find('gaoji/yuyin', content).getComponent(cc.Toggle).isChecked = this.nnGameRule.yuyin;
		/* 托管 */
		toggle = cc.find('gaoji/ToggleContainer/toggle0', content);
		if (this.nnGameRule.canTrust != false) {
			if (this.nnGameRule.trustTm == 10) {
				toggle = cc.find('gaoji/ToggleContainer/toggle1', content);
			}
			else if (this.nnGameRule.trustTm == 15) {
				toggle = cc.find('gaoji/ToggleContainer/toggle2', content);
			}
			else if (this.nnGameRule.trustTm == 20) {
				toggle = cc.find('gaoji/ToggleContainer/toggle3', content);
			}
			else if (this.nnGameRule.trustTm == 30) {
				toggle = cc.find('gaoji/ToggleContainer/toggle4', content);
			}
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		if (this.nnGameRule.robBankLimit > 0) {
			this.nnRobBankEdit.string = ""+this.nnGameRule.robBankLimit;
		}
	},

	setDGNGameRule: function (gameRule) {
		this.dgnGameRule = gameRule;
		/* 局数 */
		let content = cc.find('view/content', this.dgnRuleNode);
		let toggle = cc.find('bureauNumber/ToggleContainer/toggle1', content);
		if (this.dgnGameRule.bureau == 20) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle3', content);
		}
		else if (this.dgnGameRule.bureau == 30) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle4', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		/* 人数 */
		toggle = cc.find('renshu/ToggleContainer/toggle1', content);
		if (this.dgnGameRule.maxPlayerCount == 8) {
			toggle = cc.find('renshu/ToggleContainer/toggle2', content);
		}
		else if (this.dgnGameRule.maxPlayerCount == 10) {
			toggle = cc.find('renshu/ToggleContainer/toggle3', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		/* 首庄大小 */
		var scoreToToggle = { 200: "toggle1", 400: "toggle2", 500: "toggle3", 1000: "toggle4", 100: "toggle5", 50: "toggle6", 4000: "toggle7", 2000: "toggle8", };
		for (let key in scoreToToggle) {
			cc.find("shouzhuang/ToggleContainer/"+scoreToToggle[key], content).getComponent(cc.Toggle).isChecked = (key == this.dgnGameRule.shouzhuang);
		}

		/* 首局底注 */
		toggle = cc.find('shouju/ToggleContainer/toggle1', content);
		if (this.dgnGameRule.firstBureauRate == 0.2) {
			toggle = cc.find('shouju/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		/* 非首局底注 */
		toggle = cc.find('shoujuhou/ToggleContainer/toggle1', content);
		if (this.dgnGameRule.bureauRate == 0.05) {
			toggle = cc.find('shoujuhou/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		/* 连庄模式 */
		toggle = cc.find('lianzhuangmoshi/ToggleContainer/toggle1', content);
		if (this.dgnGameRule.lianzhuangType == DGNProto.lianzhuangType.LUNZHUANG) {
			toggle = cc.find('lianzhuangmoshi/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		/* 连庄次数 */
		toggle = cc.find('lianzhuangshu/ToggleContainer/toggle1', content);
		if (this.dgnGameRule.lianzhuangCount == 2) {
			toggle = cc.find('lianzhuangshu/ToggleContainer/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;


		/* 翻倍 */
		toggle = cc.find('scales/ToggleContainer/toggle1', content);
		if (this.dgnGameRule.scaleType == DGNProto.scaleType.BIG) {
			toggle = cc.find('scales/ToggleContainer/toggle2', content);
		}
		else if (this.dgnGameRule.scaleType == DGNProto.scaleType.DIANZI) {
			toggle = cc.find('scales/ToggleContainer/toggle3', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		/* 特殊 */
		cc.find('other/rule/tonghuashun', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.TONGHUASHUN;
		cc.find('other/rule/yitiaolong', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.YITIAOLONG;
		cc.find('other/rule/zhadan', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.ZHADANNIU;
		cc.find('other/rule/wuxiaoniu', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.WUXIAONIU;
		cc.find('other/rule/huluniu', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.HULUNIU;
		cc.find('other/rule/wuhuaniu', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.WUHUANIU;
		cc.find('other/rule/tonghuaniu', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.TONGHUANIU;
		cc.find('other/rule/shunziniu', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cardsType.SHUNZINIU;

		/* 高级 */
		cc.find('gaoji/cuopai', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.cuopai;
		cc.find('gaoji/jinren', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.canEnter;
		cc.find('gaoji/guanzhan', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.canWatch;
		cc.find('gaoji/yuyin', content).getComponent(cc.Toggle).isChecked = this.dgnGameRule.yuyin;
		/* 托管 */
		toggle = cc.find('gaoji/ToggleContainer/toggle0', content);
		if (this.dgnGameRule.canTrust != false) {
			if (this.dgnGameRule.trustTm == 10) {
				toggle = cc.find('gaoji/ToggleContainer/toggle1', content);
			}
			else if (this.dgnGameRule.trustTm == 15) {
				toggle = cc.find('gaoji/ToggleContainer/toggle2', content);
			}
			else if (this.dgnGameRule.trustTm == 20) {
				toggle = cc.find('gaoji/ToggleContainer/toggle3', content);
			}
			else if (this.dgnGameRule.trustTm == 30) {
				toggle = cc.find('gaoji/ToggleContainer/toggle4', content);
			}
		}
		toggle.getComponent(cc.Toggle).isChecked = true;

		if (this.dgnGameRule.xiazhuangfen > 0) {
			this.nnXiazhuangfenEdit.string = ""+this.dgnGameRule.xiazhuangfen;
		}
	},

	setZNMJGameRule: function (gameRule) {
		this.znmjGameRule = gameRule;
		/* 局数 */
		let content = this.znmjRuleNode;
		let toggle = cc.find('bureauNumber/ToggleContainer/toggle1', content);
		if (this.znmjGameRule.bureau == 16) {
			toggle = cc.find('bureauNumber/ToggleContainer/toggle3', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 人数 */
		toggle = cc.find('renshu/ToggleContainer/toggle1', content);
		if (this.znmjGameRule.maxPlayerCount == 3) {
			toggle = cc.find('renshu/ToggleContainer/toggle2', content);
		}
		else if (this.znmjGameRule.maxPlayerCount == 4) {
			toggle = cc.find('renshu/ToggleContainer/toggle3', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 玩法 */
		toggle = cc.find('wanfa/ToggleContainer1/toggle1', content);
		if (this.znmjGameRule.gameFrameType == MJProto.gameType.HONGZHONG8) {
			toggle = cc.find('wanfa/ToggleContainer1/toggle2', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 扎马 */
		toggle = cc.find('zhama/ToggleContainer1/toggle1', content);
		if (this.znmjGameRule.ma == 4) {
			toggle = cc.find('zhama/ToggleContainer1/toggle2', content);
		}
		else if (this.znmjGameRule.ma == 6) {
			toggle = cc.find('zhama/ToggleContainer1/toggle3', content);
		}
		else if (this.znmjGameRule.ma == 8) {
			toggle = cc.find('zhama/ToggleContainer1/toggle4', content);
		} else if (this.znmjGameRule.ma == 1){
            toggle = cc.find('zhama/ToggleContainer1/toggle5', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 托管 */
		toggle = cc.find('tuoguan/ToggleContainer1/toggle1', content);
		if (this.znmjGameRule.trustTm == 30) {
			toggle = cc.find('tuoguan/ToggleContainer1/toggle2', content);
		}
		else if (this.znmjGameRule.trustTm == 60) {
			toggle = cc.find('tuoguan/ToggleContainer1/toggle3', content);
		}
		else if (this.znmjGameRule.trustTm == 120) {
			toggle = cc.find('tuoguan/ToggleContainer1/toggle4', content);
		}
		toggle.getComponent(cc.Toggle).isChecked = true;
		/* 高级 */
		if (this.znmjGameRule.qidui) {
			toggle = cc.find('gaoji/qidui', content).getComponent(cc.Toggle);
			toggle.isChecked = true;
		}
		if (this.znmjGameRule.chunniunai) {
			toggle = cc.find('gaoji/chunniunai', content).getComponent(cc.Toggle);
			toggle.isChecked = true;
		}
	},
});
