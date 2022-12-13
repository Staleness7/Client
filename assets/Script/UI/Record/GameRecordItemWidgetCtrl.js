cc.Class({
    extends: cc.Component,

    properties: {
        gameTimeLabel: cc.Label,
        gameName: cc.Label,
        roomID: cc.Label,
        avatar: cc.Sprite,
        winScore: cc.Label,
    },

    start () {

    },

    initWidget(gameRecord, type){
        if (gameRecord.gameType === Global.Enum.gameType.NN){
            this.gameName.string = "牛牛";
        } else if (gameRecord.gameType === Global.Enum.gameType.SZ){
            this.gameName.string = "赢三张";
        } else if (gameRecord.gameType === Global.Enum.gameType.PDK){
            this.gameName.string = "跑得快";
        } else if (gameRecord.gameType === Global.Enum.gameType.SG){
            this.gameName.string = "三公";
        } else if (gameRecord.gameType === Global.Enum.gameType.ZNMJ){
            this.gameName.string = "红中麻将";
        } else if (gameRecord.gameType === Global.Enum.gameType.DGN){
            this.gameName.string = "斗公牛";
        }

        this.gameTimeLabel.string = "时间：" + new Date(gameRecord.createTime).format("yy-MM-dd hh:mm:ss");
        this.roomID.string = "房号:" + gameRecord.roomID;

        let bigWinScore = 0;
        for (let i = 0; i < gameRecord.userList.length; ++i){
            if (gameRecord.userList[i].score > bigWinScore){
                bigWinScore = gameRecord.userList[i].score;
            }
        }
        let bigWinUidArr = [];
        let bigWinUser = null;
        for (let i = 0; i <gameRecord.userList.length; ++i){
            if (gameRecord.userList[i].score === bigWinScore){
                bigWinUidArr.push(gameRecord.userList[i].uid);
                if (!bigWinUser) bigWinUser = gameRecord.userList[i];
            }
        }
		if (bigWinUser) {
			Global.CCHelper.updateSpriteFrame(bigWinUser.avatar, this.avatar);
			this.winScore.string = bigWinUser.score;
		}

        this.gameRecord = gameRecord;
        this.bigWinUidArr = bigWinUidArr;
        this.type = type;
    },

    onBtnClick(){
        Global.DialogManager.createDialog("UI/Record/GameRecordDetailDialog", {
            gameRecord: this.gameRecord,
            bigWinUidArr: this.bigWinUidArr
        });
    }
});
