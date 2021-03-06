const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
 name: "hug",
 description: "Give a hug to mention user",
 category: "Fun",
 usage: "hug <user>",
 run: async (client, message, args) => {
  (async () => {
   try {
    const user = message.mentions.users.first();
    if(!user) {
     return message.channel.send({embed: {
      color: 16734039,
      description: "Debes mencionar a alguien para abrazar!"
     }})
    }
    if(user == message.author) {
     return message.channel.send({embed: {
      color: 5294200,
      description: "You can't hug yourself but... Ok, get the hug from me ＼( ^o^ )／ !"
     }})
    }
    if(user == client.user) {
     return message.channel.send({embed: {
      color: 5294200,
      description: "Oh, you tried to hug me but u can't... But I can hug you ＼( ^o^ )／"
     }})
    }
    const response = await fetch("https://nekos.life/api/v2/img/cuddle")
    const body = await response.json();
    const embed = new Discord.MessageEmbed()
     .setTitle(user.username + " Just got a hug from " + message.author.username, message.guild.iconURL({ dynamic: true, format: 'png'}))
     .setImage(body.url)
     .setURL(body.url)
     .setColor("RANDOM")
     .setDescription((user.toString() + " got a hug from " + message.author.toString()))
     .setFooter("Requested by " + `${message.author.username}` + " • (this is so cute ＼( ^o^ )／)", message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
     .setTimestamp()
    .setURL(body.url);
    message.channel.send(embed);
   } catch(err) {
    console.log(err);
    message.channel.send({embed: {
     color: 16734039,
     description: "Something went wrong... :cry:"
    }})
   }
  })();
 }
}
