const bot = require('../index');
const utils = require('../structures/utils');

module.exports.generator = async (msg, args) => {
	let member = resolveMember(args[0], msg);
	let reason = args.length > 1 ? args.slice(1).join(' ') : 'Not specified.';
	if(!member) return msg.channel.createMessage('I couldnt find that user.');

	const settings = await utils.getDBSettings(bot);
	if(!settings) return msg.channel.createMessage('Couldnt find bot settings, please use the setup command.');

	const modLog = {
		userID: member.id,
		duration: null, // need a way to figure out the duration
		reason: reason,
		mod: msg.author.id,
		time: Date.now(),
		caseType: 'Kick'
	};

	try {
		await utils.logCase(msg.channel.guild, modLog, settings, bot);
		await member.kick(encodeURI(`Moderator: ${msg.member.username}#${msg.member.discriminator}\nReason: ${modLog.reason}`));
		return msg.channel.createMessage(`${member.username}#${member.discriminator} was kicked!`);
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('I couldnt kick that user.');
	}

};
function resolveMember(string, msg){
	let member = msg.channel.guild.members.get(string) || msg.channel.guild.members.find(m => m.user.mention === string) || msg.channel.guild.members.find(m => m.username === string) || msg.channel.guild.members.find(m => m.nick === string);
	return member;
}
module.exports.options = {
	name: 'kick',
	description: 'Remove a member from the guild.',
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