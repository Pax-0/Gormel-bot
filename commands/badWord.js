const bot = require('../index');

module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');

	let bannedWords = args.join(' ').split(', ');
    
	const sent = await msg.channel.createMessage('Updating banned words..');
	await addBannedWords(bannedWords);
	return sent.edit('Updated!');
};
async function addBannedWords(bannedWords){
	bannedWords.forEach(async (bannedWord) => {
		console.log(bannedWord);
		await bot.db.settings.update({}, { $addToSet: { 'automod.bannedWords': bannedWord } }, {});
	});
	return;
}
module.exports.options = {
	name: 'banword',
	description: 'Adds a banned word(s) to the list.',
	enabled: true,
	argsRequired: true,
	hasSubCommands: true,
	fullDescription:'Adds a banned word to the bot\'s database, can add multple words at a time, just seperate them with a comma ", "',
	usage:'bannedword',
	subCommands: ['remove'],
	requirements: {
		custom: async (msg) => {
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role) )) return true;
			return false;
		}
	}
};