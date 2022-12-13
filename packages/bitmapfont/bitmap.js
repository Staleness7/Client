module.exports = {
    'getCocosVersion': function(event) {
        if (event.reply) {
            let version = cc.ENGINE_VERSION;
            event.reply(null, version);
        }
    }
};