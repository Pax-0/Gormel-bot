const catAPI = 'https://api.thecatapi.com/v1/images/search';
const axios = require('axios').default;
const {catAPIKey} = require('../tokens.json');
axios.defaults.headers['x-api-key'] = catAPIKey;
module.exports.generator = async (msg) => {
	const sent = await msg.channel.createMessage('Looking for a cute doggo...');
	const ImageEmbed = {
		author: { // Author property
			name: msg.author.username,
			icon_url: msg.author.avatarURL
		},
		image: {
			url: null,
		}
		
	};
	try {
		let {data} = await axios.get(catAPI);
		ImageEmbed.image.url = data[0].url;
		return sent.edit({content: 'Found one!' , embed: ImageEmbed});
	} catch (error) {
		await msg.createMessage('i coudlnt find one... :( ');
		console.log(error);
	}

};

module.exports.options = {
	name: 'cat',
	description: 'Get a cute cat',
	enabled: true,
};