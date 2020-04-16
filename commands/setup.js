const bot = require('../index');
const utils = require('../structures/utils')
// this should be the intial command to setup the bot up.
module.exports.generator = async (msg) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) await utils.loadDefaultDbSettings(bot);
	
	try {
		await bot.db.settings.update({}, { $set: { 'automod.enabled': true } }, {});
		await bot.db.settings.update({}, { $set: { setup: true } }, {});
		await bot.db.settings.update({}, { $set: { mainGuildID: msg.channel.guild.id } }, {});
		await utils.setUpMutedSystem(msg.channel.guild, settings);
		await msg.channel.createMessage('Setup complete!');
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('There was an error during setup :( ');
	}
};

module.exports.options = {
	name: 'setup',
	description: 'Starts the bot setup.',
	enabled: true,
	guildOnly: true,
	requirements: {
		custom: async (msg) => {
			const bot = require('../index');
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role.id) )) return true;
			return false;
		}
	}
	// argsRequired: true
};