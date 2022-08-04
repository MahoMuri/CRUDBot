import { Interaction } from "discord.js";
import { Event } from "../interfaces/Event";

export const event: Event = {
    name: "interactionCreate",
    run: (bot, interaction: Interaction<"cached">) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        bot.commands.get(interaction.commandName).run(bot, interaction);
    },
};
