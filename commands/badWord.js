const eris = require('eris');
const bot = require('../index');

module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');

    let bannedWords = args.join(' ').split(', ');
    
    const sent = await msg.channel.createMessage(`Updating banned words..`);
    await addBannedWord(bannedWords);
    return sent.edit('Updated!');
};
async function addBannedWord(bannedWords){
    bannedWords.forEach(async (bannedWord) => {
        // settings.automod.bannedWords.push(bannedWord);
        await bot.db.settings.update({}, { $addToSet: { 'automod.bannedWords': bannedWord } }, {});
     });
    return;
}
module.exports.options = {
    name: 'banword',
    description: 'Adds a banned word to the list.',
    enabled: true,
    argsRequired: true,
    hasSubCommands: true,
    subCommands: ['remove'],
};