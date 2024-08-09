import fs from 'fs';

export async function eventsLoad (client) {
    const eventsSubPath =  fs.readdirSync('./Events');
    eventsSubPath.forEach(eventSubPath => {
        const events = fs.readdirSync(`./Events/${eventSubPath}`);
        events.forEach(async event => {
            const eventFile = (await import(`../Events/${eventSubPath}/${event}`))?.default;

            if(eventFile.once) client.once(eventFile.action, eventFile.run);
            else client.on(eventFile.action, ((...e) => eventFile.run(client, e)))   
        })
    })
}
