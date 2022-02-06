const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
 name: "cat",
 description: "Sends a random cat photo",
 category: "Fun",
 usage: "cat",
 cooldown: 10,
 run: async (client, message, args) => {
  (async () => {
   try {
    const response = await fetch("https://nekos.life/api/v2/img/meow")
    const body = await response.json();
    const embed = new Discord.MessageEmbed()
     .setTitle("Random Cat", message.guild.iconURL({ dynamic: true, format: 'png'}))
     .setImage(body.url)
     .setColor("RANDOM")
     .setFooter("Requested by " + `${message.author.username}` + " • (Aww cute =＾´• ⋏ •`＾=)", message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
     .setTimestamp()
     .setURL(body.url);
    message.channel.send(embed);
   } catch(err) {
    message.channel.send({embed: {
     color: 16734039,
     description: "Something went wrong... :cry:"
    }})
   }
  })();
 }
}

