import { EmbedBuilder } from "discord.js";

export default {
    name: 'rank',
    description: "Veja o top 10 de usuários",
    run: async (client, inter) => {
        await inter.deferReply({ ephemeral: true });

        let all_posts = client.db.get('images');
        all_posts = Object.entries(all_posts);

        let points = client.db.get('events-points');
        points = Object.entries(points);
        points = points.map(i => ({id:i[0], ...i[1]}))
        points = points.sort((a,b) => b.points - a.points).splice(0, 10);
        points = points.map(i => ({...i, posts: all_posts.filter(j=> j[1].author == i.id).length}))

        inter.editReply({
            embeds: [
                new EmbedBuilder ()
                .setColor('Blue')
                .setTitle('Rank | ' + inter.guild.name)
                .setThumbnail(inter.guild.iconURL())
                .setDescription(`${points.map((d, i) => `${i + 1}º - <@${d.id}> (ID: ${d.id})\n💻 Total de pontos: **${d.points} pontos**\n🎨 Total de postagens: **${d.posts} imagens**`).join('\n\n')}`)
            ]
        })
    }
}