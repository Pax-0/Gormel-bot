const fs = require('fs');
const eris = require('eris');
const Datastore = require('nedb-promises');
const cron = require('node-cron');
const utils = require('./structures/utils');
// console.log(utils);
const {token, prefix} = require('./tokens.json');
const clientOptions = {
	autoreconnect: true,
	getAllUsers: true,
	restMode: true,
	defaultImageFormat: 'png',

};
const commandOptions = {
	description: 'a custom moderation bot',
	name: 'Gormel-bot',
	owner: 'Gormel',
	prefix: ['@mention', prefix],
};

const bot = new eris.CommandClient(token, clientOptions, commandOptions);


bot.on('ready', async () => { // When the bot is ready
	console.log(`Logged is as ${bot.user.username}!`); // Log "Ready!"
	await loadCommands('./commands');
	await loadEvents('./events');
	await loadDB(bot);
	await utils.checkDBSettings(bot);
	await startMutedCheckCronJob(bot);
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
		let command = require(`./commands/${commandFile}`);
		if(command.options.enabled && command.options.hasSubCommands && command.options.subCommands.length ){
			console.log(`loading parent command: ${command.options.name}`);
			let parent = await bot.registerCommand(command.options.name, command.generator, command.options);
			command.options.subCommands.forEach(async element => {
				console.log(`loading sub command: ${command.options.name}`);
				let subcmd = require(`./commands/${command.options.name}_${element}`);
				await parent.registerSubcommand(element, subcmd.generator, subcmd.options);    
			});
		}
		else if(command.options.enabled){
			console.log(`loading command: ${command.options.name}`);
			await bot.registerCommand(command.options.name, command.generator, command.options);
		}
	}
}
async function startMutedCheckCronJob(bot){
	const settings = await bot.db.settings.findOne({})
	if(!settings) return console.log('Error: Settings file not found!');

	cron.schedule('* * * * *', async () => {
		if(!settings.muted.length || !settings.mainGuildID || !settings.mutedRole) return;
		for(const mutedCase of settings.mutedUsers){
			const guild = bot.guilds.get(settings.mainGuildID);
			let member = await utils.resolveMember(mutedCase.userID, guild);
			if(!member) return;
			if(Date.now() - mutedCase.time > mutedCase.duration){
				await member.removeRole(settings.mutedRole);
				return bot.db.settings.update({}, { $pull: { 'settings.mutedUsers': mutedCase } }, {});
			}
			return;
		}
		// console.log('running a task every minute to check for muted status!');
	  });
}

bot.connect();

module.exports = bot;
