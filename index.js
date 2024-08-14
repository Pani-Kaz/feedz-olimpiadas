import {
    Client,
    Collection,
    GatewayIntentBits
} from 'discord.js';
import { config } from 'dotenv';
import { commandsLoad, eventsLoad } from './Utils/handler.js';
import { JsonDatabase } from 'wio.db';

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

config();

bot.events = eventsLoad(bot);
bot.db = new JsonDatabase({
    databasePath: './database/data.json'
});
bot.commands = new Collection();

commandsLoad(bot);

bot.login(process.env.TOKEN);

export default bot;