import { ApplicationCommandOptionType } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'manage',
    description: "Comando relacionado ao sistema de pontos",
    options: [
        {
            name: "add",
            description: "Adiciona pontos a um usuário",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'qual o usuário deseja adicionar os pontos?',
                    type: ApplicationCommandOptionType.User,
                    required:true
                },
                {
                    name: 'pontos',
                    description: 'quantos pontos deseja adicionar?',
                    type: ApplicationCommandOptionType.Number,
                    required:true
                },
            ]
        },
        {
            name: "remove",
            description: "Remove pontos de um usuário",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'qual o usuário deseja remover os pontos?',
                    type: ApplicationCommandOptionType.User,
                    required:true
                },
                {
                    name: 'pontos',
                    description: 'quantos pontos deseja remover?',
                    type: ApplicationCommandOptionType.Number,
                    required:true
                },
            ]
        }
    ],
    run: async (client, inter) => {
        await inter.deferReply({ ephemeral: true })
        if (!inter.member.roles.cache.get(config.manage)) return inter.editReply({ content: `❌ | Você não possui permissões para utilizar esse comando!` })
        
        const subcommand = inter.options.getSubcommand();

        switch (subcommand) {
            case 'add': {
                const user = inter.options.getUser('user');
                const pontos = inter.options.getNumber('pontos');

                client.db.add(`events-points.${user.id}.points`, pontos);

                await inter.editReply({
                    content: `✅ | Adicionei **${pontos} pontos** para o usuário ${user}`
                })
                break
            }
            case 'remove': {
                const user = inter.options.getUser('user');
                const pontos = inter.options.getNumber('pontos');

                client.db.substr(`events-points.${user.id}.points`, pontos);

                await inter.editReply({
                    content: `✅ | Removi **${pontos} pontos** do usuário ${user}`
                })
                break
            }
        }
    }
}