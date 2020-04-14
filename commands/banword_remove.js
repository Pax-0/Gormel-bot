const eris = require('eris');
const bot = require('../index');

module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');

    let bannedWords = args.join(' ').split(', ');
    
    const sent = await msg.channel.createMessage(`Updating banned words..`);
    await removeBannedWords(bannedWords);
    return sent.edit('Updated!');
};
async function removeBannedWords(bannedWords){
    bannedWords.forEach(async (bannedWord) => {
        // settings.automod.bannedWords.push(bannedWord);
        await bot.db.settings.update({}, { $pull: { 'automod.bannedWords': bannedWord } }, {});
     });
    return;
}
module.exports.options = {
    name: 'remove',
    description: 'removes a banned word from the list.',
    enabled: true,
    argsRequired: true,
    isSubCommand: true,
    requirements: {
        custom: async (msg) => {
            const bot = require('../index');
            const settings = await bot.db.settings.findOne({});
            if(settings.owners.includes(msg.author.id)) return true;
            if(msg.member.roles.some(role => settings.modRoles.includes(role.id) )) return true;
            return false;
        }
    }
};