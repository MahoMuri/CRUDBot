import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Bot } from "../client";

interface Run {
    (bot: Bot, interaction: ChatInputCommandInteraction<"cached">);
}

export interface Command {
    data:
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    category: string;
    usage: string;
    example: string;
    run: Run;
}
