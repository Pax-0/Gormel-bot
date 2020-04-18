const dadjokesJson = require('../dadjokes.json');

const dadjokes = Object.entries(dadjokesJson);
module.exports.generator = async (msg) => {
	let random = dadjokes[Math.floor(Math.random() * dadjokes.length)];
	try {

		await msg.channel.createMessage(random[1]);
	} catch (error) {
		await msg.channel.createMessage('Couldnt find a dadjoke :(');
		return console.log(error);
	}
};

module.exports.options = {
	name: 'dadjoke',
	description: 'Get a random dadjoke.',
	enabled: true,
	fullDescription:'Want a random dadjoke? cuz i dont, but if you do, then use this command.',
	usage:'',
};