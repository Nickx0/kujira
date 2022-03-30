const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../config");
const apikey = config.apikey;
var {vtuberlist,yTlives} = require('../lives.js');

function verifyURL(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}
function parseDurationString(durationString){
    var stringPattern = /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/;
    var stringParts = stringPattern.exec( durationString );
    return (
             (
               (
                 ( stringParts[1] === undefined ? 0 : stringParts[1]*1 )  /* Days */
                 * 24 + ( stringParts[2] === undefined ? 0 : stringParts[2]*1 ) /* Hours */
               )
               * 60 + ( stringParts[3] === undefined ? 0 : stringParts[3]*1 ) /* Minutes */
             )
             * 60 + ( stringParts[4] === undefined ? 0 : stringParts[4]*1 ) /* Seconds */
           );
}
function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return ((h!==0)?(h<10)?'0'+h+':':h+':':'')+((m<10)?'0'+m:m)+':'+((s<10)?'0'+s:s);
}
module.exports = {
 name: "stream",
 description: "get information about a stream",
 category: "Fun",
 usage: "stream [ytlink]",
 run: async (client, message, args) => {
  (async () => {
    try {
        idVideo = ""
        if(args.length !== 0) {idVideo = verifyURL(args[0])}
        if(args.length === 0) {
            let channel = message.channel.id;
            let callvtuberkey = `select a.canal_alerta_key,v.id_vtuber
            from canal_alerta a 
            inner join vtuberlist v
            on a.id_canal_alerta = v.id_canal_alerta
            Where a.canal_alerta_key = '${channel}'`;
            let key = await pool.query(callvtuberkey);
            if(key.length!==1) return message.channel.send("Opcion no disponible en este canal");
            console.log(key);
            let selId_vtuber = `SELECT * FROM Pjt3W34Qzv.video WHERE id_vtuber='${key[0].id_vtuber}' and estado=1`
            let urlvideos = await pool.query(selId_vtuber);
            idVideo = urlvideos[0].id_video
        }
        console.log(`Stream: ${idVideo}`);
        if(idVideo===""||idVideo===false){
            return message.channel.send({embed: {
                color: 16734039,
                description: "URL INVALIDA"
            }})
        };
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails,contentDetails&fields=items(snippet(title,channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers),statistics(viewCount),contentDetails(duration))&id="+IdUrl+"&key="+apikey;
        //Json FIle Api to object
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        let stat=(r.items[0].snippet.liveBroadcastContent==="live")? "En Vivo":(r.items[0].snippet.liveBroadcastContent==="none")?"Finalizado":"En Espera";
        console.log(stat);
        let img = "https://img.youtube.com/vi/"+IdUrl+"/maxresdefault.jpg";
        let ltimg = "https://img.youtube.com/vi/"+IdUrl+"/mqdefault.jpg";
        var view = "???",timestr;
        if(stat==="Finalizado"){
            let time = r.items[0].contentDetails.duration;
            let val = 1000 * parseDurationString(time);
            timestr = convertMS(val);
        }else{
            startime = r.items[0].liveStreamingDetails.scheduledStartTime;
            date = new Date(startime);
            starmili = date.getTime();
            timestr = (stat==="En Espera")? `Inicia <t:${starmili/1000}:R>` :`Empezo <t:${starmili/1000}:R>`;
        }
        //Message Emmbed
        const embed = new Discord.MessageEmbed()
            .setTitle(`${r.items[0].snippet.title}`)
            .setImage(img)
            .setDescription(r.items[0].snippet.channelTitle)
            .setThumbnail(ltimg)
            .setColor("PURPLE")
            .addFields(
                { name: 'Status', value: `${stat}`, inline: true },
                { name: 'Time', value: `${timestr}`, inline: true },
                { name: 'Viewers', value: `${view}`, inline: true },
            )
            .setTimestamp()
            .setURL("https://www.youtube.com/watch?v="+IdUrl)
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
 