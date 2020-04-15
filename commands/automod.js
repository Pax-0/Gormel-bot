const bot = require('../index');

module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');
	if(!settings.setup) return msg.channel.createMessage('Please use the setup command first.');
	const sent = await msg.channel.createMessage('Updating settings...');
	let status = await toggleAutomod(args.length ? args[0] : 'toggle', settings);
	return sent.edit(`${status ? 'enabled' : 'disabled'} automod!`);
};

async function toggleAutomod(toggle, settings){
	let status;
	toggle.toLowerCase();
	if(toggle === 'on' || status === 'enable' || status === 'true'){
		return status = true;
	}
	else if(toggle === 'off' || status === 'disable' || status === 'false'){
		return status = false;
	}else {
		status = !settings.automod.enabled;
	}
	await bot.db.settings.update({}, { $set: { 'automod.enabled': status } }, {});
	return status;
}
module.exports.options = {
	name: 'automod',
	description: 'Update automod settings.',
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
};