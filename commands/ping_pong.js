const eris = require('eris');

module.exports.generator = async (msg, args) => {
    // console.log(msg, args);
    const sent = await msg.channel.createMessage(`Pong!`);
};

module.exports.options = {
    name: 'pong',
    description: 'ping pong it!',
    enabled: true,
    isSubCommand: true
};