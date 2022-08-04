import { stripIndents } from "common-tags";
import {
    bold,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { getBorderCharacters, table } from "table";
import { Pagination } from "pagination.djs";
import { Command } from "../../interfaces/Command";
import { UserModel } from "../../models/UserSchema";

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName("listusers")
        .setDescription("Displays all users in the database"),
    category: "crud",
    usage: "/listusers",
    example: "/listusers",
    run: async (bot, interaction) => {
        const docs = await UserModel.find({});

        if (!docs.length) {
            const embed = new EmbedBuilder()
                .setDescription(bold("😭 No one's here yet!"))
                .setColor(bot.colors.UPSDELL_RED);
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
            return;
        }

        // Pagination for discord embed due to character limitations
        const userEmbeds = [];
        docs.forEach((doc) =>
            userEmbeds.push(
                new EmbedBuilder().setAuthor({ name: doc.fullName })
                    .setDescription(stripIndents`User Details:
                    \`\`\`yml
                    Id: ${doc.id}
                    Address: ${doc.address}
                    Age: ${doc.age}
                    Email: ${doc.email}
                    \`\`\``)
            )
        );

        new Pagination(interaction)
            .setEmbeds(userEmbeds, (embed, index, array) => {
                return embed.setFooter({
                    text: `Page: ${index + 1}/${array.length}`,
                });
            })
            .setButtonAppearance({
                first: {
                    label: "First",
                    emoji: "⏮",
                    style: ButtonStyle.Primary,
                },
                prev: {
                    label: "Prev",
                    emoji: "◀️",
                    style: ButtonStyle.Secondary,
                },
                next: {
                    label: "Next",
                    emoji: "▶️",
                    style: ButtonStyle.Success,
                },
                last: {
                    label: "Last",
                    emoji: "⏭",
                    style: ButtonStyle.Danger,
                },
            })
            .render();

        // Table for console
        const userTable = [["ID", "Name", "Age", "Address", "Email"]];
        docs.forEach((doc) =>
            userTable.push([
                doc.id,
                doc.fullName,
                doc.address,
                doc.age,
                doc.email,
            ])
        );

        bot.consola.log(
            `${table(userTable, {
                border: getBorderCharacters("norc"),
            })}`
        );
    },
};
