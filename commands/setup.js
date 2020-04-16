const bot = require('../index');
const utils = require('../structures/utils');
// this should be the intial command to setup the bot up.
module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) await utils.loadDefaultDbSettings(bot);
	let channel = resolveChannel(msg.channel.guild, args[0]);
	if(!channel) return msg.channel.createMessage('Coudlnt find that channels, check my permissions and try again.');
	try {
		await bot.db.settings.update({}, { $set: { 'automod.enabled': true } }, {});
		await bot.db.settings.update({}, { $set: { setup: true } }, {});
		await bot.db.settings.update({}, { $set: { mainGuildID: msg.channel.guild.id } }, {});
		await bot.db.settings.update({}, { $set: { modLogChannel: channel.id } }, {});
		await utils.setUpMutedSystem(msg.channel.guild, settings, bot);
		await msg.channel.createMessage('Setup complete!');
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('There was an error during setup :( ');
	}
};
function resolveChannel(guild, string){
	let channel = guild.channels.get(string)|| guild.channels.find(c => c.mention === string)  || guild.channels.find(c => c.name === string);
	return channel;
}

module.exports.options = {
	name: 'setup',
	description: 'Sets the bot up (takes a channel for modlogs).',
	enabled: true,
	guildOnly: true,
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