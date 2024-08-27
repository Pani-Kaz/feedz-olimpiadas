import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    name: 'rank',
    description: "Veja o top 10 de usuários",
    run: async (client, inter) => {
        await inter.deferReply({ ephemeral: true });

        let all_posts = client.db.get('images');
        all_posts = Object.entries(all_posts);

        let points = client.db.get('events-points');
        points = Object.entries(points);
        points = points.map(i => ({id:i[0], ...i[1]}));
        points = points.sort((a,b) => b.points - a.points);

        const pageSize = 5;
        let currentPage = 0;
        const totalPages = Math.ceil(points.length / pageSize);

        const generateEmbed = (page) => {
            const start = page * pageSize;
            const end = start + pageSize;
            const pagePoints = points.slice(start, end);
            return new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`Rank | ${inter.guild.name}`)
                .setThumbnail(inter.guild.iconURL())
                .setDescription(pagePoints.map((d, i) => 
                    `- <@${d.id}> (ID: ${d.id})\n💻 Total de pontos: **${d.points} pontos**\n🎨 Total de postagens: **${all_posts.filter(j => j[1].author == d.id).length} imagens**`
                ).join('\n\n'))
                .setFooter({ text: `Página ${page + 1} de ${totalPages}` });
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('◀️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages - 1)
            );

        const message = await inter.editReply({
            embeds: [generateEmbed(currentPage)],
            components: [row]
        });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== inter.user.id) return;

            if (i.customId === 'prev' && currentPage > 0) {
                currentPage--;
            } else if (i.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
            }

            const updatedRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('◀️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === totalPages - 1)
                );

            await i.update({
                embeds: [generateEmbed(currentPage)],
                components: [updatedRow]
            });
        });
    }
}
