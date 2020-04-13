const fs = require('fs');
const eris = require('eris');
const Utils = require('./structures/utils');

const {token, prefix} = require('./config.json');
const clientOptions = {
    autoreconnect: true,
    getAllUsers: true,
    restMode: true,
    defaultImageFormat: 'png',

}
const commandOptions = {
    defaultHelpCommand: true,
    description: 'a custom moderation bot',
    ignoreBots: true,
    name: 'Gormel-bot',
    owner: 'Gormel',
    prefix: ['@mention', prefix]
};

const bot = new eris.CommandClient(token, clientOptions, commandOptions)


bot.on("ready", async () => { // When the bot is ready
    console.log(`Logged is as ${bot.user.username}`); // Log "Ready!"
    await loadCommands('./commands');
    await loadEvents('./events')
});


async function loadEvents(dir){
    let events = await fs.readdirSync(dir);
    if(!events.length) return console.log('No events found!');

    for(const eventFile of events){
        let event = require(`./events/${eventFile}`);
        // console.log(`loading event: ${event.event}`)
        // console.log(eventFile);
        if (event.enabled) {
            bot[event.once ? 'once' : 'on'](event.event, event.handler);
            console.log('Loaded handler for ' + event.event);
        }
    };
}
async function loadCommands(dir){
    let commands = await fs.readdirSync(dir);
    if(!commands.length) return console.log('Error: no commands found.');
    for(const commandFile of commands){
        let props = require(`./commands/${commandFile}`);
        console.log(`loading command: ${props.options.name}`)
        if(props.options.enabled){
            bot.registerCommand(props.options.name, props.generator, {});
        }
    };
};

bot.connect();

module.exports = bot;
