import {
    Client,
    GatewayIntentBits
} from 'discord.js';
import { config } from 'dotenv';
import { eventsLoad } from './Utils/handler.js';

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

config();

bot.events = eventsLoad(bot);
bot.login(process.env.TOKEN);

export default bot;