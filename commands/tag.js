const Discord = require('discord.js');
const db = require("megadb");
//const ytdb = new db.crearDB("X")
var text="no existe";
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
       /* if(args[0]==="start"){
            //get ID from the channel
            channel = message.channel;
            console.log(channel.id);
            console.log(args[1]);
        }else if(firstArg==="give"){
            console.log(text)
        }
        console.log(matchYoutubeUrl(args[1]));*/

    } catch (err) {
    }
})();}}
