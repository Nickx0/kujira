const Discord = require('discord.js');
const db = require("megadb");
const fs = require('fs');
const ytch = require('yt-channel-info')
const luna = "UCN3mosAMYBdogyQovOhPrxA";
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
    name: "tag",
    description: "tags para streams",
    category: "Utility",
    run: async (client, message, args) => {
    (async () => {
    try {
        ytch.getChannelVideos(luna).then((response) => {
            if (!response.alertMessage) {
               console.log(response[0])
            } else {
               console.log('Channel could not be found.')
               // throw response.alertMessage
            }
          }).catch((err) => {
            console.log(err)
          })
    } catch (err) {
    }
})();}}
