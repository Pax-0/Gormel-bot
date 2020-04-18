const url = 'https://icanhazdadjoke.com/slack';
const axios = require('axios').default;
// const dadjokes = require('../dadjokes.json');

module.exports.generator = async (msg) => {
	try {
		let {data} = await axios.get(url);
		const dadjoke = data.attachments[0].text;
		await msg.channel.createMessage(dadjoke);
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