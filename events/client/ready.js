const Discord = require("discord.js");
const config = require("../../config.json");
const apikey = config.apikey;
const fetch = require("node-fetch");
var request = require("request");
var DOMParser = new (require('xmldom')).DOMParser;

var url = ["UCJePO0Zl-zZTqjpHO82RNNA",//Lia
    "UCMUmvaIF0-fBHzxt1PLOq3A",//Hana
    "UCQLyq7TDKHlmp2Ufd5Z2qMw",//Laila o gata apex
    "UCqTymU8oHTygrEzas_gVBFg",//Suzu
    "UC6tSB9TnO0f01OBeo9UEJZA",//Hina
    "UCNJwC2OjJ0Hsc2HT1D6jmJw",//Rose
    "UCM6iy_rSgSMbFjx10Z6VVGA",//Miu
    "UCAx0YWXJgyvXx5oDvrDaN_A",//Himari
    "UCQdqGzhc5Ey_5nh_bOowAhg",//Pal
    "UCN3mosAMYBdogyQovOhPrxA"];//Luna
var discChnId = [
    "934896734625202227",
    "934896920567107694",
    "936412400410832936",
    "934897363976335390",
    "934897405667717190",
    "934897443848478750",
    "934896673187037294",
    "934897605593411584",
    "934897487557320714",
    "934897575000154192"
];
const db = require("megadb")
const isodate = require("isodate");
const ytdb = new db.crearDB("ytmiu")

var key;

function getReleases(URL){
    var releases_URL = URL
    var count
    request({
        headers: {
            'User-Agent': 'my-musicbrainz-client',
        },
        url: releases_URL,
        json: false
    }, async function (error, response, body) {
    
        if (!error && response.statusCode === 200) {
            var document = DOMParser.parseFromString(body);
            count = document.getElementsByTagName("yt:videoId") 
            console.log(count.data)                                                      
            return count
        }else{
            console.log("ERROR IN FUNCTION")
        }
    })

}

module.exports = (message,client) => {
    
    try {
        let xd = "https://www.youtube.com/feeds/videos.xml?channel_id=UC6tSB9TnO0f01OBeo9UEJZA&q=searchterms";
        let rl = getReleases(xd);
        console.log(rl)
        message.channel.cache.get("936435371263275008").send("Ptr")
    } catch(err) {
    
    }
}