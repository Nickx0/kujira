const Discord = require('discord.js');
const db = require("megadb");
const fs = require('fs');
//const ytdb = new db.crearDB("X")
function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}
var lasturl="xd";
module.exports = {
    name: "t",
    description: "tags para streams",
    category: "Utility",
    run: async (client, message, args) => {
    (async () => {
    try {
        /*
       channel = message.channel;
       if(args[0]==="start"){
            //get ID from the channel
            url = matchYoutubeUrl(args[1]);
            console.log(lasturl);
            if (url===false) return message.channel.send("NO ES UN LINK DE YOUTUBE");
            if(url===lasturl) return message.channel.send("ESTE DIRECTO ESTA EN EJECUCION");
            lasturl=url;
            new db.crearDB(channel+url)

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
            message.channel.send(embed);
        }*/
    } catch (err) {
    }
})();}}
