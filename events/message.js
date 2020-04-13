const bot = require('../index');
const config = require('../config.json')

module.exports = {
    event: 'messageCreate',
    enabled: true,
    handler: (msg) => {
        if(msg.author.bot) return;
        console.log('New message recieved!', msg);
    }
}