import { EmbedBuilder } from "discord.js";
import config from "../../config/config.js";

export default {
    name: 'send a event',
    action: 'ready',
    once: true,
    run: async (client) => {
        const channel = client.channels.cache.get(config.channels.info);
        const lastMessages = await channel.messages.fetch();
        
        if(lastMessages.size < 1) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor('#FA8072')
                    .setAuthor({
                        name: channel.guild.name,
                        iconURL: channel.guild.iconURL()
                    })
                    .setDescription(`# VOCÊ FOI CONVOCADO!\n\nPrepare-se para um desafio emocionante que vai movimentar sua rotina e trazer ainda mais energia ao seu dia a dia. As **Olimpíadas da Feedz 2024** estão chegando, e você é parte essencial dessa jornada!\n\n## 💻 COMO VAI FUNCIONAR?\n### Desafios Diários:\n\n**Exercício Físico**: Escolha sua atividade física preferida, pratique, e no final tire uma foto como prova. Poste essa foto no canal <#${config.channels["send-a-pic"]}>. \n> Lembre-se, vale **1 foto a cada exercício por dia**!\n\n**Alimentação Saudável**: Cuide bem da sua alimentação! Cada vez que você se alimentar de maneira saudável nas principais refeições (*café da manhã, almoço e jantar*), tire uma foto do seu prato e poste no <#${config.channels["send-a-pic"]}>. Você pode registrar até **3 fotos por dia**! \n\n# 🎁 PREMIAÇÃO:\n\nO esforço será recompensado! Vamos falar dos prêmios que estão esperando por você:\n### Time Vencedor:\nCada membro do time ganhador receberá **R$100** em um **cartão-presente na Carpe Diem** para usar como preferir.\n### Melhores Desempenhos Individuais:\n1º lugar: **R$300 na Carpe Diem**\n2º lugar: **R$200 na Carpe Diem**\n3º lugar: **R$100 na Carpe Diem**`)
                    .setFooter({
                        text: 'Prepare-se para conquistar cada ponto e levar seu time ao topo! As Olimpíadas da Feedz 2024 estão chegando e contamos com a sua dedicação.'
                    })
                ]
            })
        }
    }
}