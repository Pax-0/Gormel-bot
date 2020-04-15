
class Utils {
	constructor(){
	}
	resolveMember(string, msg){
		let member = msg.channel.guild.members.get(string) || msg.channel.guild.members.find(m => m.user.mention === string) || msg.channel.guild.members.find(m => m.username === string) || msg.channel.guild.members.find(m => m.nick === string);
		return member;
	}
}
module.exports = Utils;