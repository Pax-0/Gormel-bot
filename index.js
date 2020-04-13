const fs = require('fs');
const eris = require('eris');
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


bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
    loadCommands('./commands');
});



async function loadCommands(dir){
    let commands = await fs.readdirSync(dir);
    if(!commands.length) return console.log('Error: no commands found.');
    for(const commandFile of commands){
        let props = require(`./commands/${commandFile}`);
        console.log(`loading ${props.options.name}`)
        if(props.options.enabled){
            bot.registerCommand(props.options.name, props.generator, {});
        }
    };
};

bot.connect();
