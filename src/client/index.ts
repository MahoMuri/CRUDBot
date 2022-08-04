import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import consola, { Consola } from "consola";
import { connect } from "mongoose";
import { table, getBorderCharacters } from "table";

import { Colors } from "../interfaces/Colors";
import { Command } from "../interfaces/Command";
import { Event } from "../interfaces/Event";
import { getEnvironmentConfiguration } from "../utils/Environment";

export class Bot extends Client {
    categories = readdirSync(path.join(__dirname, "..", "commands"));

    commands: Collection<string, Command> = new Collection();

    events: Collection<string, Event> = new Collection();

    colors = Colors;

    consola: Consola;

    config = getEnvironmentConfiguration();

    constructor() {
        super({
            allowedMentions: {
                parse: ["users", "roles"],
            },
            intents: [GatewayIntentBits.Guilds],
        });
    }

    async init() {
        this.consola = consola;
        // Connect to MongoDB
        connect(this.config.mongodb).then((mdb) => {
            this.consola.success(
                `Successfully connected to ${mdb.connection.name}!`
            );
        });

        // Command registry
        const cmdTable = [];
        const commandsPath = path.join(__dirname, "..", "commands");
        this.categories.forEach((dir) => {
            const commands = readdirSync(`${commandsPath}/${dir}`).filter(
                (file) => file.endsWith(".ts")
            );

            commands.forEach((file) => {
                try {
                    const {
                        command,
                    } = require(`${commandsPath}/${dir}/${file}`);
                    this.commands.set(command.data.name, command);
                    cmdTable.push([file, "Loaded"]);
                } catch (error) {
                    cmdTable.push([file, `${error.message}`]);
                }
            });
        });

        // Event registry
        const eventTable = [];
        const eventsPath = path.join(__dirname, "..", "events");
        readdirSync(eventsPath).forEach((file) => {
            try {
                const { event } = require(`${eventsPath}/${file}`);
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));

                eventTable.push([file, "Loaded"]);
            } catch (error) {
                eventTable.push([file, `${error.message}`]);
            }
        });

        this.consola.log(
            `${table(cmdTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Commands",
                },
            })}${table(eventTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Events",
                },
            })}`
        );

        // Login to DiscordAPI
        await this.login(this.config.token);

        // Consola because Console is overrated
        consola.wrapConsole();
        consola.withScope(`@${this.user.username}｜`);
    }
}
