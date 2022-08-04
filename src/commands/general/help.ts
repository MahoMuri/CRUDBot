import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Adds a user to the database"),
    category: "general",
    usage: "/help [command]",
    example: "/help adduser",
    run: async (bot, interaction) => {
        // TODO: Make command
    },
};
