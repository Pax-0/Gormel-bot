const eris = require('eris');
const bot = require('../index');

module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');
    const sent = await msg.channel.createMessage(`Updating settings...`);
    let query = args.join(' ');
    
    let role = resolveRole(query, msg.channel.guild);
    
    if(!role) return msg.channel.createMessage('I cant find that role.');
    await addModRole(role.id, msg.channel.guild);
    return sent.edit('Updated!');
};

async function addModRole(roleID){
    await bot.db.settings.update({}, { $addToSet: { modRoles: roleID } }, {});
    return;
}
function resolveRole(query, guild){
    //let role = guild.roles.find(r => r.mentionable === true);
    let role = guild.roles.get(query) || guild.roles.find(r => r.name === query) || guild.roles.find(r => r.mention === query)
    return role;
}
module.exports.options = {
    name: 'addmod',
    description: 'Add mod a role.',
    enabled: true,
    argsRequired: true,
    guildOnly: true,
    requirements: {
        custom: async (msg) => {
            const bot = require('../index');
            const settings = await bot.db.settings.findOne({});
            if(settings.owners.includes(msg.author.id)) return true;
            return false;
        }
    }
};