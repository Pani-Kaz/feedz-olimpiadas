import { EmbedBuilder } from 'discord.js';
import config from '../../config/config.js'

const getColorByName = (colorName) => {
    const colorMap = {
        "yellow": "#FFFF00",
        "red": "#FF0000",
        "blue": "#0000FF",
        "green": "#008000",
        "purple": "#800080",
        "orange": "#FFA500"
    }
    return colorMap[colorName] || '#000000';
};

const colorMap = {
    yellow: 'amarela',
    red: 'vermelha',
    blue: 'azul',
    green: 'verde',
    purple: 'roxa',
    orange: 'laranja'
};

export default {
    name: 'select-teams',
    action: 'guildMemberAdd',
    once: false,
    run: async (client, member) => {
        try {
            const guild = client.guilds.cache.get(config.guild)
            const members = await guild.members.fetch();
            let dataTeams = Object.entries(config.teams).map(team => ({ id: team[0], members: 0, ...team[1] }));

            for (const team of dataTeams) {
                team['members'] = (members.filter(i => i.roles.cache.get(team.role))).size
            };

            dataTeams = dataTeams.sort((a, b) => a.members - b.members);
            const userTeam = dataTeams[0];
            member.roles.add(userTeam.role);

            const backgroundColor = getColorByName(userTeam.id);
   
            member.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(backgroundColor)
                    .setDescription(`${member.user.toString()} Você foi selecionado para a equipe: ${colorMap[userTeam.id]}! \n### Informações importantes:\n- Dê um oi para os colegas de sua equipe, vá para o canal <#${userTeam.channel}>\n- Leia <#${config.channels.info}> para entender sobre o evento, boa sorte! 🤝`)
                    .setAuthor({
                        name: member.guild.name,
                        iconURL: member.guild.iconURL()
                    })
                ],
            }).catch(err => {})

            client.channels.cache.get(config.logs.times).send({ content: `O usuário ${member.user.username} (\`${member.user.id}\`) foi selecionado para a equipe ${colorMap[userTeam.id]}` })

        } catch (err) {
            console.log(err)
        }
    }
};