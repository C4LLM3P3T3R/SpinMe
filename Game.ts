import * as Discord from "discord.js";
import { read } from "fs/promises";
import { readConfigFile, saveConfigFile, client } from "./index"
import { getRandomIntInclusive } from "./getRandomIntInclusive";
import { replaceNumbersWithFriuts } from "./replaceNumbersWithFriuts";
import { percentageChance } from "./percentageChance";

export class Game {
    playerId: any;
    coinsWon: number;
    message: Discord.Message;
    newPlayer: boolean;
    firstItem: number;
    secondItem: number;
    thirdItem: number;
    winColor: string;
    slotEmbed: any;
    chance1: number;
    chance2: number;
    chance3: number;
    chance4: number;
    chance5: number;


    constructor(message: Discord.Message) {
        this.playerId = message.author.id;
        this.coinsWon = 0;
        this.message = message;
        this.newPlayer = true;
        this.firstItem = 0;
        this.secondItem = 0;
        this.thirdItem = 0;
        this.winColor = "#FF0000";
        this.slotEmbed;
        this.chance1 = 0;
        this.chance2 = 0;
        this.chance3 = 0;
        this.chance4 = 0;
        this.chance5 = 0;

    }


    spin(amount: any) {
        if(amount < 0) return this.message.reply("You can't bet negative numbers!");
        let config = readConfigFile();
        for (let index = 0; index < config.games.length + 1; index++) {
            if(config.games[index]){
                if(config.games[index].id == this.playerId){
                    return this.message.reply("You already have an active game!");
                }
            }
        }
        config.games.push({"id": this.playerId});

        for (let index = 0; index < config.users.length + 1; index++) {
            if (config.users[index] == undefined) break;

            if (this.playerId == config.users[index].id) {
                if(amount == "max" || amount == "all"){
                    amount = config.users[index].coins;
                }
                if(isNaN(parseInt(amount))) return this.message.reply("Wrong format! !spin <number|max/all>");
                else amount = parseInt(amount);
                
                
                
                if (config.users[index].coins - amount < 0) return this.message.channel.send(`You don't have enough coins! (${config.users[index].coins})`);
                this.newPlayer = false;
                config.users[index].coins -= amount;
                saveConfigFile(config);

                

                this.randomSpin(amount, index);

            }
        }
        if (this.newPlayer == true) {
            config.users.push({ "id": this.playerId, "coins": 1000, "level": 0, "exp": 0 });
            for (let index = 0; index < config.users.length; index++) {

                if (this.playerId == config.users[index].id) {
                    if (config.users[index].coins - amount < 0) return this.message.channel.send(`You don't have enough coins! (${config.users[index].coins})`);
                    config.users[index].coins -= amount;
                    saveConfigFile(config);


                    

                    this.randomSpin(amount, index);




                }
            }

        }



    }

    async randomSpin(amount: any, index: number) {
        let config = readConfigFile();
        for (let index = 0; index < config.servers.length; index++) {
            if(config.servers[index].id == this.message.guild.id){
                this.chance1 = parseInt(config.servers[index].options.chance1);
                this.chance2 = parseInt(config.servers[index].options.chance2);
                this.chance3 = parseInt(config.servers[index].options.chance3);
                this.chance4 = parseInt(config.servers[index].options.chance4);
                this.chance5 = parseInt(config.servers[index].options.chance5);

            }
            
        }
        
        this.firstItem = percentageChance([1,2,3,4,5], [this.chance1, this.chance2, this.chance3, this.chance4, this.chance5]);
        this.secondItem = percentageChance([1,2,3,4,5], [this.chance1, this.chance2, this.chance3, this.chance4, this.chance5]);
        this.thirdItem = percentageChance([1,2,3,4,5], [this.chance1, this.chance2, this.chance3, this.chance4, this.chance5]);
        
        config.users[index].exp += (config.users[index].level * 1.25 )+ 1;
        if(config.users[index].exp >= config.users[index].level * (25 + config.users[index].level)){
            config.users[index].level++;
        }
        saveConfigFile(config);
        if (this.firstItem == this.secondItem && this.firstItem == this.thirdItem) {
            if (this.firstItem == 1) {
                this.coinsWon = amount * 1.5;
            } else if (this.firstItem == 2) {
                this.coinsWon = amount * 2;
            } else if (this.firstItem == 3) {
                this.coinsWon = amount * 2.75;
            } else if (this.firstItem == 4) {
                this.coinsWon = amount * 3.5;
            } else if (this.firstItem == 5) {
                this.coinsWon = amount * 5;
            }

        }
        else if (this.firstItem == this.secondItem || this.thirdItem == this.secondItem) {
            if (this.firstItem == 1 && this.secondItem == 1 || this.thirdItem == 1 && this.secondItem == 1) {
                this.coinsWon = amount * 1.25;
            }
            else if (this.firstItem == 2 && this.secondItem == 2 || this.thirdItem == 2 && this.secondItem == 2) {
                this.coinsWon = amount * 1.5;
            }
            else if (this.firstItem == 3 && this.secondItem == 3 || this.thirdItem == 3 && this.secondItem == 3) {
                this.coinsWon = amount * 2.25;
            }
            else if (this.firstItem == 4 && this.secondItem == 4 || this.thirdItem == 4 && this.secondItem == 4) {
                this.coinsWon = amount * 3;
            }
            else if (this.firstItem == 5 && this.secondItem == 5 || this.thirdItem == 5 && this.secondItem == 5) {
                this.coinsWon = amount * 4;
            }
        }

        

        console.log(`|| ${this.firstItem} || ${this.secondItem} || ${this.thirdItem}`);
        console.log(Math.round(this.coinsWon));
        const rolling = client.emojis.cache.find(emoji => emoji.name === "rolling");



        this.slotEmbed = new Discord.MessageEmbed()
            .setColor("#FFBD33")
            .setTitle(`SLOTS | ${this.message.author.username} | ROLLING`)
            .setThumbnail(this.message.author.avatarURL())
            .addFields({
                name: "\u200B",
                value: `**-----------------\n| ${rolling} | ${rolling} | ${rolling} |\n-----------------**`,
                inline: false
            })

        let sentEmbed = await this.message.channel.send(this.slotEmbed);
        
        setTimeout(async () => {
            
            let config = readConfigFile(); // reading once more because of the 3 seconds timeout
            for (let index = 0; index < config.games.length; index++) {
                if(config.games[index]){ //if this wasn't here 
                    if(config.games[index].id == this.playerId){ //this would crash
                        config.games.splice(index, 1); //delete the game 
                    }
                }
            }

            config.users[index].coins += Math.round(this.coinsWon); // add coins, it already removed the coins for the initial bet
            saveConfigFile(config); // save config
            if (this.coinsWon > 0) this.winColor = "#10dd10";
            let embed = new Discord.MessageEmbed(this.slotEmbed)
                .spliceFields(0, 1)
                .addFields({
                    name: "\u200B",
                    value: `**-----------------\n|${replaceNumbersWithFriuts(this.firstItem.toString())} | ${replaceNumbersWithFriuts(this.secondItem.toString())} | ${replaceNumbersWithFriuts(this.thirdItem.toString())} |\n-----------------**`,
                    inline: false
                },             
                {
                    name: "**Win:**",
                    value: this.coinsWon,
                    inline: true
                },
                {
                    name: "**Tokens:**",
                    value: config.users[index].coins,
                    inline: true
                })
                .setColor(this.winColor)
                .setTitle(`SLOTS | ${this.message.author.username} | ROLLED`);
            sentEmbed.edit(embed);
        }, 3000);
    }

}

