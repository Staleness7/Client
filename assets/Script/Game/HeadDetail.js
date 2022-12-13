let RoomMessageRouter = 'game.gameHandler.roomMessageNotify';
let RoomProto = require('../API/RoomProto');

cc.Class({
	extends: cc.Component,
	properties: {
		
	},

	onLoad: function () {
		let content = cc.find('ScrollView/view/content', this.node);
		let layout = content.getComponent(cc.Layout);
		let fromChairID = this.dialogParameters.fromChairID;
		let toChairID = this.dialogParameters.toChairID;
		for (let node of content.children) {
			let param = parseInt(node.name.slice(4));
			if (fromChairID == toChairID) { /* 点击自身头像 */ 
				node.active = (param >= 21);
				layout.paddingLeft = 18;
				layout.paddingRight = 0;
				layout.spacingX = 30;
			}
			else {
				node.active = (param <= 11);
				layout.paddingLeft = 0;
				layout.paddingRight = 0;
				layout.spacingX = 0;
			}
			node.on(cc.Node.EventType.TOUCH_END, this.onBtnClick.bind(this, param), this);
		}

		Global.CCHelper.updateSpriteFrame(this.dialogParameters.avatar, cc.find('head', this.node).getComponent(cc.Sprite));
		cc.find('name', this.node).getComponent(cc.Label).string = '昵称:'+this.dialogParameters.name;
		cc.find('id', this.node).getComponent(cc.Label).string = 'ID:'+this.dialogParameters.id;
		cc.find('ip', this.node).getComponent(cc.Label).string = 'IP:'+(this.dialogParameters.ip? this.dialogParameters.ip:'未知');
		cc.find('adr', this.node).getComponent(cc.Label).string = this.dialogParameters.location || '未知';
		cc.find('goldbg/gold', this.node).getComponent(cc.Label).string = Math.floor(this.dialogParameters.gold);
	},

	onBtnClick: function (param) {
		let fromChairID = this.dialogParameters.fromChairID;
		let toChairID = this.dialogParameters.toChairID;
		Global.NetworkManager.notify(RoomMessageRouter, RoomProto.userChatNotify(toChairID, param));
	},

	onClose: function () {
		Global.DialogManager.destroyDialog('Chat/HeadDetail');
	},
});
