import { readConfigFile, saveConfigFile } from "..";
import * as Discord from "discord.js";

export = {
    name: "tokens",
    description: "Shows the tokens of any user",
    execute: async (client, message, args) => {
        let authorObj : any;
        let authorName : any; //ts

        let config = readConfigFile();

        if (args[0]) {
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
                        .addField(`${authorName}`, `Tokens: \`\`${config.users[index].tokens}\`\``);
                    return message.channel.send(embed);
                }
            } catch (error) {
                try {
                    if (config.users[index]) return;
                    config.users.push({ "id": authorObj.id, "tokens": 1000, "level": 0, "exp": 0 });
                    saveConfigFile(config);
                    for (let index = 0; index < config.users.length + 1; index++) {
                        if (config.users[index]) {
                            if (config.users[index].id == authorObj.id) {
                                let embed = new Discord.MessageEmbed()
                                    .setColor("#FFBD33")
                                    .setTitle("**Tokens**")
                                    .addField(`${authorName}`, `Tokens: \`\`${config.users[index].tokens}\`\``);
                                return message.channel.send(embed);
                            }
                        }

                    }
                } catch (error) {
                    return message.reply("Couldn't find the user");
                }

            }



        }



    }
}