const url = 'https://customapi.aidenwallis.co.uk/api/v1/misc/coinflip';
const axios = require('axios').default;

module.exports.generator = async (msg) => {
	const sent = await msg.channel.createMessage('Flipping...');
	try {
		const {data} = await axios.get(url);
		return sent.edit(data);   
	} catch (error) {
		await sent.edit('Couldnt find a coin to flip.. :(');
		return console.log(error);
	}
};

module.exports.options = {
	name: 'coinflip',
	description: 'Flip a coin.',
	enabled: true,
};