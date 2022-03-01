const Discord = require('discord.js');
const fetch = require("node-fetch");
const config = require("../config.json");
const db = require("megadb");
const apikey = config.apikey;
const pool = require('../db-connection.js');
function convertMS(ms) {
    var duracion = new Date(ms)
        var horas = duracion.getHours()
        var minutos = duracion.getMinutes()
        var segundos = duracion.getSeconds()
        return ((horas<10)?'0'+horas:horas)+':'+((minutos<10)?'0'+minutos:minutos)+':'+((segundos<10)?'0'+segundos:segundos)
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
            let selId_vtuber = `SELECT * FROM Pjt3W34Qzv.video WHERE id_vtuber='${key[0].id_vtuber}' ORDER BY id_videos DESC`
            let urlvideos = await pool.query(selId_vtuber);
            idVideo = urlvideos[0].id_video
        }       

        if(idVideo!==""||idVideo!==false) return
        let tagDB = new db.crearDB(`mega_databases/${idVideo}.json`)
        tags = tagDB.map(false, (seg,tag) => `[${convertMS(seg)}](www.youtube.com/watch?v=${idVideo}&t=${seg}) ${tag}`).then(datos => {
            return console.log(datos.join("\n"))
        })
    } catch (err) {
        console.log(err)
    }
})();}}