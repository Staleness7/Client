cc.Class({
    extends: cc.Component,

    properties: {
        roomID: cc.Label,
        type: cc.Label,
        count: cc.Label,
        time: cc.Label
    },

    start () {

    },

    initWidget(record){
        this.roomID.string = "房间:" + record.roomID;
        this.type.string = !!record.start?"固定抽分":"赢家抽分";
        this.count.string = parseFloat(record.gainCount.toFixed(2));
        this.time.string = new Date(record.createTime).format("yyyy-MM-dd hh:mm:ss");
    }
});
