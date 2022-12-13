let Api = module.exports = {};

Api.hall = require('../API/HallAPI');
Api.account = require('../API/AccountAPI');
Api.room = require('../API/RoomAPI');
Api.http = require('../API/HttpAPI');

Api.roomProto = require('../API/RoomProto');