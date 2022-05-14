const Discord = require("discord.js");
const pool = require('../db-connection.js');
const {YTLive} = require("../YTlive/YTlive");

module.exports = {
    name: "live",
    description: "Stream status",
    category: "Live",
    usage: "Live [Companyname]",
    run: async (client, message, args) => {
        (async () => {
        try {
            if (message.author.bot) return;
            const texto = args.join('');
            console.log(texto);
            let filtro = ''
            if(texto!==''){
                filtro = `and e.nombre like '%${texto}%' `;
            }
            callvtuberlist='SELECT DISTINCT e.id_empresa,v.nombre,e.logo_dc,v.channelid,v.id_vtuber,e.nombre as empresa FROM Pjt3W34Qzv.empresa e inner join Pjt3W34Qzv.vtuberlist v on v.id_empresa=e.id_empresa inner join Pjt3W34Qzv.video f on f.id_vtuber=v.id_vtuber where f.estado=1 '+filtro+'ORDER BY e.id_empresa';
            var vtLst='';
            let key = await pool.query(callvtuberlist);
            var empresa = 0; 
            for (let element of key) {
                try{
                    live = new YTLive({channelId: element.channelid});
                    await live.getLiveData();
                    if(live.isLiveNow()){
                        if(empresa!==element.id_empresa){
                            vtLst+=`\n**${element.empresa}** ${element.logo_dc}\n`;
                            empresa = element.id_empresa;
                        }
                        vtLst+=` > ${element.nombre} LIVE\n`;
                    }
                }catch(e){
                    console.log(e)
                    console.log(`GLIVE: ${element.channelid}`)
                }
            }
            const embed = new Discord.MessageEmbed()
            .setTitle(`Vtubers${(texto!=='')?` De ${key[0].empresa}`:''} En Directo`)
            .setDescription(vtLst)
            .setFooter("Requested by " + `${message.author.username}` + " • (＼( ^o^ )／)", message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
            .setTimestamp()
            message.channel.send(embed);

        } catch(err) {
            console.log(err)
            message.channel.send({embed: {
            color: 16734039,
            description: "Algo salio mal... :cry:"
            }})
        }
    })();
}}