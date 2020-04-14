function handler(message){
    let test;
    return console.log(message);
    }
    
    module.exports = {
        event: 'warn',
        enabled: true,
        handler: handler,
    }
