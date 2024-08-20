import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import config from "../../config/config.js";

export default {
  name: "posts",
  description: "Veja a publicação com maior interação",
  run: async (client, inter) => {
    await inter.deferReply({ ephemeral: true });

    let all_posts = client.db.get("images");
    all_posts = Object.entries(all_posts);
    all_posts = all_posts.map((data) => ({ id: data[0], ...data[1] }));
    all_posts = all_posts.map((data) => {
      const allValues =
        (data?.like || 0) +
        (data?.joy || 0) +
        (data?.muscle || 0) +
        (data?.yum || 0) +
        (data?.rocket || 0);
      return { ...data, reactions: allValues };
    });
    all_posts = all_posts.sort((a, b) => b.reactions - a.reactions);

    const finalPost = all_posts[0];

    if (!finalPost)
      inter.editReply({
        content: `Não consegui localizar nenhum post!`,
      });

    const channel = client.channels.cache.get(config.channels["send-a-pic"]);
    const message = await channel?.messages
      ?.fetch(finalPost.id)
      .catch((err) => {
        return null;
      });

    if (message) {
      const attachment = message.attachments.first();
      inter.editReply({
        content: `Totalizando ${finalPost.reactions} interações o post do usuário <@${finalPost.author}> é o post com maior interação no evento!`,
        files: [new AttachmentBuilder(attachment.attachment)],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setURL(message.url)
              .setLabel("Ir para publicação original")
              .setStyle(ButtonStyle.Link)
              .setEmoji("🔗")
          ),
        ],
      });
    } else
      inter.editReply({
        content: `Totalizando ${finalPost.reactions} interações o post do usuário <@${finalPost.author}> é o post com maior interação no evento!\n> Infelizmente não consegui localizar o post!`,
      });
  },
};
