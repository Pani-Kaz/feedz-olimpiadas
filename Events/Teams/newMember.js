import { AttachmentBuilder } from 'discord.js';
import config from '../../config/config.js'
import { createCanvas, loadImage } from 'canvas'

const getColorByName = (colorName) => {
    const colorMap = {
        yellow: 'rgba(255, 255, 0, 0.5)',
        red: 'rgba(255, 0, 0, 0.5)',
        blue: 'rgba(0, 0, 255, 0.5)',
        green: 'rgba(0, 128, 0, 0.5)',
        purple: 'rgba(128, 0, 128, 0.5)',
        orange: 'rgba(255, 165, 0, 0.5)'
    };
    return colorMap[colorName] || 'rgba(0, 0, 0, 0.5)';
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

            const canvas = createCanvas(800, 400);
            const ctx = canvas.getContext('2d');

            const backgroundColor = userTeam.id;
            ctx.fillStyle = getColorByName(backgroundColor);
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(await loadImage('./bases/welcome.png'), 0, 0);

            const circle = {
                x: canvas.width / 2,
                y: 40 + 88.5,
                radius: 88.5,
            }
            ctx.save()
            const avatarURL = member.displayAvatarURL().replace('webp', 'png');
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const avatar = await loadImage(avatarURL);

            const aspect = avatar.height / avatar.width;

            const hsx = circle.radius * Math.max(1.0 / aspect, 1.0);
            const hsy = circle.radius * Math.max(aspect, 1.0);

            ctx.drawImage(avatar, circle.x - hsx, circle.y - hsy, hsx * 2, hsy * 2)
            ctx.restore()

            ctx.font = 'extrabold 48px Arial';
            ctx.fillStyle = userTeam.id;
            ctx.textAlign = 'center';
            ctx.fillText(colorMap[userTeam.id].toUpperCase(), canvas.width / 2, 307 + 53 - 7.5);

            const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });

            member.send({
                content: `# Você foi selecionado para a equipe: ${colorMap[userTeam.id]}\n## Informações importantes:\n- Dê um oi para os colegas de sua equipe, vá para o canal <#${userTeam.channel}>\n- Leia <#${config.channels.info}> para entender sobre o evento, boa sorte! 🤝`,
                files: [attachment]
            }).catch(err => {})

            client.channels.cache.get(config.logs.times).send({ content: `O usuário ${member.user.username} (\`${member.user.id}\`) foi selecionado para a equipe ${colorMap[userTeam.id]}` })

        } catch (err) {
            console.log(err)
        }
    }
};