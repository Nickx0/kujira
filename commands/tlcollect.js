const Discord = require('discord.js');
const fetch = require("node-fetch");
const config = require("../config.json");
const apikey = config.apikey3;
const pool = require('../db-connection.js');
const YouTube = require('youtube-live-chat');
const tlTextES = /^\[es\]|\[esp\]|\(es\)\(esp\)$/
const tlTextEN= /^\[en\]|\(en\)$/
const tlTextJP = /^\[jp\]|\(jp\)$/

module.exports = {
    name: "tlcollector",
    description: "tlcollector para streams",
    category: "Utility",
    run: async (client, message, args) => {
    (async () => {
    try {
        let channel = message.channel.id;
        let query = `select a.canal_alerta_key,v.channelid
        from canal_alerta a 
        inner join vtuberlist v
        on a.id_canal_alerta = v.id_canal_alerta
        Where a.canal_alerta_key = '${channel}'`;
        let yTchannel = await pool.query(query);
        let yt = new YouTube(yTchannel[0].channelid, apikey);
        query = `SELECT e.logo_dc,v.channelid FROM Pjt3W34Qzv.empresa e 
        inner join Pjt3W34Qzv.vtuberlist v on v.id_empresa=e.id_empresa`;
        let channelids = await pool.query(query);
        
        yt.on('ready', () => {
            message.channel.send('Listo para recoger las traducciones!')
            yt.listen(8000)
          })
           
        yt.on('message', data => {
          let text = ""
          if(data.snippet.displayMessage.toLowerCase().match(tlTextES)){
            text += `:flag_ea: ||${data.authorDetails.displayName}||: `
          }
          if(data.snippet.displayMessage.toLowerCase().match(tlTextEN)){
            text += `:flag_gb: ||${data.authorDetails.displayName}||: `
          }
          if(data.snippet.displayMessage.toLowerCase().match(tlTextJP)){
            text += `:flag_jp: ||${data.authorDetails.displayName}||: `
          }
          channelids.forEach(element => {
            if(data.snippet.authorChannelId===element.channelid)
            text += element.logo_dc+` ${data.authorDetails.displayName}: `
          });
          if(text.length!==0){
            text+="``"+data.snippet.displayMessage+"``"
            message.channel.send(text)
            text = ""
          }
        })
           
        yt.on('error', error => {
          console.error(error)
          message.channel.send("No está en vivo o el directo a finalizado")
        })

    } catch (err) {
        console.log(err);
    }
})();}}