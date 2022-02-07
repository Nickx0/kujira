const Discord = require("discord.js");
const config = require("../../config.json");
const apikey = config.apikey;
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const got = require("got");

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

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return h + ':' + m + ':' + s;
}
var vals="test";
module.exports = (message,client) => {
    
    try {
        setInterval(async function(){
        for(i=0;i<10;i++){
        console.log(i);
        channelId = url[i];
        let urs = "https://www.youtube.com/feeds/videos.xml?channel_id="+channelId+"&q=searchterms";
        const ttl = await ytdb.obtener(channelId)//xd
        //Xml File to Json
        await got(urs).then(response => {
            const dom = new JSDOM(response.body);
            console.log(dom.window.document.querySelector('title').textContent);
            let vsg = dom.window.document.getElementsByTagName("yt:videoId");
            vals = vsg[0].textContent;
          }).catch(err => {
            console.log(err);
          });
        key1 = vals;//xd1
        //let key2 = lista[1].textContent;//xd
        console.log(vals)
        //Key of recent video/stream
        console.log(discChnId[i])
        if(ttl===key1) continue;
        if(ttl!==key1){ 
        ytdb.establecer(channelId, key1)
        key = key1;
        //Get Data from ApiYoutube
        let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails,contentDetails&fields=items(snippet(publishedAt,title,description,thumbnails(standard),channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers,actualEndTime),statistics(viewCount),contentDetails(duration))&id="+key+"&key="+apikey;
        //Json FIle Api to object
        const apirl = await fetch(apiurl);
        const r = await apirl.json();
        //data
        let img = "https://img.youtube.com/vi/"+key+"/maxresdefault.jpg";
        let ltimg = "https://img.youtube.com/vi/"+key+"/mqdefault.jpg";
        var view = "???",timestr;
        //Status stream
        let stat=(r.items[0].snippet.liveBroadcastContent==="live")? "En Vivo":(r.items[0].snippet.liveBroadcastContent==="none")?"Finalizado":"En Espera";
        switch(stat){
            case "En Espera":
                startime = r.items[0].liveStreamingDetails.scheduledStartTime;
                utc = new Date().toISOString();
        
                date = new Date(startime);
                starmili = date.getTime();  
        
                date2 = new Date(utc);
                utcmili = date2.getTime(); 
        
                result=starmili-utcmili;
                
                timestr = "Faltan "+convertMS(result);
                break
            case "En Vivo":
                startime = r.items[0].liveStreamingDetails.scheduledStartTime;
                utc = new Date().toISOString();
        
                date = new Date(startime);
                starmili = date.getTime();  
        
                date2 = new Date(utc);
                utcmili = date2.getTime(); 
        
                result=utcmili-starmili;
                timestr = "Lleva "+convertMS(result);
                view = r.items[0].liveStreamingDetails.concurrentViewers;
                break
            case "Finalizado":
                //Get Duration Stream
                let time = r.items[0].contentDetails.duration;
                timestr = time.replace(/PT(\d+)H(\d+)M(\d+)S/, "$1:$2:$3");
                break
            default:
                break
        };
        
        if(stat==="Finalizado") continue;
    
        //Message Emmbed
        const embed = new Discord.MessageEmbed()
            .setTitle(`${r.items[0].snippet.title}`)
            .setImage(img)
            .setDescription(r.items[0].snippet.channelTitle)
            .setThumbnail(ltimg)
            .setColor("PURPLE")
            .addFields(
                { name: 'Status', value: `${stat}`, inline: true },
                { name: 'Time', value: `${timestr}`, inline: true },
                { name: 'Viewers', value: `${view}`, inline: true },
            )
            .setTimestamp()
            .setURL("https://www.youtube.com/watch?v="+key)
            message.channels.cache.get(discChnId[i]).send(embed);
        }

    }
    }, 15000);           
    } catch(err) {
    message.channel.send({embed: {
        color: 16734039,
        description: "Algo salio mal... :cry:"
        }})
    }
}