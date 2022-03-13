const Discord = require("discord.js");
const { apikey2, apikey } = require("../../config.json");
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
        try {
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
                    let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails&fields=items(snippet(title,channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers),statistics(viewCount))&id="+lastIdUrl+"&key="+apikey;
                    let apirl = await fetch(apiurl);
                    let r = await apirl.json();
                    let stat=(r.items[0].snippet.liveBroadcastContent==="live")? "En Vivo":(r.items[0].snippet.liveBroadcastContent==="none")?"Finalizado":"En Espera";
                    let estado =(r.items[0].snippet.liveBroadcastContent==="live")? 1:(r.items[0].snippet.liveBroadcastContent==="none")?0:2;
                    let addData = `INSERT INTO Pjt3W34Qzv.video(id_videos,id_vtuber,id_video,estado) VALUES(NULL,'${vtuberdata[0].id_vtuber}','${lastIdUrl}','${estado}')`;
                    await pool.query(addData);
                    if(stat!=="Finalizado"){
                        let img = "https://img.youtube.com/vi/"+lastIdUrl+"/maxresdefault.jpg";
                        var view = "???",timestr;
                        startime = r.items[0].liveStreamingDetails.scheduledStartTime;
                        date = new Date(startime);
                        starmili = date.getTime();
                        timestr = (stat==="En Espera")? `Inicia <t:${starmili/1000}:R>` :`Empezo <t:${starmili/1000}:R>`;
                        //Message Emmbed
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${r.items[0].snippet.title}`)
                            .setImage(img)
                            .setDescription(r.items[0].snippet.channelTitle)
                            .setThumbnail(vtuberdata[0].logo)
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

            let vt='SELECT * FROM Pjt3W34Qzv.video Where estado=1 Or estado=2 ORDER BY id_videos DESC'; // CAMBIAR A 1 Y 2
            let bd = await pool.query(vt);
            for(i=0;i<bd.length;i++){
            try {
                console.log(bd[i].id_video);
                let apixurl2 = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(liveBroadcastContent))&id="+bd[i].id_video+"&key="+apikey2;
                let luapi2 = await fetch(apixurl2);
                let respon2 = await luapi2.json();
                let estado =(respon2.items.length==0)?0:(respon2.items[0].snippet.liveBroadcastContent==="live")? 1:(respon2.items[0].snippet.liveBroadcastContent==="none")?0:2;
                if(bd[i].estado!==estado){
                    let up_estado=`UPDATE Pjt3W34Qzv.video SET estado = ${estado} WHERE id_videos = ${bd[i].id_videos};`; 
                    await pool.query(up_estado);
                    if(estado===1 && bd[i].estado!==estado){
                        let apixurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(title,channelTitle,liveBroadcastContent),liveStreamingDetails(actualStartTime,concurrentViewers))&id="+bd[i].id_video+"&key="+apikey2;
                        let luapi = await fetch(apixurl);
                        let respon = await luapi.json();
                        let vtx=`select v.id_vtuber,v.nombre,v.channelid,v.activo,a.canal_alerta_key,
                        c.value_color,e.logo
                        from vtuberlist v 
                        inner join canal_alerta a
                        on v.id_canal_alerta = a.id_canal_alerta
                        inner join empresa e
                        on v.id_empresa = e.id_empresa
                        inner join colores c
                        on v.id_color=c.id_color
                        Where v.id_vtuber = '${bd[i].id_vtuber}'`
                        let bdx = await pool.query(vtx);
                        let img2 = "https://img.youtube.com/vi/"+bd[i].id_video+"/maxresdefault.jpg";
                        let view2 = respon.items[0].liveStreamingDetails.concurrentViewers;
                        startime2 = respon.items[0].liveStreamingDetails.actualStartTime;
                        date2 = new Date(startime2);
                        starmili2 = date2.getTime();
                        let timestr2 = `Empezo <t:${starmili2/1000}:R>`;
                        let embed2 = new Discord.MessageEmbed()
                            .setTitle(`${respon.items[0].snippet.title}`)
                            .setImage(img2)
                            .setDescription(respon.items[0].snippet.channelTitle)
                            .setThumbnail(bdx[0].logo)
                            .setColor(bdx[0].value_color)
                            .addFields(
                                { name: 'Status', value: `En Vivo`, inline: true },
                                { name: 'Time', value: `${timestr2}`, inline: true },
                                { name: 'Viewers', value: `${view2}`, inline: true },
                            )
                            .setTimestamp()
                            .setURL("https://www.youtube.com/watch?v="+bd[i].id_video)
                        message.channels.cache.get(bdx[0].canal_alerta_key).send(embed2);
                    }
                }
            } catch (error) {
                console.log(error);
            } 
        }
        } catch (error) {
                
        }
        
    }, 90000); 
    } catch(err) {
        console.log(err);
    message.channel.send({embed: {
        color: 16734039,
        description: "Algo salio mal... :cry:"
        }})
    }
}