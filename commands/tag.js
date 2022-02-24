const Discord = require('discord.js');
const data = require("../shared-data.json");
const fetch = require("node-fetch");
const db = require("megadb");
const fs = require('fs');
var request = require("request");

const vtuberChannelId = data.vtuberChannelId
const discordChannelId = data.discordChannelId
//const tagDb = new db.crearDB("tags")

//const ytdb = new db.crearDB("X")
function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

module.exports = {
    name: "t",
    description: "tags para streams",
    category: "Utility",
    run: async (client, message, args) => {
    (async () => {
    try {
       var channel = message.channel.id//get ID from the channel
       if(args[0]==="start"){
            
            url = matchYoutubeUrl(args[1]);
            console.log(url)
            if (url===false) return message.channel.send("NO ES UN LINK DE YOUTUBE");
            idx = discordChannelId.indexOf(channel)//get idx of channel
            console.log(idx)

            var r = request.get(`https://www.youtube.com/channel/${vtuberChannelId[idx]}/live`,function(e,response,body){//get vtuber youtube channel from index
                console.log(r.uri.href)
                console.log(response.headers)
                //console.log(body)
            })
            //console.log(r)
            //`https://www.youtube.com/channel/${vtuberChannelId[idx]}/live`
            //lastUrl = await fetch(`https://www.youtube.com/channel/${vtuberChannelId[idx]}/live`);//getting last url video from channel
            //console.log(lastUrl)
            //lastUrl = matchYoutubeUrl(lastUrl)
            /*if(lastUrl!==false)
            {
                console.log(lastUrl)
                return message.channel.send(lastUrl);
            }
            if(url===lasturl){
                if(tagDb.tiene(url,{ChannelID:vtuberChannelId[idx],discordChannelId:channel.ChannelID})){
                    tagDb.establecer(url,[])
                }else{
                    message.channel.send("El stream ya ha sido configurado")
                }

            }*/

        }else if(args[0]==="give"){
        }
        else if(args[0]==="tags"){
            url = matchYoutubeUrl(args[1]);
            console.log(url);
            console.log(channel+url);
            let rawdata = fs.readFileSync(`mega_databases/${channel+url}.json`);
            let student = JSON.parse(rawdata);
            console.log(student);
            const embed = new Discord.MessageEmbed()
                .setColor('#1BC1D5')
                .setDescription(`**${message.author}** PIDIO LOS TAGS`)
                .setAuthor(message.author.tag, avatar);
            return message.channel.send(embed);
        }
    } catch (err) {
        console.log(err)
    }
})();}}
