import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'send a event',
    action: 'ready',
    once: true,
    run: async (client) => {
        const channel = client.channels.cache.get(config.channels.ranks);
        const lastMessages = await channel.messages.fetch();
        
        if(lastMessages.size < 1) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor('#FA8072')
                    .setAuthor({
                        name: channel.guild.name,
                        iconURL: channel.guild.iconURL()
                    })
                    .setFooter({
                        text: 'Utilize os botões abaixo para visualizar o rank.'
                    })
                ],
                components: [
                    new ActionRowBuilder ()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('rank-user')
                        .setLabel(' Veja seu rank')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('👥'),
                        new ButtonBuilder()
                        .setCustomId('rank-team')
                        .setLabel(' Rank da equipe')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🤝'),
                    )
                ]
            })
        }
    }
}