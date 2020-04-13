const eris = require('eris');
const bot = require('../index');

module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!args.length) return msg.channel.createMessage('Please provide a banned word(s) to add to the list.');
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
    description: 'add a banned word to the list.',
    enabled: true
};