const fs = require('fs');
const eris = require('eris');
// const utils = require('./structures/utils');
const Datastore = require('nedb-promises');

// const insertSetting = util.promisify(bot.db.settings.findOne);
// const findSetting = util.promisify(bot.db.settings.findOne);

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
    console.log(`Logged is as ${bot.user.username}!`); // Log "Ready!"
    await loadCommands('./commands');
    await loadEvents('./events');
    loadDB(bot);
    checkDBSettings(bot);
});

async function loadDB(bot){
    const settingsStore = Datastore.create('./data/settings.db');
    const usersStore = Datastore.create('./data/users.db');
    bot.db = {
        users: usersStore,
        settings: settingsStore
    };
    await bot.db.users.load();
    await bot.db.settings.load();
    return console.log('Connected to DB!');
}

async function checkDBSettings(bot){
    const settings = await bot.db.settings.findOne({});
    // console.log(settings);
    if(!settings){
        console.log('Bot settings not found, inserting empty settings please use the setup command.');
        const doc = {
            automod: {
                enabled: false,
                bannedWords: [],
                blackListedLinks: [],
                mutedRole: null,
            }
        } // add the doc if it dosnt exist already.
        await bot.db.settings.insert(doc);
        return;
    }
    return;
}
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
