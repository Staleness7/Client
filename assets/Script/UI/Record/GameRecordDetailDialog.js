let HallAPI = require('../../API/HallAPI');

cc.Class({
    extends: cc.Component,

    properties: {
        roomID: cc.Label,
        timeLabel: cc.Label,
        recordItem: cc.Prefab,
        listContent: cc.Node,
        gameName: cc.Label,
		btnVideo: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let gameRecord = this.dialogParameters.gameRecord;
        let bigWinUidArr = this.dialogParameters.bigWinUidArr;

        for (let i = 0; i < 10; ++i){
            let node = cc.instantiate(this.recordItem);
            let ctrl = node.getComponent("UserScoreItemCtrl");
            ctrl.initWidget(gameRecord.userList[i], bigWinUidArr);
            node.parent = this.listContent;
        }

        if (gameRecord.gameType === Global.Enum.gameType.NN){
            this.gameName.string = "牛牛";
        } else if (gameRecord.gameType === Global.Enum.gameType.DGN){
            this.gameName.string = "斗公牛";
        } else if (gameRecord.gameType === Global.Enum.gameType.SZ){
            this.gameName.string = "赢三张";
        } else if (gameRecord.gameType === Global.Enum.gameType.PDK){
            this.gameName.string = "跑得快";
        } else if (gameRecord.gameType === Global.Enum.gameType.SG){
            this.gameName.string = "三公";
        } else if (gameRecord.gameType === Global.Enum.gameType.ZNMJ){
            this.gameName.string = "红中麻将";
			this.btnVideo.active = true;
        }
        this.timeLabel.string = "时间：" + new Date(gameRecord.createTime).format("yy-MM-dd hh:mm:ss");
        this.roomID.string = "房号:" + gameRecord.roomID;

        this.gameRecord = gameRecord;
    },

    onBtnClick: function (event, param) {
        Global.AudioManager.playCommonSoundClickButton();
        switch (param) {
            case 'close':
                Global.DialogManager.destroyDialog(this);
                break;
            case 'review':
                if (this.gameRecord.gameType === Global.Enum.gameType.NN){
                    Global.DialogManager.createDialog('Game/Niuniu/NNReview', {list: JSON.parse(this.gameRecord.detail)});
                }else if (this.gameRecord.gameType === Global.Enum.gameType.DGN){
                    Global.DialogManager.createDialog('Game/Dougongniu/DGNReview', {list: JSON.parse(this.gameRecord.detail)});
                }else if (this.gameRecord.gameType === Global.Enum.gameType.SG){
                    Global.DialogManager.createDialog('Game/Sangong/SGReview', {list: JSON.parse(this.gameRecord.detail)});
                }else if (this.gameRecord.gameType === Global.Enum.gameType.SZ){
                    Global.DialogManager.createDialog('Game/Sanzhang/SZReview', {list: JSON.parse(this.gameRecord.detail)});
                }else if (this.gameRecord.gameType === Global.Enum.gameType.PDK){
                    Global.DialogManager.createDialog('UI/Record/PDKGameRecordDialog', {list: JSON.parse(this.gameRecord.detail)});
                }else if (this.gameRecord.gameType === Global.Enum.gameType.ZNMJ){
					if (! this.recordData) {
						HallAPI.getVideoRecordRequest(this.gameRecord.videoRecordID, (data) => {
							this.recordData = data.msg.gameVideoRecordData.detail;
							Global.DialogManager.createDialog('Game/Majiang/MJReviewResult', { reviewRecord: JSON.parse(this.recordData), });
						});
					}
					else {
						Global.DialogManager.createDialog('Game/Majiang/MJReviewResult', { reviewRecord: JSON.parse(this.recordData), });
					}
				}
				break;
			case 'video':
					if (! this.recordData) {
						HallAPI.getVideoRecordRequest(this.gameRecord.videoRecordID, (data) => {
							this.recordData = data.msg.gameVideoRecordData.detail;
							Global.DialogManager.createDialog('Game/Majiang/MJReviewDialog', {reviewRecord: JSON.parse(this.recordData)});
						});
					}
					else {
						Global.DialogManager.createDialog('Game/Majiang/MJReviewDialog', {reviewRecord: JSON.parse(this.recordData)});
					}
				break;
		}
	}
});
