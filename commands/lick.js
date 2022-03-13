const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "lick",
  description: "lame un usuario",
  category: "Fun",
  usage: "cuddle <user>",
  run: async (client, message, args) => {
  (async () => {
    var list = [
      'https://c.tenor.com/jyv9sexi1fYAAAAC/anime-lick.gif',
      'https://c.tenor.com/Xb1u2Z6nLRQAAAAC/lick-anime.gif',
      'https://64.media.tumblr.com/12f9c633304e9f349fdb272126d5aa61/tumblr_nogm6mQ68z1uo77uno2_r1_540.gif',
      'https://c.tenor.com/v74xZG0A384AAAAC/anime-lick.gif',
      'https://c.tenor.com/aVvEuNDaZuYAAAAd/lick-anime.gif',
      'https://c.tenor.com/rWtIltahEoAAAAAC/kawaii-lick.gif',
      'https://c.tenor.com/-jl-FNtEIS8AAAAC/anime-lick.gif'
  ];
  
  var rand = list[Math.floor(Math.random() * list.length)];
    try {
    const user = message.mentions.users.first();
    if(!user) {
      return message.channel.send({embed: {
      color: 16734039,
      description: "Debes mencionar a alguien para lamer!"
      }})
    }
    if(user == message.author) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "No te lamas a ti mismo ＼( ^o^ )／ !"
    }})
    }
    if(user == client.user) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "No me lamas a mi pls (^///^)"
     }})
    }
    const embed = new Discord.MessageEmbed()
     .setTitle(user.username + " fue lamido por " + message.author.username, message.guild.iconURL({ dynamic: true, format: 'png'}))
     .setImage(rand)
     .setURL(rand)
     .setColor("RANDOM")
     .setDescription((user.toString() + " recibio una lamida de " + message.author.toString()))
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
