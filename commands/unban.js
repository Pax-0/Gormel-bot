const utils = require('../structures/utils');
const bot = require('../index');
module.exports.generator = async (msg, args) => {
	let user = await utils.resolveUser(args[0], bot);
	let reason = args.length > 1 ? args.slice(1).join(' ') : 'Not specified.';
	if(!user) return msg.channel.createMessage('I couldnt find that user.');

	const settings = await utils.getDBSettings(bot);
	if(!settings) return msg.channel.createMessage('Couldnt find bot settings, please use the setup command.');

	const modLog = {
		userID: user.id,
		duration: 'Permenant', // need a way to figure out the duration
		reason: reason,
		mod: msg.author.id,
		time: Date.now(),
		caseType: 'Unban'
	};
    
	let banCase = await msg.channel.guild.getBan(user.id);
	if(!banCase) return msg.channel.createMessage('That user is not banned.');
	try {
		await msg.channel.guild.unbanMember(user.id);
		await utils.logCase(msg.channel.guild, modLog, settings, bot);
		return msg.channel.createMessage(`${user.username}#${user.discriminator} has been unbanned!`);
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('I couldnt unban that user.');
	}

};

module.exports.options = {
	name: 'unban',
	description: 'Unbans a user',
	fullDescription:'Removes a ban status from a user',
	usage:'<user\'s id> reason',
	enabled: true,
	argsRequired: true,
	requirements: {
		custom: async (msg) => {
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role) )) return true;
			return false;
		}
	}
};
