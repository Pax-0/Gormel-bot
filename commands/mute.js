const utils = require('../structures/utils');
const bot = require('../index');
module.exports.generator = async (msg, args) => {
	let member = utils.resolveMember(args[0], msg.channel.guild);
	if(!member) return msg.channel.createMessage('I couldnt find that user.');
	// mute user time reason
	const reason = args.length > 2 ? args.slice(2).join(' ') : 'Not specified.';
	const duration = utils.getDuration(args[1]) ?  utils.getDuration(args[1]) : 'permenant';
	let settings = await utils.getDBSettings(bot);

	if(!settings){
		console.log('Error: cant locate bot settings!');
		return msg.channel.createMessage('There was an error during excution, Please use the setup command first');
	}
	if(!settings.mutedRole){
		await utils.setUpMutedSystem(msg.channel.guild, settings, bot);
		settings = await utils.getDBSettings(bot);
	}

	if(member.roles.includes(settings.mutedRole) || settings.muted.find(muteCase => muteCase.userID === member.id)) return msg.channel.createMessage('That user is already muted.');
	const modLog = {
		userID: member.id,
		duration: duration, // need a way to figure out the duration
		reason: reason,
		mod: msg.author.id,
		time: Date.now(),
		caseType: 'Mute'
	};
	try {
		await member.addRole(settings.mutedRole);
		await bot.db.settings.update({}, { $addToSet: { muted: modLog } }, {});
		await utils.logCase(msg.channel.guild, modLog, settings, bot);
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