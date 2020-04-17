const bot = require('../index');

module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');
    
	let blackListed = args;
    
	const sent = await msg.channel.createMessage('Updating links..');
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
	fullDescription:'Adds a website link to the blacklist, aka no longer usable in the server.',
	usage:'Link',
	requirements: {
		custom: async (msg) => {
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role.id) )) return true;
			return false;
		}
	}
};