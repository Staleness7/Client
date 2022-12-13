cc.Class({
	extends: cc.Component,
	properties: {
		hongBaoNode: cc.Node,
		animationNode: cc.Node,
        animationCircleNode:  cc.Node,
        notHongBaoNode: cc.Node,
        score1Label: cc.Label,
        score2Label: cc.Label,
        lizi1: cc.Node,
        lizi2: cc.Node,
	},

	start () {
		this.hongBaoList = [1, 2, 8, 18, 88, 888];
		for (let i = 1; i < 8; ++i) {
			let ran1 = Math.floor(Math.random()*6);
			let ran2 = Math.floor(Math.random()*6);
			let tmp = this.hongBaoList[ran1];
			this.hongBaoList[ran1] = this.hongBaoList[ran2];
			this.hongBaoList[ran2] = tmp;
		}
		for (let i = 1; i <= 6; ++i) {
			let node = cc.find("choose/Bao"+i+"/baoD1", this.node);
			let action = cc.sequence([cc.scaleTo(0.8, 1.1, 0.95), cc.scaleTo(0.8, 0.9, 1.05)]);
			node.runAction(cc.repeatForever(action));
		}
	},

	onChooseHongbao (event, param) {
		if (this.choosed) { return; }
        Global.AudioManager.playCommonSoundClickButton();
		this.choosed = true;
		let index = this.hongBaoList.indexOf(this.dialogParameters.score);
		this.hongBaoList.splice(index, 1);
		this.hongBaoList.splice(param-1, 0, this.dialogParameters.score);
		for (let i = 1; i <= 6; ++i) {
			let node = cc.find("choose/Bao"+i+"/baoD1", this.node);
			node.stopAllActions();
			node.active = false;
			cc.find("choose/Bao"+i+"/open", this.node).active = true;
			let score1 = cc.find("choose/Bao"+i+"/open/score1", this.node);
			score1.getComponent(cc.Label).string = this.hongBaoList[i-1];
			if (this.hongBaoList[i-1] > 0) {
				let score = cc.find("choose/Bao"+i+"/open/score", this.node);
				score.getComponent(cc.Label).string = this.hongBaoList[i-1];
				score.active = true;
			}
			else {
				let over = cc.find("choose/Bao"+i+"/open/over", this.node);
				over.active = true;
			}
		}
		let hongbaoNode = cc.find("choose/baoD1", this.node);
		let chooseNode = cc.find("choose/Bao"+param, this.node);
		hongbaoNode.setPosition(chooseNode.getPosition());
		hongbaoNode.active = true;
		hongbaoNode.runAction(cc.moveTo(0.3, cc.v2(0,0)));
		hongbaoNode.runAction(cc.scaleTo(0.3, 4, 4));
		this.scheduleOnce(() => {
			hongbaoNode.active = false;
			let score = this.dialogParameters.score;
			this.startAnimation(score);
			let action = cc.sequence([cc.moveBy(0.2, 0, 20), cc.moveBy(0.2, 0, -20)]);
			chooseNode.runAction(cc.repeatForever(action));
		}, 0.3);
	},

    startAnimation(score){
        this.animationNode.active = true;
        this.animationNode.opacity = 255;
        this.animationNode.scale = 1;
        this.animationCircleNode.active = true;
        this.animationCircleNode.opacity = 150;
        this.animationCircleNode.scale = 1;

        let action1 = cc.scaleTo(0.5, 6);
        action1.easing(cc.easeOut(3));
        this.animationNode.runAction(cc.sequence([action1, cc.fadeOut(0.3)]));

        let action2 = cc.scaleTo(0.6, 4);
        action2.easing(cc.easeOut(3));
        this.animationCircleNode.runAction(cc.sequence([cc.delayTime(0.1), action2, cc.fadeOut(0.2)]));

        this.lizi1.active = true;

        this.scheduleOnce(function () {
			this.hongBaoNode.active = true;
            this.hongBaoNode.stopAllActions();
            this.hongBaoNode.runAction(cc.scaleTo(0.3, 1));
            this.score2Label.string = score.toString();
            this.score1Label.string = score.toString();
            if (score === 0){
                this.score1Label.string = "";
                this.notHongBaoNode.active = true;
            } else {
                this.lizi2.active = true;
            }
			cc.find("btn_close", this.node).active = true;
        }, 0.3);
    },

	onClose () {
        Global.AudioManager.playCommonSoundClickButton();
		if (this.hongBaoNode.active) {
			this.hongBaoNode.active = false;
		}
		else {
			Global.DialogManager.destroyDialog("Game/GameHongBaoDialog");
		}
	},
});
