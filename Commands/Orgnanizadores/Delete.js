import { ApplicationCommandOptionType } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'delete',
    description: "Apague uma postagem de um usuário",
    options: [
        {
            name: "id",
            description: "Insira o ID do post",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        await inter.deferReply({ ephemeral: true })
        if (!inter.member.roles.cache.get(config.manage)) return inter.editReply({ content: `❌ | Você não possui permissões para utilizar esse comando!` })
        
        const post = client.db.get(`images.${inter.options.getString('id')}`);
        if(!post) return inter.editReply({ content: `❌ | Não consegui encontrar esse post!` })
        if(post) {
            let data = client.db.get(`events-points.${post.author}.logs`);
            data.splice(0, 1);
            client.db.set(`events-points.${post.author}.logs`, data);
        };

        client.db.substr(`events-points.${post.author}.points`, 1);
        client.db.delete('images.' + inter.options.getString('id'))

        const postChannel = client.channels.cache.get(config.channels['send-a-pic']);
        if(postChannel) {
            const message = await postChannel.messages.fetch(inter.options.getString('id')).catch(err => {})
            message.delete()
        }

        inter.editReply({ content: `✅ | Post deletado com sucesso!` })
    }
}