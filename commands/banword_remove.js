const bot = require('../index');

module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');

	let bannedWords = args.join(' ').split(', ');
    
	const sent = await msg.channel.createMessage('Updating banned words..');
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
	fullDescription:'Removes a banned word from the bot\'s database.',
	usage:'bannedword',
	requirements: {
		custom: async (msg) => {
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role) )) return true;
			return false;
		}
	}
};