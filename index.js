import {
    Client,
    Collection,
    GatewayIntentBits
} from 'discord.js';
import { config } from 'dotenv';
import { commandsLoad, eventsLoad } from './Utils/handler.js';
import { JsonDatabase } from 'wio.db';
import path from 'path';
import { fileURLToPath } from 'url';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

bot.db = new JsonDatabase({
    databasePath: path.join(__dirname, 'database', 'data.json')
});

bot.commands = new Collection();
commandsLoad(bot);

bot.login(process.env.TOKEN);

process.on('uncaughtException', function (err) {
    console.error(err);
});

export default bot;