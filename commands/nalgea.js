const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "spank",
  description: "spank a user",
  category: "Fun",
  usage: "spank <user>",
  run: async (client, message, args) => {
  (async () => {
    var list = [
      'https://c.tenor.com/Dcdf0if-PlsAAAAC/anime-school-girl.gif',
      'https://c.tenor.com/vDpHmAfgA6wAAAAC/cxz-spank.gif',
      'http://pa1.narvii.com/5792/c53f613f30bd0053e1eb561d336db90f2a02ec46_hq.gif',
      'https://c.tenor.com/B5oC9lACJ9kAAAAC/anime-spank.gif',
      'https://c.tenor.com/fgxHmZDTkrcAAAAC/anime-spanking.gif',
  ];
  
  var rand = list[Math.floor(Math.random() * list.length)];
    try {
    const user = message.mentions.users.first();
    if(!user) {
      return message.channel.send({embed: {
      color: 16734039,
      description: "Debes mencionar a alguien para nalgear!"
      }})
    }
    if(user == message.author) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "No te nalgees a ti mismo ＼( ^o^ )／ !"
    }})
    }
    if(user == client.user) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "No me nalgees por favor ＼( ^o^ )／"
     }})
    }
    const embed = new Discord.MessageEmbed()
     .setTitle(user.username + " fue nalgeado por " + message.author.username, message.guild.iconURL({ dynamic: true, format: 'png'}))
     .setImage(rand)
     .setURL(rand)
     .setColor("RANDOM")
     .setDescription((user.toString() + " fue nalgeado por " + message.author.toString()))
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
