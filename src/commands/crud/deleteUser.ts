import { stripIndents } from "common-tags";
import {
    ActionRowBuilder,
    bold,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../interfaces/Command";
import { UserModel } from "../../models/UserSchema";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("deleteuser")
        .setDescription("Deletes a user to the database")
        .addStringOption((option) =>
            option
                .setName("id")
                .setDescription("The id of the user to delete.")
                .setRequired(true)
        ),
    category: "crud",
    usage: "/deleteuser <userId>",
    example: "/deleteuser f2cn1M2acOEo3aALTMkrU",
    run: async (bot, interaction) => {
        const userId = interaction.options.getString("id");

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

        const confirmEmbed = new EmbedBuilder()
            .setTitle("Are you sure?")
            .setDescription(
                stripIndents`You are about to delete ${
                    user.fullName
                }! Are you sure you want to delete this user?
                
                ‼${bold("THIS ACTION IS IRREVERSIBLE")}‼
                `
            );

        const confirmButton = new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success);

        const cancelButton = new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger);

        interaction.reply({
            embeds: [confirmEmbed],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    confirmButton,
                    cancelButton
                ),
            ],
        });

        const msg = await interaction.fetchReply();
        const filter = (button: ButtonInteraction) =>
            button.customId === "confirm" || button.customId === "cancel";
        msg.awaitMessageComponent({ filter, time: 10000 })
            .then(async (collected) => {
                if (collected.customId === "confirm") {
                    await UserModel.deleteOne({ id: userId });

                    const embed = new EmbedBuilder()
                        .setDescription(bold("✅ User deleted!"))
                        .setColor(bot.colors.GREEN_MUNSEL);
                    collected.reply({
                        embeds: [embed],
                    });
                } else if (collected.customId === "cancel") {
                    const embed = new EmbedBuilder()
                        .setDescription(bold("✅ Action aborted!"))
                        .setColor(bot.colors.GREEN_MUNSEL);
                    collected.reply({
                        embeds: [embed],
                    });
                }
            })
            .catch((err) => {
                if (err.message.includes("time")) {
                    const embed = new EmbedBuilder()
                        .setDescription(bold("⏳ Action timed out!"))
                        .setColor(bot.colors.GREEN_MUNSEL);
                    interaction.reply({
                        embeds: [embed],
                    });
                }
            });
    },
};
