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

client.on("ready", () => {
    console.log("ready!");
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
    let args = message.content.split(" ");




    if (!coinLess.has(message.author.id) && !message.content.startsWith("!") && !coinLess.has(message.author.id)) {
        let config = readConfigFile();
        for (let index = 0; index < config.users.length + 1; index++) {
            if (config.users[index]) {
                if (config.users[index].id == message.author.id) {
                    config.users[index].coins += 10;
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




    if (args[0] == "!spin" && args[1] != undefined && !message.author.bot) {
        let game = new Game(message);
        game.spin(args[1]);
    } else if (args[0] == "!leaderboard") {
        leaderboard = [];
        afterSort = [];
        let config = readConfigFile();


        for (let index = 0; index < 10; index++) {
            if (config.users[index] != undefined)
                leaderboard.push({ "id": config.users[index].id, "coins": config.users[index].coins });

        }
        leaderboard = _.orderBy(leaderboard, (item) => {
            return item.coins;
        }, "desc")
        for (let index = 0; index < leaderboard.length; index++) {

            afterSort.push(index + 1 + ".", `<@${leaderboard[index].id}>`, "**\nCoins: **", `\`\`${leaderboard[index].coins}\`\``, "\n");

        }

        console.log(afterSort.toString());
        if (JSON.stringify(config.users) == "[]") afterSort = "No one is on the leaderboard! Go play, and be the first!";

        let embed = new Discord.MessageEmbed()
            .addFields({
                name: "Leaderboard",
                value: afterSort.toString().replace(/,/g, ""),


            })
            .setColor("#FFBD33");
        message.channel.send(embed);
    } else if (args[0] == "!tokens") {
        let config = readConfigFile();

        if (args[1]) {
            try {
                authorObj = message.mentions.members.first();
                authorName = message.mentions.members.first().user.username;
            } catch (error) {
                return message.reply("Couldn't find the user or the argument is not a mention");

            }

        }
        else {
            authorObj = message.author;
            authorName = message.author.username;
        }



        for (let index = 0; index < config.users.length + 1; index++) {

            try {
                if (config.users[index].id == authorObj.id) {
                    let embed = new Discord.MessageEmbed()
                        .setColor("#FFBD33")
                        .setTitle("**Tokens**")
                        .addField(`${authorName}`, `Tokens: \`\`${config.users[index].coins}\`\``);
                    return message.channel.send(embed);
                }
            } catch (error) {
                try {
                    if (config.users[index]) return;
                    config.users.push({ "id": authorObj.id, "coins": 1000, "level": 0, "exp": 0 });
                    saveConfigFile(config);
                    for (let index = 0; index < config.users.length + 1; index++) {
                        if (config.users[index]) {
                            if (config.users[index].id == authorObj.id) {
                                let embed = new Discord.MessageEmbed()
                                    .setColor("#FFBD33")
                                    .setTitle("**Tokens**")
                                    .addField(`${authorName}`, `Tokens: \`\`${config.users[index].coins}\`\``);
                                return message.channel.send(embed);
                            }
                        }

                    }
                } catch (error) {
                    return message.reply("Couldn't find the user");
                }

            }



        }

    } else if (args[0] == "!level") {
        let config = readConfigFile();


        if (args[1]) {
            try {
                authorObj = message.mentions.members.first();
                authorName = message.mentions.members.first().user.username;
            } catch (error) {
                return message.reply("Couldn't find the user or the argument is not a mention");
            }

        }
        else {
            authorObj = message.author;
            authorName = message.author.username;
        }

        for (let index = 0; index < config.users.length + 1; index++) {

            try {
                if (config.users[index].id == authorObj.id) {
                    let embed = new Discord.MessageEmbed()
                        .setColor("#FFBD33")
                        .setTitle("**Level**")
                        .addField(`${authorName}`, `**Level**: \`\`${config.users[index].level}\`\`\n**Exp**: ${config.users[index].exp}/${config.users[index].level * (25 + config.users[index].level)}`);
                    return message.channel.send(embed);
                }
            } catch (error) {

                if (config.users[index]) return;
                config.users.push({ "id": authorObj.id, "coins": 1000, "level": 0, "exp": 0 });
                saveConfigFile(config);
                for (let index = 0; index < config.users.length + 1; index++) {
                    if (config.users[index]) {
                        if (config.users[index].id == authorObj.id) {
                            let embed = new Discord.MessageEmbed()
                                .setColor("#FFBD33")
                                .setTitle("**Level**")
                                .addField(`${authorName}`, `**Level**: \`\`${config.users[index].level}\`\`\n**Exp**: ${config.users[index].exp}/${config.users[index].level * (25 + config.users[index].level)}`);
                            return message.channel.send(embed);
                        }
                    }

                }



            }



        }
    } else if (args[0] == "!help") {

        if (args[1] == "admin" && message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .addFields({
                    name: "**Commands**",
                    value: "``!help/!help admin`` - shows this message\n``!spin <amout>`` - bet on the machine!\n``!leaderboard`` - shows the global leaderboad. Go and be the first!\n``!tokens/!tokens <@user>`` - shows your tokens, or the person you pinged\n``!level/!level <@user>`` - shows your level, or the person you pinged\n``!rig`` - shows the current chance percentage\n``!rig <appleChance> <bananaChance> <watermelonChance> <tomatoChance> <peachChance>`` - you can rig the chances of the machine (sum of the chances must be 100).\n``!rig reset`` - resets the chances to default\n``!payouts`` - shows the payouts table",
                    inline: false
                })
                .setColor("#FFBD33")
            message.channel.send(embed);
        } else if (args[1] == undefined) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .addFields({
                    name: "**Commands**",
                    value: "``!help/!help admin`` - shows this message (to acess !help admin you need to be the owner)\n``!spin <amout>`` - bet on the machine!\n``!leaderboard`` - shows the global leaderboad. Go and be the first!\n``!tokens/!tokens <@user>`` - shows your tokens, or the person you pinged\n``!level/!level <@user>`` - shows your level, or the person you pinged\n``!payouts`` - shows the payouts table",
                    inline: false
                })
                .setColor("#FFBD33")
            message.channel.send(embed);
        } else {
            message.reply("You need to be the owner of the server!");
        }


    } else if (args[0] == "!rig" && message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {
        if (args[5]) {


            let config = readConfigFile();
            let server = message.guild.id;
            for (let index = 1; index < args.length; index++) {
                if (isNaN(parseInt(args[index]))) {
                    return message.reply("Wrong chance values!");
                }
            }
            if (parseInt(args[1]) + parseInt(args[2]) + parseInt(args[3]) + parseInt(args[4]) + parseInt(args[5]) == 100) {
                for (let index1 = 0; index1 < config.servers.length; index1++) {
                    if (config.servers[index1].id == server) {

                        config.servers[index1].options.chance1 = args[1];
                        config.servers[index1].options.chance2 = args[2];
                        config.servers[index1].options.chance3 = args[3];
                        config.servers[index1].options.chance4 = args[4];
                        config.servers[index1].options.chance5 = args[5];

                    }

                }
                saveConfigFile(config);
                return message.reply("*beep beep, boop boop* MACHINE RIGGED SUCCESFULLY");

            } else {
                return message.reply("Chances summed must be 100");
            }
        } else if (args[1] == "reset") {
            let config = readConfigFile();
            for (let index1 = 0; index1 < config.servers.length; index1++) {
                if (config.servers[index1].id == message.guild.id) {

                    config.servers[index1].options.chance1 = 40;
                    config.servers[index1].options.chance2 = 20;
                    config.servers[index1].options.chance3 = 20;
                    config.servers[index1].options.chance4 = 15;
                    config.servers[index1].options.chance5 = 5;

                }

            }
            saveConfigFile(config);
            return message.reply("*beep beep, boop boop* MACHINE RESETED SUCCESFULLY");
        } else {
            let config = readConfigFile();
            for (let index1 = 0; index1 < config.servers.length; index1++) {
                if (config.servers[index1].id == message.guild.id) {



                    let embed = new Discord.MessageEmbed()
                        .setColor("#FFBD33")
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .addField("Chances:", `:apple: \`\`${config.servers[index1].options.chance1}\`\`\n:banana: \`\`${config.servers[index1].options.chance2}\`\`\n:watermelon: \`\`${config.servers[index1].options.chance3}\`\`\n:tomato: \`\`${config.servers[index1].options.chance4}\`\`\n:peach: \`\`${config.servers[index1].options.chance5}\`\``)
                    message.channel.send(embed);
                }

            }

        }
    } else if (args[0] == "!payouts") {
        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor("#FFBD33")
            .addField("Payouts: ", ":apple::apple: ``1.25``\n:apple::apple::apple: ``1.5``\n:banana::banana: ``1.5``\n:banana::banana::banana: ``2.0``\n:watermelon::watermelon: ``2.25``\n:watermelon::watermelon::watermelon: ``2.75``\n:tomato::tomato: ``3.0``\n:tomato::tomato::tomato: ``3.5``\n:peach::peach: ``4.0``\n:peach::peach::peach: ``5.0``");
        message.channel.send(embed);
    }


})

client.login("token");

export function readConfigFile(): any {
    return JSON.parse(fs.readFileSync("config.json").toString());
}

export function saveConfigFile(config: any) {
    fs.writeFileSync("config.json", JSON.stringify(config));
}




