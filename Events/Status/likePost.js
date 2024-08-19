import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'like a post',
    action: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId == 'like') {
                let idPost = client.db.get('images.' + interaction.message.id);
                if (!idPost) return interaction.reply({ content: `❌ | Não consegui encontrar o post mencionado!`, ephemeral: true });

                let message = `✅ | Você curtiu a publicação de <@${idPost.author}>!`;
                const messageId = interaction.message.id;
                
                if ((idPost?.members || []).includes(interaction.member.id)) {
                    client.db.substr(`images.${messageId}.likes`, 1)
                    idPost?.members.splice(idPost?.members?.indexOf(interaction.member.id), 1);
                    client.db.set(`images.${messageId}.members`, idPost.members)
                    message = `✅ | Você removeu a curtida da publicação de <@${idPost.author}>!`
                } else {
                    client.db.push(`images.${messageId}.members`, interaction.member.id)
                    client.db.add(`images.${messageId}.likes`, 1)
                }

                await interaction.update({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('like')
                                    .setLabel(`${client.db.get('images.' + messageId + '.likes')}`)
                                    .setEmoji('❤')
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId('delete')
                                    .setEmoji('🗑')
                                    .setStyle(ButtonStyle.Danger)
                            )
                    ]
                });

                await interaction.followUp({
                    ephemeral: true,
                    content: message
                }).catch(err => { })
            }
        }
    }
}