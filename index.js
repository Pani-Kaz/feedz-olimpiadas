import {
    Client,
    GatewayIntentBits
} from 'discord.js';
import { config } from 'dotenv';

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

config();

bot.login(process.env.TOKEN);

export default bot;