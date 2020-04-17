
module.exports.generator = async (msg, args) => {
	await msg.channel.createMessage(args.join(' '));
	return msg.delete();
};

module.exports.options = {
	name: 'say',
	description: 'Make the bot say something.',
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