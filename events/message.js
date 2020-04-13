const bot = require('../index');
const config = require('../config.json');
var URLRegex = new RegExp(/((http(s)?(\:\/\/))+(www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -]/);

async function handler(msg){
    await checkMessageForBannedWords(msg);
    await checkMessageForBlackListedLink(msg);
    return;
}

async function checkMessageForBannedWords(msg){
    let settings = await bot.db.settings.findOne({});
    if(!settings) return console.log('Cant locate settings file!');

    const bannedWords = settings.automod.bannedWords;
    if(!bannedWords.length) return;

    for(const bannedWord of bannedWords){
        if(msg.content.includes(bannedWord)){
            let sent = await msg.channel.createMessage(`${msg.author.mention} Thats a banned word.`)
            await msg.delete('contains banned word.');
            setTimeout(await function(){ sent.delete() }, 3000);
        }
        return;
    }
}

async function checkMessageForBlackListedLink(msg){
    let settings = await bot.db.settings.findOne({});
    if(!settings) return console.log('Cant locate settings file!');
    
    let url = msg.content.match(URLRegex);
    if(url){
        console.log('message has a url!', url)
        const blackListedLinks = settings.automod.blackListedLinks;
        if(!blackListedLinks.length) return;

        if(blackListedLinks.includes(url[0]) || blackListedLinks.includes(url[1])){
            let sent = await msg.channel.createMessage(`${msg.author.mention} Thats a black-listed link.`)
            await msg.delete('contains blacklisted link.');
            setTimeout(await function(){ sent.delete() }, 3000);
        }
        return;
    }
}
module.exports = {
    event: 'messageCreate',
    enabled: true,
    handler: handler,
}