const eris = require('eris');
const bot = require('../index');

module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');
    
    let blackListed = args;
    
    const sent = await msg.channel.createMessage(`Updating links..`);
    await blackListLink(blackListed);
    return sent.edit('Updated!');
};
async function blackListLink(blackListed){
    blackListed.forEach(async (element) => {
        await bot.db.settings.update({}, { $addToSet: { 'automod.blackListedLinks': element } }, {});
     });
    return;
}
module.exports.options = {
    name: 'blacklist',
    description: 'Blacklist a website link.',
    enabled: true,
    argsRequired: true,
};