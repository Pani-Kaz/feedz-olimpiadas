import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import config from "../../config/config.js";
import moment from "moment-timezone";

export default {
  name: "events-messages",
  action: "messageCreate",
  once: false,
  run: async (client, message) => {
    if (message.author.bot) return;

    const activeEvent = client.db.get("started");
    if (
      (activeEvent && message.channel.id === config.channels["send-a-pic"]) ||
      message.channel.id == client.db.get("event-secondary.channel")
    ) {
      if (message.channel.id === config.channels["send-a-pic"]) {
        const recentsDates =
          client.db.get(`events-points.${message.author.id}.logs`) || [];
          const actualDate = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD");

        if (recentsDates.filter((i) => i.includes(actualDate)).length >= 4) {
          await message.delete().catch((err) => {});
          return message.channel
            .send({
              content: `❌ | ${message.author.toString()} Você já atingiu 4 pontos hoje! Volte amanhã 🙃`,
            })
            .then((m) => {
              setTimeout(() => {
                m.delete();
              }, 5000);
            });
        }
      }

      const attachments = message.attachments;
      if (attachments.size < 1) {
        await message.delete().catch((err) => {});
        return message.channel
          .send({
            content: `❌ | ${message.author.toString()} Por favor, insira uma imagem para participar do evento! 🙃`,
          })
          .then((m) => {
            setTimeout(() => {
              m.delete();
            }, 5000);
          });
      }

      const file = attachments.first();
      if (
        file.contentType !== "image/png" &&
        file.contentType !== "image/jpeg" &&
        file.contentType !== "image/webp"
      ) {
        await message.delete().catch((err) => {});
        return message.channel
          .send({
            content: `❌ | ${message.author.toString()} Aceito apenas imagens em .PNG / .JPEG! Por favor anexe arquivos válidos`,
          })
          .then((m) => {
            setTimeout(() => {
              m.delete();
            }, 5000);
          });
      }

      const Attachment = new AttachmentBuilder(file.attachment);

      client.db.add(`events-points.${message.author.id}.points`, 1);

      client.db.push(
        `events-points.${message.author.id}.logs`,
          moment().tz("America/Sao_Paulo").toISOString()
      );
      const memberRoles = message.member.roles.cache.toJSON().map((i) => i.id);
      const teams = Object.entries(config.teams).map((data) => ({
        name: data[0],
        ...data[1],
      }));
      let userTeam;

      teams.forEach((t) => {
        if (memberRoles.includes(t.role)) userTeam = t;
      });

      const emojis = {
        yellow: "🟡",
        red: "🔴",
        blue: "🔵",
        green: "🟢",
        purple: "🟣",
      };

      const msg = await message.channel.send({
        files: [Attachment],
        content: `> Enviado por: ${message.author.toString()} ${
          userTeam ? emojis[userTeam.name] : ""
        }\n${message.content ? `\`\`\`${message.content}\`\`\`` : ""}`,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("actions like")
              .setLabel("0")
              .setEmoji("❤")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("actions joy")
              .setLabel("0")
              .setEmoji("😂")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("actions muscle")
              .setLabel("0")
              .setEmoji("💪")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("actions yum")
              .setLabel("0")
              .setEmoji("😋")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("actions rocket")
              .setLabel("0")
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
              .setStyle(ButtonStyle.Primary)
          ),
        ],
      });

      client.db.set(`images.${msg.id}.author`, message.author.id);
      client.db.set(`images.${msg.id}.like`, 0);
      client.db.set(`images.${msg.id}.joy`, 0);
      client.db.set(`images.${msg.id}.muscle`, 0);
      client.db.set(`images.${msg.id}.yum`, 0);
      client.db.set(`images.${msg.id}.rocket`, 0);
      client.db.set(`images.${msg.id}.boost`, "false");

      await message.delete().catch((err) => {});

      const logs = await client.channels.cache.get(config.logs.points);
      if (logs)
        logs
          .send({
            content: `\`${message.author.username} (ID: ${
              message.author.id
            })\` enviou uma nova imagem! O usuário se encontra com ${
              client.db.get(`events-points.${message.author.id}.points`) || 0
            } pontos`,
          })
          .catch((err) => {});
    }
  },
};
