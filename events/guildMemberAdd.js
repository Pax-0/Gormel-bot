const utils = require('../structures/utils');
const bot = require('../index');
function handler(guild, member){
	return persistMute(member);
}  
async function persistMute(member){
	const settings = await utils.getDBSettings(bot);
	if(!settings) return console.log('Error: settings not found!');
    
	if(settings.muted.find(m => m.userID === member.id)){
		return member.addRole(settings.mutedRole);
	}
}
module.exports = {
	event: 'guildMemberAdd',
	enabled: true,
	handler: handler,
};
