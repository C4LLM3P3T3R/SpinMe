import * as Discord from "discord.js";

export = {
    name: "payouts",
    description: "Shows the pyaouts table",
    execute: async(client, message, args) => {
    
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor("#FFBD33")
                .addField("Payouts: ", ":apple::apple: ``1.25``\n:apple::apple::apple: ``1.5``\n:banana::banana: ``1.5``\n:banana::banana::banana: ``2.0``\n:watermelon::watermelon: ``2.25``\n:watermelon::watermelon::watermelon: ``2.75``\n:tomato::tomato: ``3.0``\n:tomato::tomato::tomato: ``3.5``\n:peach::peach: ``4.0``\n:peach::peach::peach: ``5.0``");
            message.channel.send(embed);
        
    }
}