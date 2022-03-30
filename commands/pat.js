const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "pat",
  description: "give a pat to the mentioned user",
  category: "Fun",
  usage: "pat <user>",
  run: async (client, message, args) => {
  (async () => {
    
    
  
    try {
    const response = await fetch("https://nekos.life/api/v2/img/pat")
    const body = await response.json();
    const user = message.mentions.users.first();
    if(!user) {
      return message.channel.send({embed: {
      color: 16734039,
      description: "Debes mencionar a alguien para hacerle un pat!"
      }})
    }
    if(user == message.author) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "no se puede a ti mismo ＼( ^o^ )／ !"
    }})
    }
    if(user == client.user) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "Yo no necesito pat (*/ω＼*)"
     }})
    }
    const embed = new Discord.MessageEmbed()
     .setTitle(user.username + " recibio un pat de " + message.author.username, message.guild.iconURL({ dynamic: true, format: 'png'}))
     .setImage(body.url)
     .setURL(body.url)
     .setColor("RANDOM")
     .setDescription((user.toString() + " obtuvo un pat de " + message.author.toString()))
     .setFooter("Requested by " + `${message.author.username}` + " • (＼( ^o^ )／)", message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
     .setTimestamp()
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
