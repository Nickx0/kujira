const Discord = require('discord.js');
const fetch = require("node-fetch");
const config = require("../config.json");
const apikey = config.apikey;
const pool = require('../db-connection.js');
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
    return h + ':' + m + ':' + s;
}

module.exports = {
    name: "time",
    description: "momento actual de stream",
    category: "Utility",
    run: async (client, message, args) => {
    (async () => {
    try {
        let channel = message.channel.id;
        let callvtuberkey = `select a.canal_alerta_key,v.id_vtuber
        from canal_alerta a 
        inner join vtuberlist v
        on a.id_canal_alerta = v.id_canal_alerta
        Where a.canal_alerta_key = '${channel}'`;
        let key = await pool.query(callvtuberkey);
        let selId_vtuber = `SELECT * FROM Pjt3W34Qzv.video WHERE id_vtuber='${key[0].id_vtuber}' ORDER BY id_videos DESC`
        let urlvideos = await pool.query(selId_vtuber);
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails&fields=items(snippet(publishedAt,title,description,thumbnails(standard),channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers,actualEndTime),statistics(viewCount),contentDetails(duration))&id="+urlvideos[0].id_video+"&key="+apikey;
        //Json FIle Api to object
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        stat=r.items[0].snippet.liveBroadcastContent;
        if(stat==="live"){
            startime = r.items[0].liveStreamingDetails.scheduledStartTime;
            utc = new Date().toISOString();
    
            date = new Date(startime);
            starmili = date.getTime();  
    
            date2 = new Date(utc);
            utcmili = date2.getTime(); 
    
            result=utcmili-starmili;
    
            timestr = "Lleva "+convertMS(result);
    
            message.channel.send(timestr);
        } else {
            message.channel.send("No esta en vivo ahora...");
        }
    } catch (err) {
        console.log(err)
    }
})();}}