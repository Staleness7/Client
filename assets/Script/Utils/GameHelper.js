let exp = module.exports = {};

exp.enterGame = function (gameType, cb) {
    let gameList = Global.Constant.gameDialogList;
    for (let i = 0; i < gameList.length; ++i){
        let gameInfo = gameList[i];
        if (gameInfo.gameType === gameType){
            Global.CCHelper.loadRes(gameInfo.loadDirArr, function () {
                Global.DialogManager.createDialog(gameInfo.gameDialog, null, function() {
                    Global.DialogManager.removeLoadingCircle();
                    Global.Utils.invokeCallback(cb, null, gameInfo);
                });
            });
            return;
        }
    }
    cc.error("进入游戏错误，游戏类型未找到 gameType =" + gameType);
    Global.Utils.invokeCallback(cb, true);
};

exp.getGameRootPath = function (gameTypeID) {
    let gameTypeInfo = Global.GameModel.getGameInfoByGameTypeID(gameTypeID);
    if (!gameTypeInfo) return;
    let dialogRes = "Game/" + gameTypeInfo["clientSink"];
    return dialogRes.slice(0, dialogRes.lastIndexOf('/'));
};

exp.formatGoldString = function (gold) {
    return parseFloat(gold.toFixed(2)).toString();
};

