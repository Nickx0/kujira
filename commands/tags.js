const Discord = require('discord.js');
const fetch = require("node-fetch");
const config = require("../config.json");
const db = require("megadb");
const {datadb} = require('../mongodb.js');
const apikey = config.apikey;
const pool = require('../db-connection.js');
const {MongoClient} = require('mongodb');
var mongoclient = new MongoClient(datadb.uri);
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
    return ((h<10)?'0'+h:h)+':'+((m<10)?'0'+m:m)+':'+((s<10)?'0'+s:s);
}

function verifyURL(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

module.exports = {
    name: "tags",
    description: "Obtiene los tags de streams",
    category: "Utility",
    run: async (client, message, args) => {
    (async () => {
    try {
        await mongoclient.connect();
        const database = mongoclient.db('kujirabot');
        const Url = database.collection('Url');
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
            let selId_vtuber = `SELECT * FROM Pjt3W34Qzv.video WHERE id_vtuber='${key[0].id_vtuber}' and estado=1`
            let urlvideos = await pool.query(selId_vtuber);
            idVideo = urlvideos[0].id_video
        }       

        if(idVideo===""||idVideo===false) return
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(channelTitle,liveBroadcastContent),liveStreamingDetails(actualStartTime))&id="+idVideo+"&key="+apikey;
        //Json FIle Api to object
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        dataVideo = await Url.findOne( { _id: `${idVideo}` } )
        console.log(dataVideo);
        var descriptiontag = `[${dataVideo.titulo}](https://www.youtube.com/watch?v=${idVideo})\nHora de inicio: <t:${new Date(r.items[0].liveStreamingDetails.actualStartTime).getTime()/1000}:R>\nTags : ${dataVideo.segundo.length}\n`
        console.log(dataVideo.segundo.length);
        console.log(descriptiontag.lenght);
        for(i=0;i<dataVideo.segundo.length;i++){
            descriptiontag +=`[${convertMS(dataVideo.segundo[i]*1000)}](https://www.youtube.com/watch?v=${idVideo}&t=${dataVideo.segundo[i]}) : ${dataVideo.tag[i]} \n`;
            if(descriptiontag.length>3000){
                const embed = new Discord.MessageEmbed()
                .setTitle(`Tags de ${r.items[0].snippet.channelTitle}`)
                .setDescription(descriptiontag);
                message.channel.send(embed);
                descriptiontag ='';
            }
        };
        if(descriptiontag==='') return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`Tags de ${r.items[0].snippet.channelTitle}`)
            .setDescription(descriptiontag);
        message.channel.send(embed);
        
    } catch (err) {
        console.log(err)    
    }
})();}}