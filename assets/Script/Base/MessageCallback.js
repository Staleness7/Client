let messageCallback = module.exports = {};

messageCallback.addListener = function (route, handler) {
    this.handlers = this.handlers || [];

    let handlers = this.handlers[route] || null;
    if (!!handlers){
        let isHandlerExist = false;
        for (let i in handlers){
            if (handlers.hasOwnProperty(i) && (handlers[i] === handler)){
                isHandlerExist = true;
                break;
            }
        }
        if (!isHandlerExist){
            handlers.push(handler);
        }
    }
    else{
        handlers = [];
        handlers.push(handler);
        this.handlers[route] = handlers;
    }
};

messageCallback.removeListener = function (route, handler) {
    this.handlers = this.handlers || [];
    let handlers = this.handlers[route] || null;
    if (!!handlers){
        for (let i = 0; i < handlers.length; ++i){
            if (handlers[i] === handler){
                handlers.splice(i,1);
                break;
            }
        }
    }
};

messageCallback.emitMessage = function (route, msg) {
    this.handlers = this.handlers || [];

    let handlers = this.handlers[route] || [];
    if (!!handlers){
        let handlersTemp = handlers.slice();
        for (let i in handlersTemp){
            if (handlersTemp.hasOwnProperty(i) && !!handlersTemp[i].messageCallbackHandler && !handlersTemp[i].isDestroy){
                handlersTemp[i].messageCallbackHandler(route, msg);
            }
        }
    }
};
