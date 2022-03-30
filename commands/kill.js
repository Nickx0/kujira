const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "kill",
  description: "kill to mention user",
  category: "Fun",
  usage: "kill <user>",
  run: async (client, message, args) => {
  (async () => {
    var list = [
      'https://media2.giphy.com/media/yGZnLLLmHVEB2/giphy.gif',
      'https://cdn.myanimelist.net/s/common/uploaded_files/1459480838-8ea8a9d1f61eda18186bbf659f8e4162.gif',
      'https://pa1.narvii.com/7043/460d664897a25008a29f89b4f850e53324cad089r1-504-284_hq.gif',
      'https://img1.ak.crunchyroll.com/i/spire1/00339eaee2c1f9fe4b503f20240432fa1436108288_full.gif',
      'https://i.imgur.com/m8ZtlNO.gif',
  ];
  
  var rand = list[Math.floor(Math.random() * list.length)];
    try {
    const user = message.mentions.users.first();
    if(!user) {
      return message.channel.send({embed: {
      color: 16734039,
      description: "You must mention someone to kill!"
      }})
    }
    if(user == message.author) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "You can't kill me ＼( ^o^ )／ !"
    }})
    }
    if(user == client.user) {
      return message.channel.send({embed: {
      color: 5294200,
      description: "Oh, can't kill me pls, i love you ＼( ^o^ )／"
     }})
    }
    const response = await fetch("https://nekos.life/api/v2/img/slap")
    const body = await response.json();
    const embed = new Discord.MessageEmbed()
     .setTitle(user.username + " acaba de ser asesinado por " + message.author.username, message.guild.iconURL({ dynamic: true, format: 'png'}))
     .setImage(rand)
     .setURL(body.url)
     .setColor("RANDOM")
     .setDescription((user.toString() + " fue asesinado por " + message.author.toString()))
     .setFooter("Requested by " + `${message.author.username}` + " • (＼( ^o^ )／)", message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
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
