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
		duration: 5000, // need a way to figure out the duration
		reason: reason,
		mod: msg.author.id,
		time: Date.now(),
		caseType: 'Ban'
	};

	try {
		await msg.channel.guild.banMember(user.id, 7, encodeURI(`Moderator: ${msg.author.username}#${msg.author.discriminator}\nReason: ${modLog.reason}`));
		await utils.logCase(msg.channel.guild, modLog, settings, bot);
		return msg.channel.createMessage(`${user.username}#${user.discriminator} was banned!`);
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('I couldnt ban that user.');
	}

};

module.exports.options = {
	name: 'ban',
	description: 'Ban a user from the guild.',
	enabled: true,
	argsRequired: true,
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
