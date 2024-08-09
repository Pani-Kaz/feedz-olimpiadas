export default {
    name: 'ready-bot',
    action: 'ready',
    once: true,
    run: async (client) => {
        console.log(`Started at ${new Date().toISOString()} in ${client.user.username}`);
        
    }
}