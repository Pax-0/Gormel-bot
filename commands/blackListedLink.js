const bot = require('../index');
const URLRegex = new RegExp(/((http(s)?(:\/\/))+(www\.)?([\w\-./])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:?!@^$ -]/);
module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');
    
	let blackListed = [];
	args.forEach(element =>{
		let link = element.match(URLRegex);
		if(link) blackListed.push(link[0]);
	});
	if(!blackListed.length) return msg.channel.createMessage('Please use a valid website link.');
	const sent = await msg.channel.createMessage('Updating links..');
	await blackListLink(blackListed);
	return sent.edit('Updated blacklisted links!');
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
	fullDescription:'Adds a website link to the blacklist, aka no longer usable in the server, can add multiple links at a time, just seperate them with a space.',
	usage:'Link',
	requirements: {
		custom: async (msg) => {
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role) )) return true;
			return false;
		}
	}
};