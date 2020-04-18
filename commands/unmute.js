const utils = require('../structures/utils');
const bot = require('../index');
module.exports.generator = async (msg, args) => {
	let member = utils.resolveMember(args[0], msg.channel.guild);
	if(!member) return msg.channel.createMessage('I couldnt find that user.');
	// mute user time reason
	const reason = args.length > 1 ? args.slice(1).join(' ') : 'Not specified.';
	let settings = await utils.getDBSettings(bot);
	if(!settings){
		console.log('Error: cant locate bot settings!');
		return msg.channel.createMessage('There was an error during excution, Please use the setup command first');
	}
	if(!settings.mutedRole){
		await utils.setUpMutedSystem(msg.channel.guild, settings, bot);
		settings = await utils.getDBSettings(bot);
	}
	const oldMuteCase = settings.muted.find(muteCase => muteCase.userID === member.id);
	if( !member.roles.includes(settings.mutedRole) ||  !oldMuteCase) return msg.channel.createMessage('That user is not muted.');
	const modLog = {
		userID: member.id,
		duration: 'Permenant unmute', // need a way to figure out the duration
		reason: reason,
		mod: msg.author.id,
		time: Date.now(),
		caseType: 'Unmute'
	};
	try {
		await member.removeRole(settings.mutedRole);
		await bot.db.settings.update({}, { $pull: { 'muted': oldMuteCase } }, {});
		await utils.logCase(msg.channel.guild, modLog, settings, bot);
		return msg.channel.createMessage(`${member.username}#${member.discriminator} has been unmuted!`);
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('I couldnt unmute that user, check my role\'s position and try again.');
	}

};

module.exports.options = {
	name: 'unmute',
	description: 'Umute a member.',
	fullDescription:'Removes the muted status from a user.',
	usage:'user reason',
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