import * as Discord from "discord.js";

export = {
    name: "help",
    description: "Shows the help menu",
    execute: async(client, message, args) => {
       

            if (args[0] == "admin" && message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .addFields({
                        name: "**Commands**",
                        value: "``!help/!help admin`` - shows this message\n``!spin <amout>`` - bet on the machine!\n``!leaderboard`` - shows the global leaderboad. Go and be the first!\n``!tokens/!tokens <@user>`` - shows your tokens, or the person you pinged\n``!level/!level <@user>`` - shows your level, or the person you pinged\n``!rig`` - shows the current chance percentage\n``!rig <appleChance> <bananaChance> <watermelonChance> <tomatoChance> <peachChance>`` - you can rig the chances of the machine (sum of the chances must be 100).\n``!rig reset`` - resets the chances to default\n``!payouts`` - shows the payouts table",
                        inline: false
                    })
                    .setColor("#FFBD33")
                message.channel.send(embed);
            } else if (args[0] == undefined) {
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
    
    
        
    }
}