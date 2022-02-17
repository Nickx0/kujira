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
    "UCN3mosAMYBdogyQovOhPrxA",//Luna
    "UCBURM8S4LH7cRZ0Clea9RDA",//reimu
    "UCu-J8uIXuLZh16gG-cT1naw",//Finana
    "UCP4nMSTdwU1KqYWu3UH5DHQ",//Pomu
    "UCV1xUwfM2v2oBtT3JNvic3w",//Selen
    "UCgmPnx-EEeOrZSg5Tiw7ZRQ",//baelz
    "UCmbs8T6MWqUHP1tIQvSgKrg",//kronni
    "UC3n5uGu18FoCy23ggWWp8tA"//mumei
    //"UCIm8pnnTNhCgGAtNxrQQv-g"//Yue (elfa)
];
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
    "934897575000154192",
    "934929406592421899",
    "934929406592421899",
    "934929406592421899",
    "934929406592421899",
    "934929295346925709",
    "934929295346925709",
    "934929295346925709",
    //"934897970678227005"
];
var lastid=[],lastid2=[],lastid3=[],lastid4=[],lastid5=[];
const db = require("megadb")
const ytdb = new db.crearDB("ytmiu")
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
var vals,valstl,valstl2,valstl3,valstl4,valstl5;
async function getLastId(urlx){
    let urs = "https://www.youtube.com/feeds/videos.xml?channel_id="+urlx+"&q=searchterms";
        //Xml File to Json
    await got(urs).then(response => {
        const dom = new JSDOM(response.body);
        console.log(dom.window.document.querySelector('title').textContent);
        let vsg = dom.window.document.getElementsByTagName("yt:videoId");
        let vsgtl = dom.window.document.getElementsByTagName("title");
        vals = vsg[0].textContent;
        valstl = vsgtl[1].textContent;
        valstl2 = vsgtl[2].textContent;
        valstl3 = vsgtl[3].textContent;
        valstl4 = vsgtl[4].textContent;
        valstl5 = vsgtl[5].textContent;
      }).catch(err => {
        console.log(err);
      });
}
function trueOrNot(lstid,vls){
    if(lstid===vls)
        return true;
    else
        return false;
}
async function saveLastId(i,vals,vals2,vals3,vals4,vals5){
    await ytdb.establecer(url[i], vals)
    await ytdb.establecer(url[i]+"2", vals2)
    await ytdb.establecer(url[i]+"3", vals3)
    await ytdb.establecer(url[i]+"4", vals4)
    await ytdb.establecer(url[i]+"5", vals5)
}
module.exports = (message,client) => {
    
    try {
        setInterval(async function(){
        for(i=0;i<url.length;i++){
            lastid[i] = await ytdb.obtener(url[i])//xd
            lastid2[i] = await ytdb.obtener(url[i]+"2")//xd
            lastid3[i] = await ytdb.obtener(url[i]+"3")//xd
            lastid4[i] = await ytdb.obtener(url[i]+"4")//xd
            lastid5[i] = await ytdb.obtener(url[i]+"5")//xd
        }
        for(i=0;i<url.length;i++){
            await getLastId(url[i]);
            if(trueOrNot(lastid[i],valstl)) continue;
            else if(trueOrNot(lastid2[i],valstl)) continue;
            else if(trueOrNot(lastid3[i],valstl)) continue;
            else if(trueOrNot(lastid4[i],valstl)) continue;
            else if(trueOrNot(lastid5[i],valstl)) continue;
            else{
                await saveLastId(i,valstl,valstl2,valstl3,valstl4,valstl5);
                let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails,contentDetails&fields=items(snippet(publishedAt,title,description,thumbnails(standard),channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers,actualEndTime),statistics(viewCount),contentDetails(duration))&id="+vals+"&key="+apikey;
                //Json FIle Api to object
                const apirl = await fetch(apiurl);
                const r = await apirl.json();
                let stat=(r.items[0].snippet.liveBroadcastContent==="live")? "En Vivo":(r.items[0].snippet.liveBroadcastContent==="none")?"Finalizado":"En Espera";
                console.log(stat);
                if(stat!=="Finalizado"){
                    let img = "https://img.youtube.com/vi/"+vals+"/maxresdefault.jpg";
                    let ltimg = "https://img.youtube.com/vi/"+vals+"/mqdefault.jpg";
                    var view = "???",timestr;
                    switch(stat){
                        case "En Espera":
                            startime = r.items[0].liveStreamingDetails.scheduledStartTime;
                            utc = new Date().toISOString();
                    
                            date = new Date(startime);
                            starmili = date.getTime();  
                    
                            date2 = new Date(utc);
                            utcmili = date2.getTime(); 
                    
                            result=starmili-utcmili;
                            if(result>0)
                                timestr = "Faltan "+convertMS(result);
                            else
                                timestr = "---"
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
                        .setURL("https://www.youtube.com/watch?v="+vals)
                    message.channels.cache.get(discChnId[i]).send(embed);
                };
            }
        }
        }, 60000);           
    } catch(err) {
    message.channel.send({embed: {
        color: 16734039,
        description: "Algo salio mal... :cry:"
        }})
    }
}