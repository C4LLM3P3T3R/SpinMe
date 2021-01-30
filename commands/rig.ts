import { readConfigFile, saveConfigFile } from "..";
import * as Discord from "discord.js";

export = {
    name: "rig",
    description: "Rigs the machine",
    execute: async(client, message, args) => {
        if(message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {
            if (args[4]) {
    
    
                let config = readConfigFile();
                let server = message.guild.id;
                for (let index = 0; index < args.length; index++) {
                    if (isNaN(parseInt(args[index]))) {
                        return message.reply("Wrong chance values!");
                    }
                }
                if (parseInt(args[0]) + parseInt(args[1]) + parseInt(args[2]) + parseInt(args[3]) + parseInt(args[4]) == 100) {
                    for (let index1 = 0; index1 < config.servers.length; index1++) {
                        if (config.servers[index1].id == server) {
    
                            config.servers[index1].options.chance1 = args[0];
                            config.servers[index1].options.chance2 = args[1];
                            config.servers[index1].options.chance3 = args[2];
                            config.servers[index1].options.chance4 = args[3];
                            config.servers[index1].options.chance5 = args[4];
    
                        }
    
                    }
                    saveConfigFile(config);
                    return message.reply("*beep beep, boop boop* MACHINE RIGGED SUCCESFULLY");
    
                } else {
                    return message.reply("Chances summed must be 100");
                }
            } else if (args[0] == "reset") {
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
        } 
    }
}