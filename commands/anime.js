const Discord = module.require("discord.js");
const malScraper = require('mal-scraper');

module.exports = {
 name: "anime",
 description: "Search for anime list",
 category: "Fun",
 usage: "animesearch <name>",
 run: async (client, message, args) => {
  try {
   const search = `${args}`;
   malScraper.getInfoFromName(search)
    .then((data) => {
     const embed = new Discord.MessageEmbed()
      .setAuthor(` :mag_right:  My Anime List search result for ${args}`.split(',').join(' '), message.guild.iconURL({ dynamic: true, format: 'png'}))
      .setImage(data.picture)
      .setColor("RANDOM")
      .addField(":flag_gb: Titulo Ingles", data.englishTitle)
      .addField(":flag_jp: Titulo japones", data.japaneseTitle)
      .addField(":book: Formato", data.type)
      .addField(":1234: Episodios", data.episodes)
      .addField(":star2: Categorias", data.rating)
      .addField(":calendar_spiral: Transmisiones", data.aired)
      .addField(":star: Puntaje", data.score)
      .addField(":bar_chart: Stats", data.scoreStats)
      .addField(":link: Link", data.url)
      .setFooter("Requested by " + `${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
      .setTimestamp()
     message.channel.send(embed);
    }).catch((err) => message.channel.send({embed: {
     color: 16734039,
     description: "Please enter a vaild name!"
   }}));
  } catch (err) {
   message.channel.send({embed: {
    color: 16734039,
    description: "Something went wrong... :cry:"
   }})
  }
 }
}
