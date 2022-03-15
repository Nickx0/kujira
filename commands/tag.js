const Discord = require('discord.js');
const fetch = require("node-fetch");
const config = require("../config.json");
const {datadb} = require('../mongodb.js');
const db = require("megadb");
const apikey = config.apikey;
const pool = require('../db-connection.js');
const {MongoClient} = require('mongodb');
var mongoclient = new MongoClient(datadb.uri);
module.exports = {
    name: "t",
    description: "tags para streams",
    category: "Utility",
    run: async (client, message, args) => {
    (async () => {
    try {  
        await mongoclient.connect();
        const database = mongoclient.db('kujirabot');
        const Url = database.collection('Url');
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
        if(urlvideos.length===0) return message.channel.send("No esta en vivo ahora...");
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(title,liveBroadcastContent),liveStreamingDetails(actualStartTime))&id="+urlvideos[0].id_video+"&key="+apikey;
        //Json FIle Api to object
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        const query = { _id: `${urlvideos[0].id_video}`,titulo:`${r.items[0].snippet.title}`};
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
        try {
            await Url.insertOne(query);
        } catch (error) {
            Url.updateOne(
                { _id: `${urlvideos[0].id_video}` },
                { $push: { tag: `${tag}`,segundo:`${tagTime}` } }
        )
        }
        message.react('👌');
    } catch (err) {
        console.log(err);
    }
})();}}