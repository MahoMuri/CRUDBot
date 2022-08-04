import {
    bold,
    EmbedBuilder,
    inlineCode,
    SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../interfaces/Command";
import { UserModel } from "../../models/UserSchema";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("edituser")
        .setDescription("Edits a user to the database")
        .addStringOption((option) =>
            option
                .setName("id")
                .setDescription("The id of the user to edit.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("field")
                .setDescription("The field of the user to edit")
                .addChoices(
                    {
                        name: "Full Name",
                        value: "fullName",
                    },
                    {
                        name: "Address",
                        value: "address",
                    },
                    {
                        name: "Age",
                        value: "age",
                    },
                    {
                        name: "Email",
                        value: "email",
                    }
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("value")
                .setDescription("The new value to replace")
                .setRequired(true)
        ),
    category: "crud",
    usage: "/edituser",
    example: "/edituser",
    run: async (bot, interaction) => {
        const userId = interaction.options.getString("id");
        const field = interaction.options.getString("field");
        const value = interaction.options.getString("value");

        const user = await UserModel.findOne({ id: userId });

        if (!user) {
            const embed = new EmbedBuilder()
                .setDescription(bold("❌ User not found!"))
                .setColor(bot.colors.UPSDELL_RED);
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
            return;
        }

        switch (field) {
            case "fullName":
                user.fullName = value;
                break;
            case "address":
                user.address = value;
                break;
            case "age": {
                const age = Number.parseInt(value, 10);

                if (Number.isNaN(age)) {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            bold(
                                `❌ ${inlineCode(`${value}`)} is not a number!`
                            )
                        )
                        .setColor(bot.colors.UPSDELL_RED);
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }

                user.age = age;
                break;
            }

            case "email":
                user.email = value;
                break;
            default:
                break;
        }

        await user.save();

        const embed = new EmbedBuilder()
            .setDescription(bold("✅ User updated!"))
            .setColor(bot.colors.GREEN_MUNSEL);
        interaction.reply({
            embeds: [embed],
        });
    },
};
