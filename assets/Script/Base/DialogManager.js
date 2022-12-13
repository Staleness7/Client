let DialogManager = module.exports = {};

DialogManager.init = function (rootNode) {
    this.rootNode = rootNode;
    // 创建dialog node
    this.dialogNode = this.rootNode.getChildByName("dialogNode");
    this.dialogNode.width  = rootNode.width ;
    this.dialogNode.height  = rootNode.height ;
    this.frontNode = this.rootNode.getChildByName("frontNode");
    this.frontNode.width  = rootNode.width ;
    this.frontNode.height  = rootNode.height ;

    this.loadedDialogPrefabs = {};
    this.createdDialogs = {};

    this.loadingCircleDialog = this.frontNode.getChildByName("LoadingCircleDialog").getComponent('LoadingCircleDialog');
    this.popDialog = this.frontNode.getChildByName("PopDialog").getComponent('PopDialog');
    this.tipDialog = this.frontNode.getChildByName("TipDialog").getComponent('TipDialog');

    Global.MessageCallback.addListener("DesignResolutionChanged", this);
};

DialogManager.messageCallbackHandler = function (route, msg) {
    if (route === "DesignResolutionChanged"){
        DialogManager.updateDialogNodeSize(msg);
    }
};

DialogManager.updateDialogNodeSize = function (size) {
    this.dialogNode.width  = size.width ;
    this.dialogNode.height  = size.height ;

    this.frontNode.width  = size.width ;
    this.frontNode.height  = size.height ;
};

/**
 * 创建dialog
 * @param dialogRes dialog种类，必须与prefab和dialog对应的管理js脚本名字相同
 * @param params 创建dialog需要传入的参数
 * @param cb 创建完成的会调
 * @param dialogKey 设置特殊dialogKey，一个界面需要多次创建时所用
 */
DialogManager.createDialog = function (dialogRes, params, cb, dialogKey) {
    console.log('create dialog', dialogRes);
    let fileName = dialogRes;
    let arr = dialogRes.split('/');
    let dialogType = arr[arr.length-1];
    dialogKey = dialogKey || dialogRes;
    // 验证数据
    if (!dialogRes){
        cc.error('Create Dialog failed: dialog type is null');
        Global.Utils.invokeCallback(cb, Global.Code.FAIL);
        return;
    }
    let createdDialogs = this.createdDialogs;
    // 判定是否已创建
    let createDialog = createdDialogs[dialogKey] || null;
    if (!!createDialog){
        cc.error('Create dialog is exist');
        createDialog.zIndex += 5;
        Global.Utils.invokeCallback(cb, null, createDialog);
    }
    else{
        // 加载过则直接创建
        let loadedDialogPrefabs = this.loadedDialogPrefabs;
        if (!!loadedDialogPrefabs[dialogRes]){
            createDialog = cc.instantiate(loadedDialogPrefabs[dialogRes]);
            createdDialogs[dialogKey] = createDialog;
            createDialog.getComponent(dialogType).dialogParameters = params || {};
            createDialog.getComponent(dialogType).isDestroy = false;
            createDialog.parent = this.dialogNode;
            Global.Utils.invokeCallback(cb, null, createDialog);
        }else{
            cc.loader.loadRes(fileName, function(err, data){
                if (!!err){cc.error(err);
                    Global.Utils.invokeCallback(cb, err);
                }
                else{
                    loadedDialogPrefabs[dialogRes] = data;
                    createDialog = cc.instantiate(data);
                    createdDialogs[dialogKey] = createDialog;
                    createDialog.getComponent(dialogType).dialogParameters = params || {};
                    createDialog.getComponent(dialogType).isDestroy = false;
                    createDialog.parent = this.dialogNode;
                    Global.Utils.invokeCallback(cb, null, createDialog);
                }
            }.bind(this));
        }
    }
};

DialogManager.isDialogExit = function(dialogRes) {
    return !!this.createdDialogs[dialogRes];
};

/**
 * 将dialog添加进dialogManager
 * @param dialogType dialog类型
 * @param dialog dialog节点
 */
DialogManager.addDialogToManager = function (dialogType, dialog) {
    this.createdDialogs[dialogType] = this.createdDialogs[dialogType] || dialog;
};

/**
 * 删除dialog
 * @param dialogRes 删除的dialog类型
 * @param isClearPrefabs 是否清除dialog对应的prefab
 */
DialogManager.destroyDialog = function (dialogRes, isClearPrefabs) {
    isClearPrefabs = isClearPrefabs || false;
    let createdDialogs = this.createdDialogs;
    let dialog = null;
    let dialogController = null;
    if (typeof (dialogRes) === 'object'){
        dialog = dialogRes.node;
        dialogController = dialogRes;

        for (let key in createdDialogs){
            if (createdDialogs.hasOwnProperty(key)){
                if (createdDialogs[key] === dialog){
                    dialogRes = key;
                    break;
                }
            }
        }
    } else{
        dialog = createdDialogs[dialogRes] || null;

        let arr = dialogRes.split('/');
        let dialogType = arr[arr.length-1];

		if(dialog) {
			dialogController = dialog.getComponent(dialogType);
		}
    }
    if (!dialog){
        cc.error('destroy dialog not exist:' + dialogRes);
    }
    else{
        let dialogActionWidgetCtrl = dialog.getComponent("DialogActionWidgetCtrl");
        if (!!dialogActionWidgetCtrl){
            dialogActionWidgetCtrl.dialogOut(function () {
                // 删除界面
                dialog.destroy();
                dialogController.isDestroy = true;
                // 移除属性
                delete createdDialogs[dialogRes];
                if (isClearPrefabs){
                    cc.loader.releaseRes(dialogRes);
                    delete this.loadedDialogPrefabs[dialogRes];
                }
                console.log('destroy dialog succeed', dialogRes);
            }.bind(this))
        }else{
            // 删除界面
            dialog.destroy();
            dialogController.isDestroy = true;
            // 移除属性
            delete createdDialogs[dialogRes];
            if (isClearPrefabs){
                cc.loader.releaseRes(dialogRes);
                delete this.loadedDialogPrefabs[dialogRes];
            }
            console.log('destroy dialog succeed', dialogRes);
        }
    }
};

DialogManager.destroyAllDialog = function(exceptArr){
    console.log('destroyAllDialog');
    for (let key in this.createdDialogs){
        if (this.createdDialogs.hasOwnProperty(key)){
            if (!!exceptArr && exceptArr.indexOf(key) >= 0) continue;
            let dialog = this.createdDialogs[key];
            // 删除界面
            dialog.destroy();
            let arr = key.split('/');
            let dialogType = arr[arr.length-1];
            dialog.getComponent(dialogType).isDestroy = true;
            // 移除属性
            delete this.createdDialogs[key];
        }
    }
};

DialogManager.addLoadingCircle = function (delay){
    this.loadingCircleDialog.addLoadingCircle(delay);
};

DialogManager.removeLoadingCircle = function (){
    this.loadingCircleDialog.removeLoadingCircle();
};

DialogManager.addPopDialog = function(content, cbOK, cbCancel, isRotate ){
    this.popDialog.node.active = true;
    this.popDialog.addPopDialog(content, cbOK, cbCancel, isRotate);
};

DialogManager.addTipDialog = function (content) {
    this.tipDialog.addTip(content);
};
