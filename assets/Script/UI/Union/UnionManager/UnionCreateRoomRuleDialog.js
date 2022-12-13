cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        this.gameType = Global.Enum.gameType.PDK;

        this.callback = this.dialogParameters.cb;
    },

	onGameTypeClick: function (event, param) {
		if (param === 'PDK') {
			this.gameType = Global.Enum.gameType.PDK;
		}
		else if (param === 'NN') {
			this.gameType = Global.Enum.gameType.NN;
		}
		else if (param === 'SG') {
			this.gameType = Global.Enum.gameType.SG;
		}
		else if (param === 'SZ') {
			this.gameType = Global.Enum.gameType.SZ;
		}
	},

    onBtnClk: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'createRoom':
            	let gameRule = {
            		maxPlayerCount: 6,
					bureau: 8
				};
                this.callback(this.gameType, gameRule);
                Global.DialogManager.destroyDialog(this);
                break;
        }
    }
});
