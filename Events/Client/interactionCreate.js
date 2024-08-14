export default {
    name: 'commands',
    action: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        const commandName = interaction.commandName;
        const command = client.commands.find((c) => c.name === commandName);
         if (interaction.isCommand()) {
            await command?.run(client, interaction);
        }
    }
}