import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'like a post',
    action: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        if(interaction.isButton()) {
            if(interaction.customId.includes('like')) {
                let idPost = client.db.get('images.'+interaction.customId.split(' ')[1]);
                if(!idPost) return interaction.reply({content: `❌ | Não consegui encontrar o post mencionado!`, ephemeral: true});

                let message = `✅ | Você curtiu a publicação de <@${idPost.author}>!`
                if((idPost?.members || []).includes(interaction.member.id)) {
                    client.db.substr(`images.${interaction.customId.split(' ')[1]}.likes`, 1)
                    idPost?.members.splice(idPost?.members?.indexOf(interaction.member.id), 1);
                    client.db.set(`images.${interaction.customId.split(' ')[1]}.members`, idPost.members)
                    message = `✅ | Você removeu a curtida da publicação de <@${idPost.author}>!`
                } else {
                    client.db.push(`images.${interaction.customId.split(' ')[1]}.members`, interaction.member.id)
                    client.db.add(`images.${interaction.customId.split(' ')[1]}.likes`, 1)
                }

                await interaction.update({
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('like ' + interaction.customId.split(' ')[1])
                            .setLabel(`${client.db.get('images.'+interaction.customId.split(' ')[1]+'.likes')}`)
                            .setEmoji('❤')
                            .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

                await interaction.followUp({
                    ephemeral: true,
                    content: message
                }).catch(err=> {})
            }
        }
    }
}