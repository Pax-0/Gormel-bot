const eris = require('eris');

module.exports.generator = async (msg, args) => {
    // console.log(msg, args);
    let time = Date.now();
    const sent = await msg.channel.createMessage(`Pong!`);
    return sent.edit(`Pong! ${Date.now() - time}\`ms\``);
};

module.exports.options = {
    name: 'ping',
    description: 'pings the bot.',
    enabled: true,
    hasSubCommands: true,
    subCommands: ['pong'],
};