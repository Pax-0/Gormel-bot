const eris = require('eris');

module.exports.generator = async (msg) => {
    let time = Date.now();
    const sent = await msg.channel.createMessage(`Pong!`);
    return sent.edit(`Pong! ${Date.now() - time}\`ms\``);
};

module.exports.options = {
    name: 'setup',
    description: 'Starts the bot setup.',
    enabled: true,
};