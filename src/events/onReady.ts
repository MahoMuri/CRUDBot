import { ActivityType, REST, Routes } from "discord.js";
import { Event } from "../interfaces/Event";

export const event: Event = {
    name: "ready",
    run: async (bot) => {
        bot.consola.log("====================================");
        bot.consola.success(`${bot.user.username} is online!`);
        bot.consola.log("====================================");
        bot.user.setActivity({
            name: " with Drew",
            type: ActivityType.Playing,
        });

        const commands = bot.commands.map((command) => command.data.toJSON());

        const rest = new REST({ version: "10" }).setToken(bot.config.token);

        try {
            await rest.put(
                Routes.applicationGuildCommands(
                    bot.application.id,
                    process.env.GUILD
                ),
                { body: commands }
            );
            bot.consola.log("====================================");
            bot.consola.success("Guild slash commands loaded!");
            bot.consola.log("====================================");
        } catch (error) {
            bot.consola.error(error);
        }
    },
};
