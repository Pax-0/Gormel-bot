const bot = require('../index');
const URLRegex = new RegExp(/((http(s)?(:\/\/))+(www\.)?([\w\-./])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:?!@^$ -]/);

async function handler(msg){
	let settings = await bot.db.settings.findOne({});
	if(!settings) return console.log('Cant locate settings file!');

	if( settings.owners.includes(msg.author.id) || settings.modRoles.some(modRole => msg.member.roles.includes(modRole)) ) return;
	await checkMessageForBannedWords(msg, settings);
	await checkMessageForBlackListedLink(msg, settings);
	return;
}

async function checkMessageForBannedWords(msg, settings){
	const bannedWords = settings.automod.bannedWords;
	if(!bannedWords.length) return;

	for(const bannedWord of bannedWords){
		if(msg.content.includes(bannedWord)){
			let sent = await msg.channel.createMessage(`${msg.author.mention} Thats a banned word.`);
			await msg.delete('contains banned word.');
			setTimeout(await function(){ sent.delete(); }, 3000);
		}
		return;
	}
}

async function checkMessageForBlackListedLink(msg, settings){
	let url = msg.content.match(URLRegex);
	if(url){
		const blackListedLinks = settings.automod.blackListedLinks;
		if(!blackListedLinks.length) return;

		if(blackListedLinks.includes(url[0]) || blackListedLinks.includes(url[1])){
			let sent = await msg.channel.createMessage(`${msg.author.mention} Thats a black-listed link.`);
			await msg.delete('contains blacklisted link.');
			setTimeout(await function(){ sent.delete(); }, 3000);
		}
		return;
	}
}
module.exports = {
	event: 'messageCreate',
	enabled: true,
	handler: handler,
};