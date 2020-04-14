const eris = require('eris');
const bot = require('../index');

module.exports.generator = async (msg, args) => {
    const settings = await bot.db.settings.findOne({});
    if(!args.length) return msg.channel.createMessage('Please choose an option.');
    if(!settings) return msg.channel.createMessage('Unable to locate bot settings..');
    const sent = await msg.channel.createMessage(`Updating settings...`);
    await toggleAutomod(toggle, settings)
    return sent.edit('Updated!');
};

async function toggleAutomod(toggle, settings){
    let status;
    toggle.toLowerCase();
    if(toggle === 'on' || status === 'enabled' || status === 'true'){
        return status = true;
    }
    else if(toggle === 'off' || status === 'disable' || status === 'false'){
        return status = false;
    }else {
        status = !settings.automod.enabled;
    }
    await bot.db.settings.update({}, { $set: { 'automod.enabled': status } }, {});
    return;
}
module.exports.options = {
    name: 'automod',
    description: 'Update automod settings.',
    enabled: true
};