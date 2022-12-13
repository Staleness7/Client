var RoomProto         = require('../API/RoomProto');
var RoomMessageRouter = 'game.gameHandler.roomMessageNotify';

cc.Class({
	extends: cc.Component,
	properties: {
	},

	onLoad: function () {
		Global.MessageCallback.addListener('RoomMessagePush', this);
		this.refrush(this.dialogParameters);
	},

	refrush: function (data) {
		console.log('data', data);
		this.tm = data.tm;
		let item = cc.find('item1', this.node);
		let layout = cc.find('Layout', this.node);
		for (let node of layout.children) {
			node.destroy();
		}
		for (let i = 0; i < data.nameArr.length; ++i) {
			if (data.nameArr[i] == null) {
				continue;
			}
			let node = cc.instantiate(item);
			node.parent = layout;
			node.active = true;
			node.y = 0;

			cc.find('name', node).getComponent(cc.Label).string = data.nameArr[i] || '';
			if (data.chairIDArr[i] == null) {
				cc.find('jiesan', node).active = false;
			}
			else if (data.chairIDArr[i] == true) {
				cc.find('jiesan', node).active = true;
			}
			else {
				cc.find('jiesan', node).active = false;
				Global.DialogManager.destroyDialog('Game/DismissNode');
				return;
			}
			cc.find('online', node).getComponent(cc.Label).string = data.onlineArr[i]? '在线':'离线';
			Global.CCHelper.updateSpriteFrame(data.avatarArr[i], cc.find('head', node).getComponent(cc.Sprite));
		}
		if (data.chairIDArr[this.dialogParameters.myChairID] == true) {
			cc.find('jujue', this.node).active = false;
			cc.find('tongyi', this.node).active = false;
		}
		this.scheduleOnce(() => {
			if (layout.width >= 500) {
				cc.find('bg', this.node).width = layout.width+100;
			}
		}, 0);
	},

	messageCallbackHandler: function(router, msg) {
		if (router === 'RoomMessagePush') {
			if(msg.type === RoomProto.ASK_FOR_DISMISS_PUSH) {
				this.refrush(msg.data);
			}
			else if(msg.type === RoomProto.ROOM_DISMISS_PUSH) {
				Global.DialogManager.destroyDialog('Game/DismissNode');
			}
		}
	},

	onButtonClick: function (event, param) {
		if (param == 'tongyi') {
			Global.NetworkManager.notify(RoomMessageRouter, RoomProto.getAskForDismissNotifyData(true));
		}
		else if (param == 'jujue') {
			Global.NetworkManager.notify(RoomMessageRouter, RoomProto.getAskForDismissNotifyData(false));
		}
	},

	onDestroy: function () {
		Global.MessageCallback.removeListener('RoomMessagePush', this);
	},

	update: function (dt) {
		this.tm -= dt;
		let label = cc.find('second', this.node).getComponent(cc.Label);
		label.string = Math.floor(this.tm)+'秒';
		if (this.tm < 0) {
			Global.DialogManager.destroyDialog('Game/DismissNode');
		}
	},
});
