const ms = require('ms');

function resolveMember(string, guild){
	let member = guild.members.get(string) || guild.members.find(m => m.user.mention === string) || guild.members.find(m => m.username === string) || guild.members.find(m => m.nick === string);
	return member;
}
async function resolveUser(string, bot){
	let user = bot.users.get(string) || bot.users.find(m => m.mention === string) || bot.users.find(m => m.username === string) || await bot.getRESTUser(string);

	return user;
}
async function loadDefaultDbSettings(bot){
	const doc = {
		setup: false,
		mainGuildID: null,
		owners: ['143414786913206272'],
		modRoles: [],
		mutedRole: null,
		modLogs: [],
		modLogChannel: null,
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
	console.log(settings);
	if(!settings) return loadDefaultDbSettings(bot);
}
async function getDBSettings(bot){
	const settings = await bot.db.settings.findOne({});
	if(!settings) return;

	return settings;
}
async function setUpMutedSystem(guild, settings, bot){
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
async function logCase(guild, modLog, settings, bot){
	let modLogChannel = guild.channels.get(settings.modLogChannel);
	let offender = await resolveUser(modLog.userID, bot);
	let mod = await resolveMember(modLog.mod, guild);
	if(!modLogChannel) return;

	const logEmbed = {
		author: { // Author property
			name: offender.username,
			icon_url: offender.avatarURL
		},
		title: `Case | ${modLog.caseType} | ${offender.username}#${offender.discriminator}`,
		fields: [{
			name: 'Moderator',
			value: mod.mention,
			inline: true
		}, {
			name: 'User',
			value: offender.mention,
			inline: true
		}, {
			name: 'Reason', 
			value: modLog.reason,
			inline: true
		}],
		timestamp: new Date().toISOString(),
	};
	if(modLog.caseType !== 'Kick' && modLog.caseType !== 'Unmute') logEmbed.fields.push({
		name: 'Duration',
		value: ms(modLog.duration, { long: true }) ? ms(modLog.duration, { long: true }) : 'Permenant',
		inline: true
	}); 

	await bot.db.settings.update({}, { $addToSet: { modlogs: modLog } }, {});
	return modLogChannel.createMessage({embed: logEmbed});
}
async function unmute(guild, settings, modLog, bot){
	let modLogChannel = guild.channels.get(settings.modLogChannel);
	let offender = await resolveMember(modLog.userID, guild);
	// let mod = await resolveMember(modLog.mod, guild);
	if(!modLogChannel) return;
	const logEmbed = {
		author: { // Author property
			name: offender.username,
			icon_url: offender.avatarURL
		},
		title: `Case | ${modLog.caseType} | ${offender.username}#${offender.discriminator}`,
		fields: [{
			name: 'Moderator',
			value: bot.user.mention,
			inline: true
		}, {
			name: 'User',
			value: offender.mention,
			inline: true
		}, {
			name: 'Reason', 
			value: modLog.reason,
			inline: true
		}],
		timestamp: new Date().toISOString(),
	};
	await offender.removeRole(settings.mutedRole);
	return modLogChannel.createMessage({embed: logEmbed});
}
function getDuration(string){
	// unfinished, need to determain duration and account for reason being in the way.
	const duration = ms(string);

	return duration;
}
module.exports = {
	resolveMember,
	resolveUser,
	loadDefaultDbSettings,
	checkDBSettings,
	getDBSettings,
	setUpMutedSystem,
	logCase,
	unmute,
	getDuration
};