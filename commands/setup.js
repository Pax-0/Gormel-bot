const bot = require('../index');
const utils = require('../structures/utils');
// this should be the intial command to setup the bot up.
module.exports.generator = async (msg, args) => {
	let botPerms = msg.channel.guild.members.get(bot.user.id).permission.json;
	if(!botPerms.manageRoles || !botPerms.kickMembers || !botPerms.banMembers || !botPerms.manageChannels ){
		return msg.channel.createMessage('I do not have enough permissions to function properly, please ensure i have all of the followins:\nManage Roles, Manage Channels, Ban Members, and Kick Members.');
	}


	const settings = await bot.db.settings.findOne({});
	if(!settings) await utils.loadDefaultDbSettings(bot);
	let channel = resolveChannel(msg.channel.guild, args.join(' '));
	if(!channel) return msg.channel.createMessage('Coudlnt find that channel, check my permissions and try again.');
	try {
		await bot.db.settings.update({}, { $set: { 'automod.enabled': true } }, {});
		await bot.db.settings.update({}, { $set: { setup: true } }, {});
		await bot.db.settings.update({}, { $set: { mainGuildID: msg.channel.guild.id } }, {});
		await bot.db.settings.update({}, { $set: { modLogChannel: channel.id } }, {});
		await utils.setUpMutedSystem(msg.channel.guild, settings, bot);
		await msg.channel.createMessage('Setup complete!');
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('There was an error during setup, check my permissions and try again.');
	}
};
function resolveChannel(guild, string){
	let channel = guild.channels.get(string)|| guild.channels.find(c => c.mention === string)  || guild.channels.find(c => c.name === string);
	return channel;
}

module.exports.options = {
	name: 'setup',
	description: 'Sets the bot up.',
	fullDescription:'Start the bots setup, gathers important info such as a channel for logging purposes.',
	usage:'log channel name',
	enabled: true,
	guildOnly: true,
	argsRequired: true,
	requirements: {
		custom: async (msg) => {
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role.id) )) return true;
			return false;
		}
	}
};