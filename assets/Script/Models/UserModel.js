let exp = module.exports = {};

exp.init = function (data) {
    //服务器发过来的数据初始化
    this.setProperties(data);

    Global.MessageCallback.addListener('UpdateUserInfoPush', this);
};

exp.messageCallbackHandler = function (router, msg) {
    switch (router) {
        case 'UpdateUserInfoPush':
            delete msg.pushRouter;
            this.setProperties(msg);
            Global.MessageCallback.emitMessage('UpdateUserInfoUI');
            break;
    }
};

exp.setProperties = function (properties) {
    for (let key in properties) {
        if (properties.hasOwnProperty(key)) {
            this[key] = properties[key];
        }
    }
};

exp.isInRoom = function () {
    return !!this.roomID && this.roomID > 0;
};

//是否有可领取邮件
exp.canGetEmailCount = function () {
    let mails = JSON.parse(this.emailArr||"[]");
    let count = 0;
    for (let i = mails.length - 1; i >= 0; i --) {
        let data = JSON.parse(mails[i]);
        if (!!data.gold) {
            if (parseInt(data.status) === Global.Enum.emailStatus.NOT_RECEIVE) {
                count++;
            }
        }
    }
    return count;
};

exp.unreadEmailCount = function () {
    let mails = JSON.parse(this.emailArr||"[]");
    let unReadCount = 0;
    for (let i = mails.length - 1; i >= 0; i --) {
        let data = mails[i];
        if (!data.isRead) {
            unReadCount ++;
        }
    }
    return unReadCount;
};

exp.setMailRead = function (mailId) {
    let mails = this.emailArr;
    if (!!mails && mails.length > 0){
        mails = JSON.parse(mails);
    }else{
        mails = [];
    }
    for (let i = mails.length - 1; i >= 0; i --) {
        let data = mails[i];
        if (data.id + '' === mailId + '') {
            data.isRead = true;
            mails[i] = data;
        }
    }
};
exp.convertNickname = function (nickname) {
    let isNumber = true;
    let newNickname = nickname;
    if (nickname.length > 7) {
        for (let i = 0; i < nickname.length; i ++) {
            if (isNaN(nickname[i])) {
                isNumber = false;
            }
        }
        if (isNumber) {
            newNickname = nickname.substring(0, 3) + '****' + nickname.substring(nickname.length-4, nickname.length);
        }
    }
    return newNickname;
};

exp.getUnionInfoItemByUnionID = function (unionID) {
    return this.unionInfo.find(function (ele) {
        return ele.unionID === unionID;
    })
};
