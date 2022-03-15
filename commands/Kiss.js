const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "kiss",
  description: "besa usuario",
  category: "Fun",
  usage: "cuddle <user>",
  run: async (client, message, args) => {
  (async () => {
    var list = [
        'https://https://i.pinimg.com/originals/6e/4f/fe/6e4ffe54a38656cda96ba3eec67c84b4.gif.imgur.com/S8yQ9As.gif',
        'https://pa1.narvii.com/6173/d3da59e3ac5fd46d87b5f818cf171f48edc7560a_hq.gif',
        'https://k33.kn3.net/taringa/2/1/6/5/7/4/06/em0xx/39F.gif',
        'https://i.pinimg.com/originals/49/7a/55/497a5523d9b1ca23db84ecc3f5d8b1b3.gif',
        'https://66.media.tumblr.com/2c0afb2bce3dea809f5e9dd283dc459b/tumblr_oh2v64hpfy1tlmyzco1_500.gif',
        'http://pa1.narvii.com/6115/d956e6cdfcb94780993afc12a7be993cf6160ea5_00.gif',
        'https://i.pinimg.com/originals/ed/32/69/ed32698a1bb485b468cc99ddee945262.gif',
        'https://i.pinimg.com/originals/fd/72/35/fd7235ee48694b601d7bca43fbf73709.gif',
  ];
  
  var rand = list[Math.floor(Math.random() * list.length)];
    try {
    const user = message.mentions.users.first();
    if(!user) {
      return message.channel.send({embed: {
      color: 16734039,
      description: "Debes mencionar a alguien para besar!"
      }})
    }
    if(user == message.author) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "No te beses a ti mismo ＼( ^o^ )／ !"
    }})
    }
    if(user == client.user) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "No me beses a mi pls (^///^)"
     }})
    }
    const embed = new Discord.MessageEmbed()
     .setTitle(user.username + " fue besado por " + message.author.username, message.guild.iconURL({ dynamic: true, format: 'png'}))
     .setImage(rand)
     .setURL(rand)
     .setColor("RANDOM")
     .setDescription((user.toString() + " recibio un beso de " + message.author.toString()))
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