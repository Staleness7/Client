cc.Class({
    extends: cc.Component,

    properties: {
        giveUid: cc.Label,
        giveNickname: cc.Label,
        gainUid: cc.Label,
        gainNickname: cc.Label,
        count: cc.Label,
        time: cc.Label
    },

    start () {

    },

    initWidget(record){
        this.giveUid.string = record.uid;
        this.giveNickname.string = record.nickname;

        this.gainUid.string = record.gainUid;
        this.gainNickname.string = record.gainNickname;

        this.count.string = record.count;
        this.time.string = new Date(record.createTime).format("yy-MM-dd hh:mm:ss");
    }
});
