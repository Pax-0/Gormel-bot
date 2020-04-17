const bot = require('../index');

module.exports.generator = async (msg, args) => {
	await msg.channel.createMessage(args.join(' '));
	return msg.delete();
};

module.exports.options = {
	name: 'say',
	description: 'Make the bot say something.',
	enabled: true,
	argsRequired: true,
	deleteCommand: true,
	fullDescription:'Have the bot send a message in the same channel.',
	usage:'message text',
	requirements: {
		custom: async (msg) => {
			const settings = await bot.db.settings.findOne({});
			if(settings.owners.includes(msg.author.id)) return true;
			if(msg.member.roles.some(role => settings.modRoles.includes(role.id) )) return true;
			return false;
		}
	}
};