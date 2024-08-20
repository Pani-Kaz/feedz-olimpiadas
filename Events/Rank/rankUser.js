import { EmbedBuilder } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'view user rank',
    action: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        if (interaction.customId == 'rank-user') {
            let all_posts = client.db.get('images');
            all_posts = Object.entries(all_posts);

            const post_users = all_posts.filter(i => i.author == interaction.user.id);

            let position = client.db.get('events-points');
            position = Object.entries(position)
            position = position.map(data => ({...data[1], id: data[0]}));
            position = position.sort((a, b) => b.points - a.points)
            position = (position.indexOf(position.find(i=> i.id == interaction.user.id)))
            if(position < 0 || !position || isNaN(position)) position = position.length
            else position++

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTitle(`${interaction.user.username} | ${interaction.guild.name}`)
                        .addFields(
                            {
                                name: '👥 Seu usuário',
                                value: `**${interaction.user.username}**\n\`${interaction.user.id}\``
                            },
                            {
                                name: '🎨 Seus pontos',
                                value: `**${client.db.get(`events-points.${interaction.user.id}.points`)} Pontos**`,
                                inline: true
                            },
                            {
                                name: '💻 Postagens totais',
                                value: `**${post_users.length} Postagens**`,
                                inline: true
                            },
                            {
                                name: '📊 Posição no rank',
                                value: `**${position}º lugar**`,
                                inline: true
                            },
                        )
                ],
                ephemeral: true
            })
        }
    }
}