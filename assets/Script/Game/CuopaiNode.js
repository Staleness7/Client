cc.Class({
	extends: cc.Component,
	properties: {

	},

	onLoad: function () {
		this.cardShowed = false;
		this.scrollViewBg = cc.find('ScrollViewBg', this.node);
		this.scrollViewCard = cc.find('ScrollViewCard', this.node);
		this.bgContent = cc.find('ScrollViewBg/view/content', this.node);
		this.cardContent = cc.find('ScrollViewCard/view/content', this.node);
		this.scrollViewBgPos = this.scrollViewBg.getPosition();
		this.scrollViewCardPos = this.scrollViewCard.getPosition();
		this.bgContentPos = this.bgContent.getPosition();
		this.cardContentPos = this.cardContent.getPosition();
		Global.MessageCallback.addListener('UpdateGameCardBg', this);
		this.updateCardsBgSprite();
	},

	init: function (card, cb) {
		this.card = card;
		this.cb = cb;
		let touchNode = cc.find('TouchArea', this.node);
		touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		touchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		touchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
		touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
		let card1 = cc.find('Card1', this.cardContent);
		let card2 = cc.find('Card2', this.cardContent);
		Global.CCHelper.updateSpriteFrame('Game/pokers/'+this.card, card1.getComponent(cc.Sprite));
		Global.CCHelper.updateSpriteFrame('Game/pokers/'+this.card, card2.getComponent(cc.Sprite));
		this.scheduleOnce(() => {
			if (!this.cardShowed) {
				this.showCard(); 
			}
		}, 8);
	},

	messageCallbackHandler: function(router, msg) {
		if(router === 'UpdateGameCardBg') {
			this.updateCardsBgSprite();
		}
	},

	updateCardsBgSprite: function () {
		let cardbg = cc.sys.localStorage.getItem('cardBg');
		let url = 'Game/Common/card_back_0';
		if (cardbg == 'cardBg1') {
			url = 'Game/Common/card_back_0';
		}
		else if (cardbg == 'cardBg2') {
			url = 'Game/Common/card_back_1';
		}
		else if (cardbg == 'cardBg3') {
			url = 'Game/Common/card_back_2';
		}
		else if (cardbg == 'cardBg4') {
			url = 'Game/Common/card_back_3';
		}
		let node = cc.find('ScrollViewBg/view/content/Card', this.node);
		if (node) {
			Global.CCHelper.updateSpriteFrame(url, node.getComponent(cc.Sprite));
		}
	},

	onTouchMove: function (event, param) {
		if (this.cardShowed) {
			return;
		}
		let offy = event.touch._point.y-event.touch._startPoint.y;
		if (offy >= this.scrollViewBg.height) {
			offy = this.scrollViewBg.height;
		}
		else if (offy <= -this.scrollViewBg.height) {
			offy = -this.scrollViewBg.height;
		}
		this.scrollViewBg.y = this.scrollViewBgPos.y+offy;
		this.bgContent.y = this.bgContentPos.y-offy;
		this.scrollViewCard.y = this.scrollViewCardPos.y+offy;
		this.cardContent.y = this.cardContentPos.y+offy;  
	},

	onTouchEnd: function (event, param) {
		if (this.cardShowed) { return; }
		this.scrollViewBg.setPosition(this.scrollViewBgPos);
		this.scrollViewCard.setPosition(this.scrollViewCardPos);
		this.bgContent.setPosition(this.bgContentPos);
		this.cardContent.setPosition(this.cardContentPos);
		let offy = event.touch._point.y-event.touch._startPoint.y;
		if (Math.abs(offy) >= this.scrollViewBg.height/2) {
			this.showCard();
		}
	},

	showCard: function () {
		this.cardShowed = true;
		let touchNode = cc.find('TouchArea', this.node);
		Global.CCHelper.updateSpriteFrame('Game/pokers/'+this.card, touchNode.getComponent(cc.Sprite));
		touchNode.width = this.bgContent.height;
		touchNode.height = this.bgContent.width;
		touchNode.rotation = 90;
		this.scrollViewBg.destroy();
		this.scrollViewCard.destroy();
		if (this.cb) {
			this.cb();
		}
		this.scheduleOnce(() => {
			this.node.destroy();
		}, 2);
	},

	onDestroy: function () {
		if (!this.cardShowed && this.cb) {
			this.cb();
		}
		Global.MessageCallback.removeListener('UpdateGameCardBg', this);
	},
});
