const eris = require('eris');

module.exports.generator = async (msg, args) => {
    // console.log(msg, args);
    const sent = await msg.channel.createMessage(`Pong!`);
    return sent.edit(`Pong! ${Date.now() - sent.timestamp}\`ms\``);
};

module.exports.options = {
    name: 'ping',
    description: 'pings the bot.',
    enabled: true
};