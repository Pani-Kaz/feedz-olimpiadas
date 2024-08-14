import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'events-messages',
    action: 'messageCreate',
    once: false,
    run: async (client, message) => {
        if (message.author.bot) return;

        const activeEvent = client.db.get('started');
        if (activeEvent && message.channel.id === config.channels["send-a-pic"]) {
            const recentsDates = client.db.get(`events-points.${message.author.id}.logs`) || [];
            const actualDate = new Date().toISOString().slice(0, 10);

            if ((recentsDates.filter(i => i.includes(actualDate)).length >= 5)) {
                await message.delete().catch(err => { })
                return message.channel.send({
                    content: `❌ | ${message.author.toString()} Você já atingiu 5 pontos hoje! Volte amanhã 🙃`
                }).then(m => { setTimeout(() => { m.delete() }, 5000) })
            }

            const attachments = message.attachments;
            if (attachments.size < 1) {
                await message.delete().catch(err => { })
                return message.channel.send({
                    content: `❌ | ${message.author.toString()} Por favor, insira uma imagem para participar do evento! 🙃`
                }).then(m => { setTimeout(() => { m.delete() }, 5000) })
            }

            const file = attachments.first();
            if (file.contentType !== 'image/png' && file.contentType !== 'image/jpeg') {
                await message.delete().catch(err => { });
                return message.channel.send({
                    content: `❌ | ${message.author.toString()} Aceito apenas imagens em .PNG / .JPEG! Por favor anexe arquivos válidos`
                }).then(m => { setTimeout(() => { m.delete() }, 5000) })
            };

            const Attachment = new AttachmentBuilder(file.attachment);

            client.db.add(`events-points.${message.author.id}.points`, 1);
            client.db.push(`events-points.${message.author.id}.logs`, new Date().toISOString());  

            client.db.set(`images.${message.id}.author`, message.author.id)
            client.db.set(`images.${message.id}.likes`, 0)

            await message.channel.send({
                files: [Attachment],
                content: `> Enviado por: ${message.author.toString()}\n${message.content ? `\`\`\`${message.content}\`\`\`` : ''}`,
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('like ' + message.id)
                        .setLabel('0')
                        .setEmoji('❤')
                        .setStyle(ButtonStyle.Secondary)
                    )
                ]
            });

            await message.delete().catch(err => {});

        }
    }
}