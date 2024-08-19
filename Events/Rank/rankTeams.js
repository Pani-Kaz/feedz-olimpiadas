import { EmbedBuilder } from "discord.js";
import config from "../../config/config.js";

const colorMap = {
    yellow: 'Amarelos 🟡',
    red: 'Vermelhos 🔴',
    blue: 'Azuis 🔵',
    green: 'Verdes 🟢',
    purple: 'Roxos 🟣',
    orange: 'Laranjas 🟠'
};

export default {
    name: 'view team rank',
    action: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        if (interaction.customId == 'rank-team') {
            await interaction.deferReply({ephemeral: true})
            await interaction.guild.members.fetch();

            const members = [];
            const teams = Object.entries(config.teams);

            for (let i = 0; i < teams.length; i++) {
                const team = teams[i];
                const role = interaction.guild.roles.cache.get(team[1].role);
                const users = (role.members.toJSON()).map(i => i.id);
                
                let all_posts = client.db.get('images');
                all_posts = Object.entries(all_posts);
    
                const post_users = all_posts.filter(i => users.includes(i.author));
                let points = client.db.get('events-points');
                points = Object.entries(points)
                points = points.filter(i => users.includes(i[0]))

                members.push({
                    points: points.reduce((acc, act) => acc + act[1].points, 0),
                    posts: post_users.length,
                    team: team[0]
                })
            }

            interaction.editReply({
                embeds: [
                    new EmbedBuilder ()
                    .setColor('Blue')
                    .setTitle(interaction.guild.name)
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(`${members.sort(((a,b) => b.points - a.points)).map((d, i) => `${(i == 0 || i == 1 || i == 2) ? '##' : '-'} ${i + 1}º - **${colorMap[d.team]}**\n💻 Total de pontos: **${d.points} pontos**\n🎨 Total de postagens: **${d.posts} imagens**`).join('\n\n')}`)
                ]
            })
        }
    }
}