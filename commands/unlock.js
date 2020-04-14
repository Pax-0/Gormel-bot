const eris = require('eris');
const bot = require('../index');
// this should be the intial command to setup the bot up.
module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');

    if(!settings.lockdown.locked) return msg.channel.createMessage('The server isnt locked down.');

    try {
        let sent = await msg.channel.createMessage('Unlocking channels...');
        await unLockAllPublic(msg, bot, settings);
        await sent.edit('Server unlocked!');
    } catch (error) {
        console.log(error);
        return msg.channel.createMessage('i Couldnt unlock the channels, check my permissions and try again.');
    }
};
async function unLockAllPublic(msg, bot, settings){
    let lockedChannels = settings.lockdown.lockedChannels;
    if(lockedChannels && lockedChannels.length){
        lockedChannels.forEach(async lockedChannelID => {
            let channel = msg.channel.guild.channels.get(lockedChannelID);
            let everyonePerms = channel.permissionOverwrites.find(c => c.id === msg.channel.guild.id);

            if(channel && everyonePerms && !everyonePerms.json.sendMessages ){
                lockedChannels.shift();
                await channel.editPermission(msg.channel.guild.id, 2048, null, 'role', `Unlocking the server. Mod: ${msg.author.username}#${msg.author.discriminator}`);
                await bot.db.settings.update({}, { $pull: { 'lockdown.lockedChannels': channel.id } }, {});
            }
        });
        await bot.db.settings.update({}, { $set: { 'lockdown.locked': false } }, {});
        return;
    }
}
module.exports.options = {
    name: 'unlock',
    description: 'Unlock the server.',
    enabled: true,
};