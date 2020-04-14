
module.exports.generator = async (msg) => {
	// console.log(msg, args);
	await msg.channel.createMessage('Pong!');
};

module.exports.options = {
	name: 'pong',
	description: 'ping pong it!',
	enabled: true,
	isSubCommand: true
};