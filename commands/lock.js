const bot = require('../index');
// this should be the intial command to setup the bot up.
module.exports.generator = async (msg) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');

	if(settings.lockdown.locked) return msg.channel.createMessage('The server is already locked down.');

	try {
		let sent = await msg.channel.createMessage('Locking channels...');
		await lockAllPublic(msg, bot);
		await sent.edit('The server is locked.');
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('i Couldnt lock the channels, check my permissions and try again.');
	}
};
async function lockAllPublic(msg, bot){
	let lockedChannels = [];
	msg.channel.guild.channels.forEach(async channel => {
		let everyonePerms = channel.permissionOverwrites.find(c => c.id === msg.channel.guild.id);
		if(everyonePerms && everyonePerms.json.sendMessages ){
			lockedChannels.push(channel.id);
			await channel.editPermission(msg.channel.guild.id, null, 2048, 'role', `Locking the server. ${msg.author.username}#${msg.author.discriminator}`);
			await bot.db.settings.update({}, { $addToSet: { 'lockdown.lockedChannels': channel.id } }, {});
		}
	});
	await bot.db.settings.update({}, { $set: { 'lockdown.locked': true } }, {});
}
module.exports.options = {
	name: 'lock',
	description: 'Lockdown the server.',
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