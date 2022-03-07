const Discord = require('discord.js');
const fetch = require("node-fetch");
const config = require("../config.json");
const db = require("megadb");
const apikey = config.apikey;
const pool = require('../db-connection.js');
/*function convertMS(ms) {
    var duracion = new Date(ms)
        var horas = duracion.getHours()
        var minutos = duracion.getMinutes()
        var segundos = duracion.getSeconds()
        return ((horas<10)?'0'+horas:horas)+':'+((minutos<10)?'0'+minutos:minutos)+':'+((segundos<10)?'0'+segundos:segundos)
}*/

module.exports = {
    name: "t",
    description: "tags para streams",
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
        let selId_vtuber = `SELECT * FROM Pjt3W34Qzv.video WHERE id_vtuber='${key[0].id_vtuber}' and estado=1`
        let urlvideos = await pool.query(selId_vtuber);
        if(urlvideos.length===0) return message.channel.send("No esta en vivo ahora...");
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(liveBroadcastContent),liveStreamingDetails(actualStartTime))&id="+urlvideos[0].id_video+"&key="+apikey;
        //Json FIle Api to object
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        offset = 5;
        let tag = "";
        if(args.length===0) return message.channel.send("Coloca un tag...");
        if(!isNaN(args[0]))
        {
            offset = args[0];
            tag = args.slice(1,args.length).join(" ");
        }else{
            tag = args.join(" ");
        }
        startime = r.items[0].liveStreamingDetails.actualStartTime;
        utc = new Date().toISOString();

        date = new Date(startime);
        starmili = date.getTime();  

        date2 = new Date(utc);
        utcmili = date2.getTime(); 

        result=utcmili-starmili;
        console.log(offset);
        tagTime = ((result/1000).toFixed())-offset;
        let tags = new db.crearDB(`${urlvideos[0].id_video}`)
        if(tags.tiene(tag)){
            for(i=1;;i++){
                if(!tags.tiene(tag+`(${i})`)){
                    tags.establecer(tag+`(${i})`,tagTime);
                    return;
                }
            }
        }else{
            tags.establecer(tag,tagTime);
        }
    } catch (err) {
        console.log(err);
    }
})();}}