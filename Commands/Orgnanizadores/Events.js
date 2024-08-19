import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'events',
    description: "Comando relacionado ao sistema de eventos",
    options: [
        {
            name: "principal",
            description: "Inicie / desligue o evento principal",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "extra",
            description: "Inicie / desligue um evento extra",
            type: ApplicationCommandOptionType.Subcommand
        },
    ],
    run: async (client, inter) => {
        await inter.deferReply({ ephemeral: true })
        if (!inter.member.roles.cache.get(config.manage)) return inter.editReply({ content: `❌ | Você não possui permissões para utilizar esse comando!` })

        const subcommand = inter.options.getSubcommand();

        switch (subcommand) {
            case 'principal': {
                const channel = client.channels.cache.get(config.channels["send-a-pic"]);
                if (!channel) return inter.editReply({ content: `❌ | Não encontrei o canal mencionado!` });

                const eventStatus = client.db.get('started') || false;
                client.db.set('started', !eventStatus);

                if (!eventStatus) channel.send({ content: `✅ | WOW! Evento iniciando, leiam <#${config.channels.info}>` })

                return inter.editReply({ content: `✅ | Sucesso! O evento teve o status modificado - <#${config.channels['send-a-pic']}>` })
            }
            case 'extra': {
                const data = client.db.get('event-secondary');
                if(data) {
                    client.channels.cache.get(data.category)?.delete();
                    client.channels.cache.get(data.channel)?.delete();
                    client.channels.cache.get(data.info)?.delete();

                    client.db.delete('event-secondary')
                    await inter.editReply({ content: `✅ | Sucesso! O evento extra foi deletado.` })
                } else {
                    const category = await inter.guild.channels.create({
                        name: '✨ Desafios Extras',
                        type: 4,
                        position: 2 
                    });
            
                    const channel1 = await inter.guild.channels.create({
                        name: '📚ㆍinformativo',
                        type: 0,
                        parent: category.id,
                        permissionOverwrites: [
                            {
                                id: inter.guild.id,
                                deny: [PermissionsBitField.Flags.SendMessages],
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: config.manage,
                                allow: [PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    });
            
                    const channel2 = await inter.guild.channels.create({
                        name: '📍ㆍenvie aqui',
                        type: 0,
                        parent: category.id,
                        permissionOverwrites: [
                            {
                                id: inter.guild.id,
                                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ViewAuditLog, PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });

                    channel1.send({content:inter.user.toString()}).then(m=> m.delete().catch(err => {}))
                    channel2.send({content:inter.user.toString()}).then(m=> m.delete().catch(err => {}))

                    client.db.set('event-secondary.channel', channel2.id);
                    client.db.set('event-secondary.info', channel1.id);
                    client.db.set('event-secondary.category', category.id);

                    await inter.editReply({ content: `✅ | Sucesso! O evento extra foi criado.` })
                }
                break
            }
        }
    }
}