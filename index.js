const fs = require('fs');
const eris = require('eris');
const Datastore = require('nedb-promises');

const {token, prefix} = require('./tokens.json');
const clientOptions = {
	autoreconnect: true,
	getAllUsers: true,
	restMode: true,
	defaultImageFormat: 'png',

};
const commandOptions = {
	defaultHelpCommand: true,
	description: 'a custom moderation bot',
	ignoreBots: true,
	name: 'Gormel-bot',
	owner: 'Gormel',
	prefix: ['@mention', prefix]
};

const bot = new eris.CommandClient(token, clientOptions, commandOptions);


bot.on('ready', async () => { // When the bot is ready
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
	// console.log(bot.commands)
	return console.log('Connected to DB!');
}

async function checkDBSettings(bot){
	const settings = await bot.db.settings.findOne({});
	// console.log(settings);
	if(!settings){
		console.log('Bot settings not found, inserting default settings please use the setup command.');
		const doc = {
			setup: false,
			owners: ['143414786913206272'],
			modRoles: [],
			automod: {
				enabled: false,
				bannedWords: [],
				blackListedLinks: [],
			},
			lockdown:{
				locked: false,
				lockedChannels: [],
			},
			mutedRole: null,
		}; // add the doc if it dosnt exist already.
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
	}
}
async function loadCommands(dir){
	let commands = await fs.readdirSync(dir);
	if(!commands.length) return console.log('Error: no commands found.');
	for(const commandFile of commands){
		let props = require(`./commands/${commandFile}`);
		if(props.options.enabled && props.options.hasSubCommands && props.options.subCommands.length ){
			console.log(`loading command: ${props.options.name}`);
			let parent = await bot.registerCommand(props.options.name, props.generator, props.options);
			props.options.subCommands.forEach(async element => {
				console.log(`loading sub command: ${props.options.name}`);
				let subcmd = require(`./commands/${props.options.name}_${element}`);
				await parent.registerSubcommand(element, subcmd.generator, subcmd.options);    
			});
		}
		else if(props.options.enabled){
			await bot.registerCommand(props.options.name, props.generator, props.options);
		}
	}
}

bot.connect();

module.exports = bot;
