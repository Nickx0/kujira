const Discord = require("discord.js");
const config = require("../../config.json");
const apikey = config.apikey;
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const got = require("got");
const pool = require('../../db-connection.js');
var lastIdUrl;
async function getLastId(urlx){
    let urs = "https://www.youtube.com/feeds/videos.xml?channel_id="+urlx;
        //Xml File to Json
    await got(urs).then(response => {
        let dom = new JSDOM(response.body);
        console.log(dom.window.document.querySelector('title').textContent);
        let vsg = dom.window.document.getElementsByTagName("yt:videoId");
        lastIdUrl = vsg[0].textContent;
      }).catch(err => {
        console.log(err);
      });
}
let totalVT='SELECT * FROM Pjt3W34Qzv.vtuberlist';
module.exports = async(message,client) => {
    try {
        setInterval(async function(){
        const totalDb = await pool.query(totalVT);
        for(i=1;i<=totalDb.length;i++){
            let calldata=`select v.id_vtuber,v.nombre,v.channelid,v.activo,a.canal_alerta_key,
            c.value_color,e.logo
            from vtuberlist v 
            inner join canal_alerta a
            on v.id_canal_alerta = a.id_canal_alerta
            inner join empresa e
            on v.id_empresa = e.id_empresa
            inner join colores c
            on v.id_color=c.id_color
            Where v.id_vtuber = '${i}'`;
            let vtuberdata = await pool.query(calldata);
            console.log(vtuberdata[0].channelid)
            let r = vtuberdata[0];
            await getLastId(vtuberdata[0].channelid);
            console.log(lastIdUrl)
            let compareData = `SELECT * FROM Pjt3W34Qzv.video WHERE id_video='${lastIdUrl}'`
            let compare = await pool.query(compareData);
            if(compare.length===0){
                let addData = `INSERT INTO Pjt3W34Qzv.video(id_videos,id_vtuber,id_video) VALUES(NULL,'${vtuberdata[0].id_vtuber}','${lastIdUrl}')`;
                await pool.query(addData);
                let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails,contentDetails&fields=items(snippet(publishedAt,title,description,thumbnails(standard),channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers,actualEndTime),statistics(viewCount),contentDetails(duration))&id="+lastIdUrl+"&key="+apikey;
                const apirl = await fetch(apiurl);
                const r = await apirl.json();
                let stat=(r.items[0].snippet.liveBroadcastContent==="live")? "En Vivo":(r.items[0].snippet.liveBroadcastContent==="none")?"Finalizado":"En Espera";
                console.log(stat);
                if(stat!=="Finalizado"){
                    let img = "https://img.youtube.com/vi/"+lastIdUrl+"/maxresdefault.jpg";
                    let ltimg = "https://img.youtube.com/vi/"+lastIdUrl+"/mqdefault.jpg";
                    var view = "???",timestr;
                    startime = r.items[0].liveStreamingDetails.scheduledStartTime;
                    date = new Date(startime);
                    starmili = date.getTime();
                    timestr = (stat==="En Espera")? `Inicia <t:${starmili/1000}:R>` :`Empezo <t:${starmili/1000}:R>`;
                    //Message Emmbed
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${r.items[0].snippet.title}`)
                        .setImage(img)
                        .setDescription(r.items[0].snippet.channelTitle)
                        .setThumbnail(ltimg)
                        .setColor(vtuberdata[0].value_color)
                        .addFields(
                            { name: 'Status', value: `${stat}`, inline: true },
                            { name: 'Time', value: `${timestr}`, inline: true },
                            { name: 'Viewers', value: `${view}`, inline: true },
                        )
                        .setTimestamp()
                        .setURL("https://www.youtube.com/watch?v="+lastIdUrl)
                    message.channels.cache.get(vtuberdata[0].canal_alerta_key).send(embed);
                };
            }
        }
    }, 60000); 
    } catch(err) {
        console.log(err);
    message.channel.send({embed: {
        color: 16734039,
        description: "Algo salio mal... :cry:"
        }})
    }
}