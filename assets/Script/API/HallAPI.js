let api = module.exports = {};

// 测试接口
api.sendTestData = function (_router,_requestData, cbRouter) {
    let router = _router;
    let requestData = _requestData;
    Global.NetworkManager.send(router, requestData, cbRouter);
};

//进入大厅
api.entry = function (token, userInfo, cbRouter, cbFail) {
    let router = 'connector.entryHandler.entry';
    let requestData = {
        token: token,
        userInfo: userInfo
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'EntryHallResponse', cbFail);
};

// --------------------------------------------用户相关------------------------------------------
//查找玩家，获取玩家信息
api.searchRequest = function (uid, cbRouter) {
    let router = 'hall.userHandler.searchUserData';
    let requestData = {
        uid:uid
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'SearchResponse')
};

//查找玩家，获取玩家信息
api.searchByPhoneRequest = function (phone, cbRouter) {
    let router = 'hall.userHandler.searchByPhone';
    let requestData = {
        phone: phone
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

//绑定手机号
api.bindPhoneRequest = function (phone, smsCode, imgCodeInfo, cbRouter) {
    let router = 'hall.userHandler.bindPhone';
    let requestData = {
        phone: phone,
        smsCode: smsCode
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'BindPhoneResponse');
};

// 实名认证
api.authRealNameRequest = function (name, idCard, cbRouter) {
    let router = 'hall.userHandler.authRealName';
    let requestData = {
        name: name,
        idCard: idCard
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'AuthRealNameResponse');
};

// 实名认证
api.updateUserAddressRequest = function (address, location, cbRouter) {
    let router = 'hall.userHandler.updateUserAddress';
    let requestData = {
        address: address,
        location: location

    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

api.deleteEmailRequest = function (emailID, cbRouter) {
    let router = 'hall.emailHandler.deleteEmail';
    let requestData = {
        emailID: emailID
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// --------------------------------------------联盟相关------------------------------------------
// 创建联盟
api.createUnionRequest = function (unionName, cbRouter) {
    let router = 'hall.unionHandler.createUnion';
    let requestData = {
        unionName: unionName
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'CreateUnionResponse');
};

// 加入联盟
api.joinUnionRequest = function (inviteID, cbRouter) {
    let router = 'hall.unionHandler.joinUnion';
    let requestData = {
        inviteID: inviteID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'JoinUnionResponse');
};

// 退出联盟
api.exitUnionRequest = function (unionID, cbRouter) {
    let router = 'hall.unionHandler.exitUnion';
    let requestData = {
        unionID: unionID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'ExitUnionResponse');
};

// 邀请加入联盟
api.inviteJoinUnionRequest = function (uid, unionID, partner, cbRouter) {
    let router = 'hall.unionHandler.inviteJoinUnion';
    let requestData = {
        uid: uid,
        unionID: unionID,
        partner: partner
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'InviteJoinUnionResponse');
};

// 操作邀请加入联盟
api.operationInviteJoinUnionRequest = function (uid, unionID, agree, cbRouter) {
    let router = 'hall.unionHandler.operationInviteJoinUnion';
    let requestData = {
        uid: uid,
        unionID: unionID,
        agree: agree
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 获取联盟列表
api.getUserUnionListRequest = function (cbRouter) {
    let router = 'hall.unionHandler.getUserUnionList';
    let requestData = {};
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetUserUnionListResponse');
};

// 获取联盟详细信息
api.getUnionInfoRequest = function (unionID, cbRouter) {
    let router = 'game.unionHandler.getUnionInfo';
    let requestData = {
        unionID: unionID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetUnionInfoResponse');
};

// 获取房间列表
api.getUnionRoomListRequest = function (unionID, cbRouter) {
    let router = 'game.unionHandler.getUnionRoomList';
    let requestData = {
        unionID: unionID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetUnionRoomListResponse');
};

// 更新公告
api.updateAllUnionNoticeRequest = function (unionID, notice, cbRouter) {
    let router = 'game.unionMgrHandler.updateUnionNotice';
    let requestData = {
        unionID: unionID,
        notice: notice
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'UpdateUnionNoticeResponse');
};

// 更新公告
api.updateUnionNoticeRequest = function (unionID, notice, cbRouter) {
    let router = 'hall.unionHandler.updateUnionNotice';
    let requestData = {
        unionID: unionID,
        notice: notice
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'UpdateUnionNoticeResponse');
};

// 保险柜操作
api.safeBoxOperationRequest = function (unionID, count, cbRouter) {
    let router = 'hall.unionHandler.safeBoxOperation';
    let requestData = {
        count: count,
        unionID: unionID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'SafeBoxOperationResponse');
};

// 保险柜操作记录
api.safeBoxOperationRecordRequest = function (unionID, startIndex, count, cbRouter) {
    let router = 'hall.unionHandler.safeBoxOperationRecord';
    let requestData = {
        startIndex: startIndex,
        count: count,
        unionID: unionID
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 获取成员列表
api.getMemberListRequest = function (unionID, matchData, startIndex, count, cbRouter) {
    let router = 'hall.unionHandler.getMemberList';
    let requestData = {
        unionID: unionID,
        matchData: matchData,
        startIndex: startIndex,
        count: count,
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetMemberListResponse');
};

// 获取成员统计信息
api.getMemberStatisticsInfoRequest = function (unionID, matchData, cbRouter) {
    let router = 'hall.unionHandler.getMemberStatisticsInfo';
    let requestData = {
        unionID: unionID,
        matchData: matchData
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 获取成员列表
api.getMemberScoreListRequest = function (unionID, matchData, startIndex, count, cbRouter) {
    let router = 'hall.unionHandler.getMemberScoreList';
    let requestData = {
        unionID: unionID,
        matchData: matchData,
        startIndex: startIndex,
        count: count
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetMemberListResponse');
};

// 修改成员积分
api.modifyScoreRequest = function (unionID, memberUid, count, cbRouter) {
    let router = 'hall.unionHandler.modifyScore';
    let requestData = {
        unionID: unionID,
        memberUid: memberUid,
        count: count
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'ModifyScoreResponse');
};

// 查看积分修改日志
api.getModifyScoreRecordRequest = function (unionID, matchData, startIndex, count, cbRouter) {
    let router = 'hall.unionHandler.getScoreModifyRecord';
    let requestData = {
        unionID: unionID,
        matchData: matchData,
        startIndex: startIndex,
        count: count
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 添加合伙人
api.addPartnerRequest = function (unionID, memberUid, cbRouter) {
    let router = 'hall.unionHandler.addPartner';
    let requestData = {
        unionID: unionID,
        memberUid: memberUid
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'AddPartnerResponse');
};

// 修改返利比例
api.updateUnionRebateRequest = function (unionID, memberUid, rebateRate, cbRouter) {
    let router = 'hall.unionHandler.updateUnionRebate';
    let requestData = {
        unionID: unionID,
        memberUid: memberUid,
        rebateRate: rebateRate
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 赠送积分
api.giveScoreRequest = function (unionID, giveUid, count, cbRouter) {
    let router = 'hall.unionHandler.giveScore';
    let requestData = {
        unionID: unionID,
        giveUid: giveUid,
        count: count
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 获取赠送记录
api.getGiveScoreRecordRequest = function (unionID, matchData, startIndex, count, total, cbRouter) {
    let router = 'hall.unionHandler.getGiveScoreRecord';
    let requestData = {
        unionID: unionID,
        matchData: matchData,
        startIndex: startIndex,
        count: count,
        total: total
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};



// 获取游戏记录
api.getGameRecordRequest = function (matchData, startIndex, count, cbRouter) {
    let router = 'hall.unionHandler.getGameRecord';
    let requestData = {
        matchData: matchData,
        startIndex: startIndex,
        count: count,
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 获取游戏录像
api.getVideoRecordRequest = function (videoRecordID,  cbRouter) {
    let router = 'hall.unionHandler.getVideoRecord';
    let requestData = {
        videoRecordID: videoRecordID
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 获取返利记录
api.getUnionRebateRecordRequest = function (matchData, startIndex, count, cbRouter) {
    let router = 'hall.unionHandler.getUnionRebateRecord';
    let requestData = {
        matchData: matchData,
        startIndex: startIndex,
        count: count,
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 更新禁止游戏状态
api.updateForbidGameStatusRequest = function (unionID, uid, forbid, cbRouter) {
    let router = 'hall.unionHandler.updateForbidGameStatus';
    let requestData = {
        unionID: unionID,
        uid: uid,
        forbid: forbid
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 更新禁止游戏状态
api.getRankRequest = function (unionID, matchData, startIndex, count, sortData, cbRouter) {
    let router = 'hall.unionHandler.getRank';
    let requestData = {
        unionID: unionID,
        matchData: matchData,
        startIndex: startIndex,
        count: count,
        sortData: sortData
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 更新禁止游戏状态
api.getRankSingleDrawRequest = function (unionID, matchData, startIndex, count, sortData, cbRouter) {
    let router = 'hall.unionHandler.getRankSingleDraw';
    let requestData = {
        unionID: unionID,
        matchData: matchData,
        startIndex: startIndex,
        count: count,
        sortData: sortData
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 快速加入
api.quickJoinRequest = function (unionID, gameRuleID, cbRouter) {
    let router = 'game.unionHandler.quickJoin';
    let requestData = {
        unionID: unionID,
        gameRuleID: gameRuleID
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 快速加入
api.getHongBaoRequest = function (unionID, cbRouter) {
    let router = 'game.unionHandler.getHongBao';
    let requestData = {
        unionID: unionID
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};
// --------------------------------------------联盟管理相关------------------------------------------
// 添加房间列表规则
api.addRoomRuleListRequest = function (unionID,gameType, ruleName,  roomRule, cbRouter) {
    let router = 'game.unionMgrHandler.addRoomRuleList';
    let requestData = {
        unionID: unionID,
        gameType: gameType,
        ruleName: ruleName,
        roomRule: roomRule
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 更新房间列表规则
api.updateRoomRuleListRequest = function (unionID, _id, gameType, ruleName,  roomRule, cbRouter) {
    let router = 'game.unionMgrHandler.updateRoomRuleList';
    let requestData = {
        unionID: unionID,
        _id: _id,
        gameType: gameType,
        ruleName: ruleName,
        roomRule: roomRule
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 移除房间列表规则
api.removeRoomRuleListRequest = function (unionID, roomRuleID, cbRouter) {
    let router = 'game.unionMgrHandler.removeRoomRuleList';
    let requestData = {
        unionID: unionID,
        roomRuleID: roomRuleID
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 转移联盟
api.transferUnionRequest = function (unionID, transferUid, cbRouter) {
    let router = 'game.unionMgrHandler.transferUnion';
    let requestData = {
        unionID: unionID,
        transferUid: transferUid
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 修改联盟名字
api.updateUnionNameRequest = function (unionID, unionName, cbRouter) {
    let router = 'game.unionMgrHandler.updateUnionName';
    let requestData = {
        unionID: unionID,
        unionName: unionName
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 合伙人公告
api.updatePartnerNoticeSwitchRequest = function (unionID, isOpen, cbRouter) {
    let router = 'game.unionMgrHandler.updatePartnerNoticeSwitch';
    let requestData = {
        unionID: unionID,
        isOpen: isOpen
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 打烊设置
api.updateOpeningStatusRequest = function (unionID, isOpen, cbRouter) {
    let router = 'game.unionMgrHandler.updateOpeningStatus';
    let requestData = {
        unionID: unionID,
        isOpen: isOpen
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 合伙人公告
api.dismissRoomRequest = function (unionID, roomID, cbRouter) {
    let router = 'game.unionMgrHandler.dismissRoom';
    let requestData = {
        unionID: unionID,
        roomID: roomID
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 设置红包活动
api.hongBaoSettingRequest = function (unionID, status, startTime, endTime, count, totalScore, cbRouter) {
    let router = 'game.unionMgrHandler.hongBaoSetting';
    let requestData = {
        unionID: unionID,
        status: status,
        startTime: startTime,
        endTime: endTime,
        count: count,
        totalScore: totalScore
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 红包抽奖状态设置
api.updateLotteryStatusRequest = function (unionID, isOpen, cbRouter) {
    let router = 'game.unionMgrHandler.updateLotteryStatus';
    let requestData = {
        unionID: unionID,
        isOpen: isOpen
    };
    Global.NetworkManager.send(router, requestData, cbRouter);
};

// 操作申请加入联盟的请求
// --------------------------------------------充值相关------------------------------------------
// 充值
api.rechargeRequest = function(rechargePlatform, count , rechargeInfo, cbRouter){
    let router = 'hall.rechargeHandler.recharge';
    let requestData = {
        count: count,
        rechargePlatform: rechargePlatform,
        rechargeInfo: rechargeInfo
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'RechargeResponse');
};

// --------------------------------------------记录相关------------------------------------------
// 获取记录
/**
 * recordType : enumeration.recordType
 */
api.getRecordDataRequest = function(recordType, startIndex, count, matchData, cbRouter){
    let router = 'hall.recordHandler.getRecordData';
    let requestData = {
        recordType: recordType,
        startIndex: startIndex,
        count: count,
        matchData: matchData
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetRecordDataResponse')
};

api.getDirectlyMemberRecordDataRequest = function (startIndex, count, cbRouter) {
    let router = 'hall.recordHandler.getDirectlyMemberRecordData';
    let requestData = {
        startIndex: startIndex,
        count: count
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetDirectlyMemberRecordDataResponse')
};

api.getAgentMemberRecordDataRequest = function (startIndex, count, cbRouter) {
    let router = 'hall.recordHandler.getAgentMemberRecordData';
    let requestData = {
        startIndex: startIndex,
        count: count
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'GetAgentMemberRecordDataResponse')
};

// --------------------------------------------房间相关------------------------------------------
api.createRoomRequest = function (gameRule, gameRuleID, unionID, cbRouter){
    let router = 'game.unionHandler.createRoom';
    let requestData = {
        unionID: unionID,
        gameRule: gameRule,
        gameRuleID: gameRuleID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'CreateRoomResponse');
};

api.joinRoomRequest = function (joinRoomID, cbRouter, cbFail){
    let router = 'hall.gameHandler.joinRoom';
    let requestData = {
        roomID: joinRoomID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'JoinRoomResponse', cbFail);
};

// --------------------------------------------其他相关------------------------------------------
api.readEmailRequest = function(emailID, cbRouter){
    let router = 'hall.emailHandler.readEmail';
    let requestData = {
        emailID: emailID
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'ReadEmailResponse')
};

api.sendCustomerServiceMsgRequest = function (content, cbRouter) {
    let router = 'hall.emailHandler.sendCustomerServiceMsg';
    let requestData = {
        content: content
    };
    Global.NetworkManager.send(router, requestData, cbRouter || 'SendCustomerServiceMsgResponse');
};

api.getNetworkDelay = function (cbSuccess) {
    let router = 'connector.reportHandler.getNetworkDelay';
    let requestData = {};
    let requestTime = Date.now();
    Global.NetworkManager.send(router, requestData, function () {
        let time = (Date.now() - requestTime)/2;
        Global.Utils.invokeCallback(cbSuccess, {code: 0, msg: {delayTime: time}});
    }, function () {
        Global.Utils.invokeCallback(cbSuccess, {code: 0, msg: {delayTime: 1000}});
    });
};
