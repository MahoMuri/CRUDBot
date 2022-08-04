import {
    ActionRowBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("adduser")
        .setDescription("Adds a user to the database"),
    category: "crud",
    usage: "/adduser",
    example: "/adduser",
    run: async (bot, interaction) => {
        const modal = new ModalBuilder()
            .setCustomId("addUser-modal")
            .setTitle("Add User");

        const fullNameInput =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("fullNameInput")
                    .setLabel("Full name:")
                    .setPlaceholder("John Mark Doe")
                    .setStyle(TextInputStyle.Short)
            );

        const addressInput =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("addressInput")
                    .setLabel("Address:")
                    .setPlaceholder("123 example street")
                    .setStyle(TextInputStyle.Short)
            );

        const ageInput = new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("ageInput")
                .setLabel("Age:")
                .setPlaceholder("25")
                .setStyle(TextInputStyle.Short)
        );

        const emailInput =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                    .setCustomId("emailInput")
                    .setLabel("Email:")
                    .setPlaceholder("johnmarkdoe@example.com")
                    .setStyle(TextInputStyle.Short)
            );

        modal.addComponents(fullNameInput, addressInput, ageInput, emailInput);

        await interaction.showModal(modal);
    },
};
