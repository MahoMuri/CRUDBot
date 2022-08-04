import { stripIndents } from "common-tags";
import {
    bold,
    EmbedBuilder,
    inlineCode,
    Interaction,
    InteractionType,
} from "discord.js";
import { customAlphabet } from "nanoid";

import { Event } from "../interfaces/Event";
import { UserModel } from "../models/UserSchema";

export const event: Event = {
    name: "interactionCreate",
    run: async (bot, interaction: Interaction) => {
        if (interaction.type !== InteractionType.ModalSubmit) {
            return;
        }

        switch (interaction.customId) {
            case "addUser-modal": {
                const fullName =
                    interaction.fields.getTextInputValue("fullNameInput");
                const address =
                    interaction.fields.getTextInputValue("addressInput");
                const age = Number.parseInt(
                    interaction.fields.getTextInputValue("ageInput"),
                    10
                );

                if (Number.isNaN(age)) {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            bold(
                                `❌ ${inlineCode(
                                    `${interaction.fields.getTextInputValue(
                                        "ageInput"
                                    )}`
                                )} is not a number!`
                            )
                        )
                        .setColor(bot.colors.UPSDELL_RED);
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }

                const email =
                    interaction.fields.getTextInputValue("emailInput");

                if (
                    await UserModel.exists({
                        fullName,
                        address,
                        age,
                        email,
                    }).exec()
                ) {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            bold("❌ This user already exists in the database!")
                        )
                        .setColor(bot.colors.UPSDELL_RED);
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }

                // Custom Alphabet for nanoid
                const nanoid = customAlphabet(
                    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
                    21
                );
                const newUser = await UserModel.create({
                    id: nanoid(),
                    fullName,
                    address,
                    age,
                    email,
                });

                const embed = new EmbedBuilder()
                    .setTitle("User Created!")
                    .setColor(bot.colors.GREEN_MUNSEL)
                    .setDescription(stripIndents`User Details:
                        \`\`\`yml
                        Id: ${newUser.id}
                        Name: ${newUser.fullName}
                        Address: ${newUser.address}
                        Age: ${newUser.age}
                        Email: ${newUser.email}
                        \`\`\``);
                interaction.reply({ embeds: [embed] });
                break;
            }

            default:
                break;
        }
    },
};
