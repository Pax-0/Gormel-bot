async function handler(message){
    return console.log(message)
    }
    
    module.exports = {
        event: 'warn',
        enabled: true,
        handler: handler,
    }