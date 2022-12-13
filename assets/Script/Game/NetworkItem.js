var enumeration = require("../Constant/enumeration");
cc.Class({
	extends: cc.Component,
	properties: {
		timeLabel: cc.Label,
		netContent: cc.Node,
	},

	onLoad: function () {
		this.node.active = false;
		return;
		this.schedule(() => {
			Global.API.hall.getNetworkDelay((data) => {
				if (this.netContent) {
					if (data.delayTime <= enumeration.networkState.BEST) {
						this.netContent.width = 34;
					}
					else if (data.delayTime <= enumeration.networkState.GOOD) {
						this.netContent.width = 29;
					}
					else if (data.delayTime <= enumeration.networkState.NORMAL) {
						this.netContent.width = 23;
					}
					else if (data.delayTime <= enumeration.networkState.BAD) {
						Global.DialogManager.addPopDialog("当前网络状态差！");
						this.netContent.width = 10;
					}
					else {
						Global.DialogManager.addPopDialog("当前网络状态极差！");
						this.netContent.width = 5;
					}
				}
			});
		}, 10);

		this.schedule(() => {
			let curData = new Date();
			let hour = curData.getHours();
			let min = curData.getMinutes();
			if (hour < 10) {
				hour = '0'+hour;
			}
			if (min < 10) {
				min = '0'+min;
			}
			if (this.timeLabel) {
				this.timeLabel.string = hour+':'+min;
			}
		}, 1);
	},
});
