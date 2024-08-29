import { ApplicationCommandOptionType } from "discord.js";
import config from "../../config/config.js";
import { inspect } from "util";

export default {
  name: "eval",
  description: "eval command",
  options: [
    {
      name: "code",
      description: "codigo eval",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, inter) => {
    await inter.deferReply({ ephemeral: true });
    if (!inter.member.roles.cache.get(config.manage))
      return inter.editReply({
        content: `❌ | Você não possui permissões para utilizar esse comando!`,
      });

    const code = inter.options.getString("code")

    try {
      let result = await eval(code),
        response;
      if (typeof result !== "string") result = inspect(result);
      if (result.length > 1950)
        response = `\`\`\`js\n${result.slice(0, 1950)}\n\n( mais ${
          result.length - 1950
        } caracteres )\n\`\`\``;
      else response = `\`\`\`js\n${result}\n\`\`\``;

      inter.editReply({
        content: `${response}`,
      });
    } catch (e) {
      inter.editReply({
        content: "```js\n" + e + "\n```",
      });
    }
  },
};
