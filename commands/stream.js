const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
 name: "stream",
 description: "Sends a random dog photo",
 category: "Fun",
 run: async (client, message, args) => {
  (async () => {
    try {
        

    } catch(err) {
     message.channel.send({embed: {
      color: 16734039,
      description: "Something went wrong... :cry:"
     }})
    }
   })();
  }
 }
 