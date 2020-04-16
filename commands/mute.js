const utils = require('../structures/utils');

module.exports.generator = async (msg, args) => {
	let member = utils.resolveMember(args[0], msg);
    if(!member) return msg.channel.createMessage('I couldnt find that user.');
    let reason = args.length > 1 ? args.slice(1).join(' ') : 'Not specified.';
    let settings = await utils.getDBSettings(bot);
    if(!settings){
        console.log('Error: cant locate bot settings!');
        return msg.channel.createMessage('There was an error during excution.');
    }
    if(!settings.mutedRole){
        await utils.setUpMutedSystem(msg.channel.guild, settings);
        settings = await utils.getDBSettings(bot);
    }
    const mutedCase = {
        userID: member.id,
        duration: 5000, // need a way to figure out the duration
        reason: reason,
        mod: msg.author.id,
        time: Date.now()
    }
	try {
        await member.addRole(settings.mutedRole, `Moderator: ${msg.member.username}#${msg.member.discriminator}\nReason: ${reason}`);
        await bot.db.settings.update({}, { $addToSet: { muted: {mutedCase} } }, {});
        await bot.db.settings.update({}, { $addToSet: { modlogs: {mutedCase} } }, {});
		return msg.channel.createMessage(`${member.username}#${member.discriminator} was Muted!`);
	} catch (error) {
		console.log(error);
		return msg.channel.createMessage('I couldnt mute that user, check my role\'s position and try again.');
	}

};

module.exports.options = {
	name: 'mute',
	description: 'Mute a member for a certain period of time.',
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