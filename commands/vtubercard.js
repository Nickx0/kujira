const Discord = require("discord.js");
const ytch = require('yt-channel-info');
const pool = require('../db-connection.js');

module.exports = {
    name: "vtuber",
    description: "Vtuber cards",
    category: "Vtuber",
    usage: "vtuber [name]",
    run: async (client, message, args) => {
        (async () => {
        try {
            if (message.author.bot) return;
            const texto = args.join('');
            console.log(texto);
            if(texto===''){
                callvtuberlist='SELECT e.id_empresa,v.nombre,e.logo_dc,e.nombre as empresa FROM Pjt3W34Qzv.empresa e inner join Pjt3W34Qzv.vtuberlist v on v.id_empresa=e.id_empresa ORDER BY e.id_empresa;'
                var vtLst='';
                let key = await pool.query(callvtuberlist);
                var empresa = 0; 
                key.forEach(element => {
                    if(empresa!==element.id_empresa){
                        vtLst+=`\n**${element.empresa}** ${element.logo_dc}\n`;
                        empresa = element.id_empresa;
                    }
                    vtLst+=` > ${element.nombre}\n`
                });
                const embed = new Discord.MessageEmbed()
                .setTitle(`Vtuber En Lista`)
                .setDescription(vtLst)
                .setFooter("Requested by " + `${message.author.username}` + " • (＼( ^o^ )／)", message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
                .setTimestamp()
                message.channel.send(embed);
            }
            else{
                uniqevt = `SELECT v.nombre,v.channelid,v.twitter,c.value_color,e.nombre as empresa,e.logo FROM Pjt3W34Qzv.vtuberlist v inner join Pjt3W34Qzv.colores c on c.id_color=v.id_color inner join Pjt3W34Qzv.empresa e on e.id_empresa=v.id_empresa where v.nombre like '%${texto}%'`;
                console.log(texto);
                let keyvt = await pool.query(uniqevt);
                if(keyvt.length==0) return message.channel.send("Esa vtuber no existe o lo escribiste mal, usa solo una parte de su nombre...");
                console.log(keyvt[0])
                ytch.getChannelInfo(keyvt[0].channelid).then((response) => {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${response.author}`, message.guild.iconURL({ dynamic: true, format: 'png'}))
                        .setImage(response.authorBanners[0].url)
                        .setThumbnail(keyvt[0].logo)
                        .setDescription(`${(response.subscriberCount)/1000}K Suscriptores`)
                        .setColor(keyvt[0].value_color)
                        .addFields(
                            { name: '<:gatoem:952335362624208956>Empresa', value: `${keyvt[0].empresa}`, inline: true },
                            { name: '<:twitter:952335362028613632>Twitter', value: `[Cuenta](${keyvt[0].twitter} 'optional hovertext')` , inline: true },
                            { name: '<:yt:952335362192187452>Youtube', value: `[Canal](https://www.youtube.com/channel/${keyvt[0].channelid} 'optional hovertext')` , inline: true },
                        )
                        .setFooter("Comando realizado por " + `${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
                        .setTimestamp()
                        .setURL(response.authorUrl);
                        message.channel.send(embed);
                    }).catch((err) => {
                        console.error(err);
                        message.channel.send({embed: {
                            color: 16734039,
                            description: "Algo salio mal...:"
                        }})
                    })
            }
            } catch(err) {
                console.log(err)
            message.channel.send({embed: {
                color: 16734039,
                description: "Algo salio mal... :cry:"
            }})
        }
    })();
}}