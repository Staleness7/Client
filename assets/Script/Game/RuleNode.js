cc.Class({
	extends: cc.Component,
	properties: {
	},

	onLoad: function () {
		this.addRule(this.dialogParameters);
	},

	addRule: function (rule) {
		console.log('rule', rule);
		let item = cc.find('item', this.node);
		let nodeArray = [];
		for (let key in rule) {
			let node = cc.instantiate(item);
			node.active = true;
			node.parent = cc.find('ScrollView/view/content', this.node);
			cc.find('name', node).getComponent(cc.Label).string = key;
			cc.find('msg', node).getComponent(cc.Label).string = rule[key];
			nodeArray.push(node);
		}
		this.scheduleOnce(() => {
			for (let node of nodeArray) {
				let name = cc.find('name', node);
				let msg = cc.find('msg', node);
				msg.x = name.x+name.width;
				node.height = cc.find('msg', node).height;
			}
			// for (let node of cc.find('ScrollView/view/content', this.node).children) {
			// }
		}, 0);
	},

	onCloseClick: function () {
		Global.DialogManager.destroyDialog('Game/RuleNode');
	},
});
