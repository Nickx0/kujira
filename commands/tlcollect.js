const Discord = require('discord.js');
const fetch = require("node-fetch");
const pool = require('../db-connection.js');
const { LiveChat } = require("youtube-chat")
const tlTextES = /^\[es\]|\[esp\]|\(es\)\(esp\)$/
const tlTextEN= /^\[en\]|\(en\)$/
const tlTextJP = /^\[jp\]|\(jp\)$/

module.exports = {
    name: "tl",
    description: "get the translations from youtube chat",
    category: "Utility",
    usage: "tl",
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
        if(yTchannel.length!==1) return message.channel.send("Opcion no disponible en este canal");
        const liveChat = new LiveChat({channelId: yTchannel[0].channelid})
        query = `SELECT e.logo_dc,v.channelid FROM Pjt3W34Qzv.empresa e 
        inner join Pjt3W34Qzv.vtuberlist v on v.id_empresa=e.id_empresa`;
        let channelids = await pool.query(query);
        liveChat.on("start", (liveId) => {
          message.channel.send('Listo para recoger las traducciones!')
        })
        liveChat.on("chat", (chatItem) => {
          let messages = ""
          let text = ""
          chatItem.message.forEach(element => {
            messages += (element.isCustomEmoji) ? (element.emojiText):((element.text) ? (element.text) : (element.emojiText))
          });
          if(messages.toLowerCase().match(tlTextES)){
            text += `:flag_ea: ||${chatItem.author.name}||: `
          }
          if(messages.startsWith("Es:")||messages.startsWith("ES:")||messages.startsWith("Esp:")||messages.startsWith("ESP:")){
            text += `:flag_ea: ||${chatItem.author.name}||: `
          }
          if(messages.startsWith("En:")||messages.startsWith("EN:")){
            text += `:flag_gb: ||${chatItem.author.name}||: `
          }
          if(messages.startsWith("JP:")||messages.startsWith("Jp:")){
            text += `:flag_jp: ||${chatItem.author.name}||: `
          }
          if(messages.toLowerCase().match(tlTextEN)){
            text += `:flag_gb: ||${chatItem.author.name}||: `
          }
          if(messages.toLowerCase().match(tlTextJP)){
            text += `:flag_jp: ||${chatItem.author.name}||: `
          }
          channelids.forEach(element => {
            if(chatItem.author.channelId===element.channelid)
            text += element.logo_dc+` ${chatItem.author.name}: `
          });
          if(text.length!==0){
            text+="``"+messages+"``"
            message.channel.send(text)
            text = ""
          }
        })

        liveChat.on("end", (reason) => {
          message.channel.send("El directo ha finalizado")
          liveChat.stop()
        })

        liveChat.on("error", (err) => {
          console.log("ocurrió un error",err)
        })
        const ok = await liveChat.start()
        if (!ok) {
          console.log("Failed to start, check emitted error")
        }

    } catch (err) {
        console.log(err);
    }
})();}}