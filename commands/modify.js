const {datadb} = require('../mongodb.js');
const {MongoClient} = require('mongodb');
const pool = require('../db-connection.js');
var mongoclient = new MongoClient(datadb.uri);
module.exports = {
    name: "modify",
    description: "Modify tags",
    category: "Utility",
    usage: "modify <number of tag> [timeout] [tag]",
    run: async (client, message, args) => {
    (async () => {
    try {  
        var moreseconds=0,Tag;
        let channel = message.channel.id;
        let callvtuberkey = `select a.canal_alerta_key,v.id_vtuber
        from canal_alerta a 
        inner join vtuberlist v
        on a.id_canal_alerta = v.id_canal_alerta
        Where a.canal_alerta_key = '${channel}'`;
        let key = await pool.query(callvtuberkey);
        if(key.length!==1) return message.channel.send("Opcion no disponible en este canal");
        let selId_vtuber = `SELECT * FROM Pjt3W34Qzv.video WHERE id_vtuber='${key[0].id_vtuber}' and estado=1 ORDER BY id_videos DESC`
        let urlvideos = await pool.query(selId_vtuber);
        if(urlvideos.length===0) return message.channel.send("No esta en vivo ahora...");
        if(isNaN(args[0])) return message.channel.send("Seleccione un tag a modificar");
        await mongoclient.connect();
        const database = mongoclient.db('kujirabot');
        const Url = database.collection('Url');
        dataVideo = await Url.findOne( { _id: `${urlvideos[0].id_video}` } )
        if(!isNaN(args[1])){
            if(args[1].startsWith("+")||args[1].startsWith("-")){
                moreseconds=parseInt(args[1]);
                Tag = args.slice(2,args.length).join(" ");
            }else{
                return message.channel.send("Coloque + o - para cambiar los segundos")
            }
            
        }else{
            Tag = args.slice(1,args.length).join(" ");
        }
        if(Tag==''){
            Tag=dataVideo.tag[args[0]-1];
        }
        let Tags=dataVideo.tag[args[0]-1]; 
        secondsOfTag=dataVideo.segundo[args[0]-1];
        secondsOfNewTag = parseInt(secondsOfTag)+moreseconds;
        secondsOfNewTag = secondsOfNewTag.toString()
        Url.updateOne(
            { _id: `${urlvideos[0].id_video}`, segundo: secondsOfTag , tag : Tags},
            { $set: { "segundo.$" : secondsOfNewTag ,
                    "tag.$":Tag } }        
        )
        try {
            message.react('👍').catch(() => message.reply("👍"));
        } catch (error) {
            
        }
    } catch (err) {
        console.log(err);
    }
})();}}