const Discord = require('discord.js');
const db = require("megadb");
const fs = require('fs');
const ytch = require('yt-channel-info')
const {YTLive} = require("../YTLive/YTLive")
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
        let ytlive = new YTLive({channelId:"UCP0BspO_AMEe3aQqqpo89Dg"})
        console.log(ytlive.data)
        console.log(ytlive.isLiveNow())
        console.log(ytlive.getVideoInfo())
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
