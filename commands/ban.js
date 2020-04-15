module.exports.generator = async (msg, args) => {
	let member = resolveMember(args[0], msg);
	let reason = args.length > 1 ? args.slice(1).join(' ') : 'Not specified.';
	if(!member) return msg.channel.createMessage('I couldnt find that user.');

	try {
		await member.ban(7, `Moderator: ${msg.member.username}#${msg.member.discriminator}\nReason: ${reason}`);
		return msg.channel.createMessage(`${member.username}#${member.discriminator} was banned!`);
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('I couldnt ban that user.');
	}

};
function resolveMember(string, msg){
	let member = msg.channel.guild.members.get(string) || msg.channel.guild.members.find(m => m.user.mention === string) || msg.channel.guild.members.find(m => m.username === string) || msg.channel.guild.members.find(m => m.nick === string);
	return member;
}
module.exports.options = {
	name: 'ban',
	description: 'Ban a member from the guild.',
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
