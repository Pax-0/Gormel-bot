const utils = require('../structures/utils');
const bot = require('../index');
module.exports.generator = async (msg, args) => {
	let member = utils.resolveMember(args[0], msg.channel.guild);
	if(!member) return msg.channel.createMessage('I couldnt find that user.');

	let reason = args.length > 1 ? args.slice(1).join(' ') : 'Not specified.';
	let settings = await utils.getDBSettings(bot);
	if(!settings){
		console.log('Error: cant locate bot settings!');
		return msg.channel.createMessage('There was an error during excution.');
	}
	if(!settings.mutedRole){
		await utils.setUpMutedSystem(msg.channel.guild, settings, bot);
		settings = await utils.getDBSettings(bot);
	}

	if(member.roles.includes(settings.mutedRole)) return msg.channel.createMessage('That user is already muted.');
	const modLog = {
		userID: member.id,
		duration: 5000, // need a way to figure out the duration
		reason: reason,
		mod: msg.author.id,
		time: Date.now(),
		caseType: 'Mute'
	};
	try {
		await utils.logCase(msg.channel.guild, modLog, settings, bot);
		await member.addRole(settings.mutedRole, encodeURI(`Moderator: ${msg.member.username}#${msg.member.discriminator}\nReason: ${modLog.reason}`));
		await bot.db.settings.update({}, { $addToSet: { muted: modLog } }, {});
		return msg.channel.createMessage(`${member.username}#${member.discriminator} was Muted!`);
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('I couldnt mute that user, check my role\'s position and try again.');
	}

};

module.exports.options = {
	name: 'mute',
	description: 'Mute a member for a certain period of time.',
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