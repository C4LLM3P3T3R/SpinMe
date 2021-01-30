import * as Discord from "discord.js";
import { Game } from "./Game";
import * as fs from "fs";
import * as _ from "lodash";
import { after } from "lodash";
import * as spamnya from "spamnya";
import { type } from "os";
export const client = new Discord.Client();
let leaderboard = [];
let afterSort: any = [];
let coinLess = new Map();
let allServers = [];
let authorObj: any;
let authorName = "";

//@ts-ignore
client.commands = new Map();



client.on("ready", () => {
    console.log("ready!");
    const files = fs.readdirSync("./out/commands").filter(file => file.endsWith(".js")); //./out/commands because fs reads the directory from the execution foler as default
    console.log("-----------COMMANDS-----------");
    for (const file of files) {
        try {
            const command = require(`./commands/${file}`); //without out because require default folder is the files that's it's executed in
            //@ts-ignore
            client.commands.set(command.name, command); //inserting data into HASHMAP-UH
            console.log(command.name + ".cmd loaded!"); //.cmd is unnesesary, just fancy ;p
        } catch (error) {
            console.log(file + " failed to load!");
            continue;
        }
    }
    let serverList = client.guilds.cache.map(guild => guild.id);

    let config = readConfigFile();

    if (config.servers != []) {
        config.servers.forEach(obj => allServers.push(obj.id));
        serverList.forEach(serverId => {
            if (!allServers.includes(serverId)) {
                config.servers.push({
                    "id": serverId, "options": {
                        "chance1": 40,
                        "chance2": 20,
                        "chance3": 20,
                        "chance4": 15,
                        "chance5": 5
                    }
                })
                saveConfigFile(config);
            }
        })
    }

})

client.on("guildCreate", (guild) => {

    let config = readConfigFile();

    config.servers.push({
        "id": guild.id, "options": {
            "chance1": 40,
            "chance2": 20,
            "chance3": 20,
            "chance4": 15,
            "chance5": 5
        }
    });

    saveConfigFile(config);

})

client.on("guildDelete", (guild) => {
    let config = readConfigFile();

    for (let index = 0; index < config.servers.length; index++) {
        if (config.servers[index].id == guild.id) {
            config.servers.splice(index, 1);
            saveConfigFile(config);
        }

    }



})

client.on("message", (message) => {
    spamnya.log(message, 20);





    if (!coinLess.has(message.author.id) && !message.content.startsWith("!") && !coinLess.has(message.author.id)) {
        let config = readConfigFile();
        for (let index = 0; index < config.users.length + 1; index++) {
            if (config.users[index]) {
                if (config.users[index].id == message.author.id) {
                    config.users[index].tokens += 10;
                    saveConfigFile(config);
                }
            }
        }
    }

    if (spamnya.tooQuick(3, 1000) && !coinLess.has(message.author.id)) {
        console.log('!');

        coinLess.set(message.author.id, false);
        console.log('??');
        coinLess.set(message.author.id, true);
        setTimeout(() => {


            coinLess.delete(message.author.id);
            console.log('removed');

        }, 10000);
    }

    let prefix = "!";
    let command;
    let args;
    try {
        //in case of command !config any args
        command = message.content.split(prefix)[1] /* 'config any args' */.split(/ +/)[0]; /*config*/;
        args = message.content.slice(prefix.length).trim().split(/ +/).slice(1) /* any args */;
    } catch (error) {

    }
    //@ts-ignore
    if (!client.commands.has(command)) return;
    //@ts-ignore
    client.commands.get(command).execute(client, message, args);




})

client.login("token");

export function readConfigFile(): any {
    return JSON.parse(fs.readFileSync("config.json").toString());
}

export function saveConfigFile(config: any) {
    fs.writeFileSync("config.json", JSON.stringify(config));
}




