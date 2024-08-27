import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'like a post',
    action: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId.includes('actions')) {
                const action = interaction.customId.split(' ')[1]
                let idPost = client.db.get('images.' + interaction.message.id);
                if (!idPost) return interaction.reply({ content: `❌ | Não consegui encontrar o post mencionado!`, ephemeral: true });

                let message = `✅ | Você reagiu a publicação de <@${idPost.author}>!`;
                const messageId = interaction.message.id;
                
                if ((idPost?.members || []).includes(interaction.member.id+':'+action)) {
                    client.db.substr(`images.${messageId}.${action}`, 1)
                    idPost?.members.splice(idPost?.members?.indexOf(interaction.member.id+':'+action), 1);
                    client.db.set(`images.${messageId}.members`, idPost.members)
                    message = `✅ | Você removeu a interação da publicação de <@${idPost.author}>!`
                } else {
                    client.db.push(`images.${messageId}.members`, interaction.member.id+':'+action)
                    client.db.add(`images.${messageId}.${action}`, 1)
                }

                const allInteractions = client.db.get('images.' + messageId);
                const allValues = (allInteractions?.like || 0) + (allInteractions?.joy || 0) + (allInteractions?.muscle || 0) + (allInteractions?.yum || 0) + (allInteractions?.rocket || 0);
                if(allInteractions.boost == 'false' && allValues >= 10) {
                    client.db.set('images.' + messageId+'.boost', 'true')
                    const memberRoles = (interaction.member.roles.cache.toJSON()).map(i => i.id);
                    const teams = (Object.entries(config.teams)).map(data => ({name: data[0], ...data[1]}));
                    let userTeam;

                    teams.forEach(t => {
                        if(memberRoles.includes(t.role)) userTeam = t
                    });

                    if(userTeam) {
                        const channel = client.channels.cache.get(userTeam.channel);
                        if(channel)  {
                            const attachment = interaction.message.attachments.first();

                            channel.send({
                                content: `Woww, a publicação feita por <@${idPost.author}> teve um boost de reações!`,
                                files: [new AttachmentBuilder(attachment.attachment)],
                                components: [
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setURL(interaction.message.url)
                                        .setLabel('Ir para publicação original')
                                        .setStyle(ButtonStyle.Link)
                                        .setEmoji('🔗')
                                    )
                                ]
                            })
                        }
                    }
                }

                await interaction.update({
                    components: [
                        new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("actions like")
                            .setLabel(`${client.db.get('images.' + messageId + '.like')}`)
                            .setEmoji("❤")
                            .setStyle(ButtonStyle.Secondary),
                          new ButtonBuilder()
                            .setCustomId("actions joy")
                            .setLabel(`${client.db.get('images.' + messageId + '.joy')}`)
                            .setEmoji("😂")
                            .setStyle(ButtonStyle.Secondary),
                          new ButtonBuilder()
                            .setCustomId("actions muscle")
                            .setLabel(`${client.db.get('images.' + messageId + '.muscle')}`)
                            .setEmoji("💪")
                            .setStyle(ButtonStyle.Secondary),
                          new ButtonBuilder()
                            .setCustomId("actions yum")
                            .setLabel(`${client.db.get('images.' + messageId + '.yum')}`)
                            .setEmoji("😋")
                            .setStyle(ButtonStyle.Secondary),
                          new ButtonBuilder()
                            .setCustomId("actions rocket")
                            .setLabel(`${client.db.get('images.' + messageId + '.rocket')}`)
                            .setEmoji("🚀")
                            .setStyle(ButtonStyle.Secondary)
                        ),
                        new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("delete")
                            .setEmoji("🗑")
                            .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                            .setCustomId("var")
                            .setEmoji("🏁")
                            .setDisabled(client.db.get('images.' + messageId + '.var') == 'true')
                            .setStyle(ButtonStyle.Primary)
                        ),
                      ],
                });

                await interaction.followUp({
                    ephemeral: true,
                    content: message
                }).catch(err => { })
            }
        }
    }
}