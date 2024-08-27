import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import config from "../../config/config.js";

export default {
  name: "report a post",
  action: "interactionCreate",
  once: false,
  run: async (client, interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId == "var") {
        const messageId = interaction.message.id
        let idPost = client.db.get("images." + messageId);
        if (!idPost)
          return interaction.reply({
            content: `❌ | Não consegui encontrar o post mencionado!`,
            ephemeral: true,
          });

        const varChannel = client.channels.cache.get(config["channels"].var);
        if (!varChannel)
          return interaction.reply({
            content: `❌ | Não consegui encontrar o canal para enviar o report!`,
            ephemeral: true,
          });
        const attachment = interaction.message.attachments.first();

        client.db.set("images." + messageId + ".var", "true");
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

        varChannel.send({
          content: `O usuário ${interaction.user} reportou um post de <@${idPost.author}>.\nVerifique as informações abaixo:`,
          files: [new AttachmentBuilder(attachment.attachment)],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setURL(interaction.message.url)
                .setLabel("Ir para publicação original")
                .setStyle(ButtonStyle.Link)
                .setEmoji("🔗")
            ),
          ],
        });
      }
    }
  },
};
