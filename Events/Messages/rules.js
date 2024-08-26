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
                    .setDescription('SEJAM TODOS MUUUUITO BEM VINDOS E BEM VINDAS ÀS OLIMPIADAS DA FEEDZ - 2024!!! 💪  🎉 🎉 \n## 📢  PARA QUE SEJA TUDO MUITO BEM ORGANIZADO, TEREMOS ALGUMAS REGRINHAS SIMPLES PARA CUMPRIR:\n- 📍 O desafio terá  21 DIAS, tendo início no dia 26/08 e terminando no dia 16/09!\n- 📍 Cada vez que você praticar algum exercício físico da sua escolha, você tira uma foto e manda no canal #poste-sua-foto!\n- 📍 Cada vez que você se alimentar de maneira saudável nas principais refeições (no café da manha, almoço e janta), você tira uma foto do seu prato e manda no canal  #poste-sua-foto!\n- 📍 O canal #poste-sua-foto será EXCLUSIVO para mandar foto! Você pode mandar a sua foto com comentários também, mas o canal ficará bloqueado para enviar outras mensagens!\n- 📍 Você também estará no canal do seu time para trocarem ideias e conversarem, além de existir o canal geral para "bateção de papo"!\n- 📍 Para cada foto de refeição saudável ou praticando exercício que você mandar no grupo, você  GANHA 1 PONTO.\n- 📍 MÁXIMO DE 4 PONTOS POR DIA COM OS DESAFIOS TRADICIONAIS\n- 📍 Fique atento a esse canal e ao canal poste-sua-foto, pois terão  PONTOS BÔNUS que poderão ser contabilizados!\n\n### BORA MEXER ESSE CORPINHO, SE ALIMENTAR DE MODO SAUDÁVEL E ADQUIRIR NOVOS HÁBITOS QUE FAZEM BEM PRO CORPO E MENTE?? 😉')
                    .setFooter({
                        text: 'IMPORTANTE: Caso alguma regra não seja seguida, o ponto correspondente será removido.'
                    })
                ]
            })
        }
    }
}