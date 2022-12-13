cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

	clearAnimalState: function() {
		for(var i = 1; i <= 12; ++i) {
			var name = 'anim_xs_ui_item';
			if(i <= 9) {
				name += '0' + i;
			} else {
				name += i;
			}
			var node = this.node.getChildByName(name);
			node.setPosition(cc.v2(0, 0));
			node.active = false;
		}
		this.unscheduleAllCallbacks();
	},

    playAnimal: function (index) {
		this.clearAnimalState();
		var name = 'anim_xs_ui_item';
		var animalUrl = 'anim_xs_ui_item';
		if(index <= 9) {
			name += '0' + index;
			animalUrl += '0' + index;
		} else {
			name +=  index;
			animalUrl +=  index;
		}
		var node = this.node.getChildByName(name);
		node.setPosition(cc.v2(0, 0));
		node.active = true;
		var animalCtl = node.getComponent(cc.Animation);
		var state = animalCtl.play(animalUrl);
		this.scheduleOnce(function() {
			/* node.active = false; */
			this.node.destroy();
		}, state.duration);
		var url = this.getSoundUrlByIndex(index);
		Global.AudioManager.playSound(url); 
		return state;
    },

	getSoundUrlByIndex: function(index) {
		var urlArr = [
			'Chat/ChatAnimSound/qinzui',
			'Chat/ChatAnimSound/diulei',
			'Chat/ChatAnimSound/rengfanqie',
			'Chat/ChatAnimSound/damuzhi',
			'Chat/ChatAnimSound/pengbei',
			'Chat/ChatAnimSound/songhua',
			'Chat/ChatAnimSound/dahuoji',
			'Chat/ChatAnimSound/songzhuanshi',
			'Chat/ChatAnimSound/rengqian',
			'Chat/ChatAnimSound/songguozhi',
			'Chat/ChatAnimSound/daochiti',
			'Chat/ChatAnimSound/paizhuan',
		];
		return urlArr[index-1];
	}
});

