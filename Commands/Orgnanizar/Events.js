import { ApplicationCommandOptionType } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'events',
    description: "Comando relacionado ao sistema de eventos",
    options: [
        {
            name: "principal",
            description: "Inicie / desligue o evento principal",
            type: ApplicationCommandOptionType.Subcommand
        }
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
        }
    }
}