const eris = require('eris');

module.exports.generator = async (msg, args) => {
    // console.log(msg, args);
    const sent = await msg.channel.createMessage(`Pong!`);
};

module.exports.options = {
    name: 'pong',
    description: 'pings the bot.',
    enabled: true,
    isSubCommand: true
};