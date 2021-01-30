import { Game } from "../Game";

export = {
    name: "spin",
    description: "Starts the spinning process",
    execute: async(client, message, args) => {
        if (args.length == 1 && !message.author.bot) {
            let game = new Game(message);
            game.spin(args[0]);//ts
        }
    }
}