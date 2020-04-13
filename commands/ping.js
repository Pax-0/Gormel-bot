const eris = require('eris');

module.exports.generator = async (msg, args) => {
    // console.log('Pong!')
    // console.log(msg, args);
    return msg.channel.createMessage(`Pong!`);
};

module.exports.options = {
    name: 'ping',
    description: 'pings the bot.',
    enabled: true
};