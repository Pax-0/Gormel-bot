const url = 'https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,racist&?type=twopart';
const axios = require('axios').default;

module.exports.generator = async (msg) => {
	const sent = await msg.channel.createMessage('Loading joke...');
	try {
		const { data } = await axios.get(url);
		let joke = data.type === 'twopart' ? `${data.setup}\n\n${data.delivery}` : data.joke;
		return sent.edit(joke);
	} catch (error) {
		await msg.channel.createMessage('Couldnt find a joke :(');
		return console.log(error);
	}
};

module.exports.options = {
	name: 'joke',
	description: 'Get a random joke.',
	enabled: true,
	fullDescription:'Sends a random joke in the chat.',
	usage:'',
};