const doggoAPI = 'https://api.thedogapi.com/v1/images/search';
const axios = require('axios').default;
const {doggoAPIKey} = require('../tokens.json');
axios.defaults.headers['x-api-key'] = doggoAPIKey;
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
		const {data} = await axios.get(doggoAPI);
		ImageEmbed.image.url = data[0].url;
		return sent.edit({content: 'Found one!' , embed: ImageEmbed});
	} catch (error) {
		await sent.edit('Couldnt find a doggo.. :(');
		return console.log(error);
	}
};

module.exports.options = {
	name: 'doggo',
	description: 'Get a cute doggo',
	enabled: true,
	fullDescription:'Sends a random picture of a dog.',
	usage:'',
};