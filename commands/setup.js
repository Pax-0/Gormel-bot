const eris = require('eris');
const bot = require('../index');
// this should be the intial command to setup the bot up.
module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');

    try {
        await bot.db.settings.update({}, { $set: { 'automod.enabled': true } }, {});
        await bot.db.settings.update({}, { $set: { setup: true } }, {});
        await setUpMutedSystem(msg, settings);
        await msg.channel.createMessage('Setup complete!');
    } catch (error) {
        console.log(error);
        return msg.channel.createMessage('There was an error during setup :( ');
    }
};
async function setUpMutedSystem(msg, settings){
    if(settings.mutedRole) return;
    const options = {
        name: 'Muted',
        permissions: 0,
        color: '808080'
    }
    let role = await msg.channel.guild.createRole(options, 'Creating muted role.');
    msg.channel.guild.channels.forEach(async channel => {
        await channel.editPermission(role.id, null, 2048, 'role', 'Creating muted role.');
    });

    await bot.db.settings.update({}, { $set: { mutedRole: role.id } }, {});
}
module.exports.options = {
    name: 'setup',
    description: 'Starts the bot setup.',
    enabled: true,
    // argsRequired: true
};