const bot = require('../index');

function resolveMember(string, guild){
		let member = guild.members.get(string) || guild.members.find(m => m.user.mention === string) || guild.members.find(m => m.username === string) || guild.members.find(m => m.nick === string);
		return member;
	};
	async function loadDefaultDbSettings(bot){
			const doc = {
				setup: false,
				mainGuildID: null,
				owners: ['143414786913206272'],
				modRoles: [],
				mutedRole: null,
				modLogs: [],
				muted: [],
				automod: {
					enabled: false,
					bannedWords: [],
					blackListedLinks: [],
				},
				lockdown:{
					locked: false,
					lockedChannels: [],
				}
			}; // add the doc if it dosnt exist already.
			await bot.db.settings.insert(doc);
			return;
	}
	async function checkDBSettings(bot){
		const settings = await bot.db.settings.findOne({});
		if(!settings) return loadDefaultDbSettings(bot);
	}
	async function getDBSettings(bot){
		const settings = await bot.db.settings.findOne({});
		if(!settings) return;

		return settings;
	}
	async function setUpMutedSystem(guild, settings){
		if(settings.mutedRole) return;
		const options = {
			name: 'Muted',
			permissions: 0,
			color: '808080'
		};
		let role = await guild.createRole(options, 'Creating muted role.');
		guild.channels.forEach(async channel => {
			await channel.editPermission(role.id, null, 2048, 'role', 'Creating muted role.');
		});
	
		return bot.db.settings.update({}, { $set: { mutedRole: role.id } }, {});
	}
	module.exports = {
	resolveMember,
	loadDefaultDbSettings,
	checkDBSettings,
	getDBSettings,
	setUpMutedSystem
};