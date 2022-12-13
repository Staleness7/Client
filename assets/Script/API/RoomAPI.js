let api = module.exports;

api.roomMessageNotify = function (data){
    let router = 'game.gameHandler.roomMessageNotify';
    Global.NetworkManager.notify(router, data);

};

api.gameMessageNotify = function (data){
    let router = 'game.gameHandler.gameMessageNotify';
    Global.NetworkManager.notify(router, data);

};
