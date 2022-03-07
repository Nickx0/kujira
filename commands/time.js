const Discord = require('discord.js');
const fetch = require("node-fetch");
const config = require("../config.json");
const apikey = config.apikey;
const pool = require('../db-connection.js');
function convertMS(ms) {
    var duracion = new Date(ms)
        var horas = duracion.getHours()
        var minutos = duracion.getMinutes()
        var segundos = duracion.getSeconds()
        return ((horas<10)?'0'+horas:horas)+':'+((minutos<10)?'0'+minutos:minutos)+':'+((segundos<10)?'0'+segundos:segundos)
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
        let selId_vtuber = `SELECT * FROM Pjt3W34Qzv.video WHERE id_vtuber=${key[0].id_vtuber} and estado = 1;`;
        let urlvideos = await pool.query(selId_vtuber);
        console.log(urlvideos);
        if(urlvideos.length==0) return message.channel.send("No esta en vivo ahora...");  
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(liveBroadcastContent),liveStreamingDetails(actualStartTime))&id="+urlvideos[0].id_video+"&key="+apikey;
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        if(r.items.length==0) return message.channel.send("No esta en vivo ahora...");
        startime = r.items[0].liveStreamingDetails.actualStartTime;
        utc = new Date().toISOString();
        date = new Date(startime);
        starmili = date.getTime();  
        date2 = new Date(utc);
        utcmili = date2.getTime(); 
        result=utcmili-starmili;
        timestr = "Lleva "+convertMS(result);
        message.channel.send(timestr);
    } catch (err) {
        console.log(err)
    }
})();}}