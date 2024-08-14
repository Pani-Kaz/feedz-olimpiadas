import { EmbedBuilder } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'send a rule',
    action: 'ready',
    once: true,
    run: async (client) => {
        const channel = client.channels.cache.get(config.channels.rules);
        const lastMessages = await channel.messages.fetch();
        
        if(lastMessages.size < 1) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Yellow')
                    .setAuthor({
                        name: channel.guild.name,
                        iconURL: channel.guild.iconURL()
                    })
                    .setDescription('# AS REGRAS SÃO CLARAS!\n1.  O DESAFIO COMEÇA NO DIA 21/08 E TERMINA NO DIA 11/09!\n2. Finais de semana não são válidos para a competição!\n3. MÁXIMO DE 3 PONTOS POR DIA com os desafios tradicionais, mas TEREMOS DESAFIOS E PONTOS EXTRAS ao longo dos dias. Fique atento ao servidor!\n\n- O time QUE PONTUAR MAIS, GANHA!\n- As três pessoas que mais pontuarem individualmente, ganham!')
                    .setFooter({
                        text: 'IMPORTANTE: Caso alguma regra não seja seguida, o ponto correspondente será removido.'
                    })
                ]
            })
        }
    }
}