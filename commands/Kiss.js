const Discord = require('discord.js')

module.exports = {
    name: "kiss",
    category: "Fun",
    run: async(client, message, args) => {

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
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
    return message.reply('Menciona un usuario valido para el comando')
}
/*
message.channel.send(`${message.author.username} **acaba de besar a** ${user.username}! :heart:`, {files:[rand]});
*/

let avatar = message.author.displayAvatarURL({format: "png"});
    const embed = new Discord.MessageEmbed()
            .setColor('#1BC1D5')
            .setDescription(`**${message.author}** acaba de besar a **${user}**`)
            .setImage(rand)
            .setTimestamp()
            .setFooter('Beso Beso Beso')
            .setAuthor(message.author.tag, avatar);
            message.channel.send(embed);

    }
}