import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'delete a post',
    action: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId == 'delete') {
                let idPost = client.db.get('images.' + interaction.message.id);
                if (!idPost) return interaction.reply({ content: `❌ | Não consegui encontrar o post mencionado!`, ephemeral: true });

                let message = `❌ | Apenas o dono do Post pode deleta-lo!`;
                const messageId = interaction.message.id;
                
                if ((idPost?.author == interaction.user.id) || interaction.member.roles.cache.get(config.manage)) {
                    let data = client.db.get(`events-points.${idPost.author}.logs`);
                    if(data) {
                        data.splice(0, 1);
                        client.db.set(`events-points.${idPost.author}.logs`, data);
                    };

                    client.db.substr(`events-points.${idPost.author}.points`, 1);
                    client.db.delete('images.' + interaction.message.id)
                    message = `✅ | Você deletou esse post post!`;
                    await interaction.message.delete()
                }

                await interaction.reply({
                    ephemeral: true,
                    content: message
                }).catch(err => { })
            }
        }
    }
}