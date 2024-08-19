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
                
                if ((idPost?.author == interaction.user.id)) {
                    let data = client.db.get(`events-points.${interaction.user.id}.logs`);
                    if(data) {
                        data.splice(0, 1);
                        client.db.set(`events-points.${interaction.user.id}.logs`, data);
                    };

                    client.db.substr(`events-points.${interaction.user.id}.points`, 1);
                    client.db.delete('images.' + interaction.message.id)
                    message = `✅ | Você deletou seu post!`;
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