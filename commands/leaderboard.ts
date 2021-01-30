import { client, readConfigFile } from "..";
import * as Discord from "discord.js";
import * as _ from "lodash";

export = {
    name: "leaderboard",
    description: "Shows the leaderboard",
    execute: async(client, message, args) => {
       
           let leaderboard = [];//ts
            let afterSort : any = [];
            let config = readConfigFile();
            let afterSorttokens = [];
    
            for (let index = 0; index < config.users.length + 1; index++) {
                if (config.users[index])
                    leaderboard.push({ "id": config.users[index].id, "tokens": config.users[index].tokens });
    
            }
            leaderboard = _.orderBy(leaderboard, (item) => {
                return item.tokens;
            }, "desc")
            for (let index = 0; index < 10; index++) {
                if (leaderboard[index]) {
                    afterSort.push(index + 1 + ".", `<@${leaderboard[index].id}>\n`);
                    afterSorttokens.push(`\`\`${leaderboard[index].tokens}\`\``, "\n");
                }
    
    
            }
    
            console.log(afterSort.toString());
            let tokensField = {
                name: "tokens",
                value: afterSorttokens.toString().replace(/,/g, ""),
                inline: true
            }
            if (JSON.stringify(config.users) == "[]") {
                afterSort = "No one is on the leaderboard! Go play, and be the first!";
                tokensField = {
                    name: "tokens",
                    value: "\`\`0\`\`",
                    inline: true
                };
            }
            let embed = new Discord.MessageEmbed()
                .addFields({
                    name: "Leaderboard",
                    value: afterSort.toString().replace(/,/g, ""),
                    inline: true
    
                }, tokensField)
                .setColor("#FFBD33");
            message.channel.send(embed);
        
    }
}