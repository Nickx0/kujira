const Discord = require("discord.js");
const config = require("../../config.json");
const apikey = config.apikey;
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const got = require("got");

var url = [
    "UCJePO0Zl-zZTqjpHO82RNNA",//Lia
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
    "UC3n5uGu18FoCy23ggWWp8tA",//mumei
    "UCIm8pnnTNhCgGAtNxrQQv-g",//Yue (elfa)
    "UCIeSUTOTkF9Hs7q3SGcO-Ow",//Elira
    "UC4WvIIAo89_AzGUh1AZ6Dkg",//Rosemi
    "UCgA2jKRkqpY_8eysPUs8sjw",//Petra
    "UCkieJGn3pgJikVW8gmMXE2w",//Nina
    "UCR6qhsLpn62WVxCBK1dkLow",//Enna
    "UC47rNmkDcNgbOcM-2BwzJTQ"//Millie
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
    "934897970678227005",
    "934929406592421899",
    "934929406592421899",
    "934929406592421899",
    "934929406592421899",
    "934929406592421899",
    "934929406592421899"
];
var lastid=[],lastid2=[],lastid3=[],lastid4=[];
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
var vals,vals1,vals2,vals3;
async function getLastId(urlx){
    let urs = "https://www.youtube.com/feeds/videos.xml?channel_id="+urlx+"&q=searchterms";
        //Xml File to Json
    await got(urs).then(response => {
        let dom = new JSDOM(response.body);
        console.log(dom.window.document.querySelector('title').textContent);
        let vsg = dom.window.document.getElementsByTagName("yt:videoId");
        console.log(vsg[0].textContent)
        vals = vsg[0].textContent;
        vals1 = vsg[1].textContent;
        vals2 = vsg[2].textContent;
        vals3 = vsg[3].textContent;
      }).catch(err => {
        console.log(err);
      });
}
function trueOrNot(lstid,vls){
    return lstid===vls;
}
async function saveLastId(i,vals,vals2,vals3,vals4){
    await ytdb.establecer(url[i], vals)
    await ytdb.establecer(url[i]+"2", vals2)
    await ytdb.establecer(url[i]+"3", vals3)
    await ytdb.establecer(url[i]+"4", vals4)
}
module.exports = (message,client) => {
    
    try {
        setInterval(async function(){
        for(i=0;i<url.length;i++){
            lastid[i] = await ytdb.obtener(url[i])//xd
            lastid2[i] = await ytdb.obtener(url[i]+"2")//xd
            lastid3[i] = await ytdb.obtener(url[i]+"3")//xd
            lastid4[i] = await ytdb.obtener(url[i]+"4")//xd
        }
        for(i=0;i<url.length;i++){
            await getLastId(url[i]);
            if(trueOrNot(lastid[i],vals)) continue;
            else if(trueOrNot(lastid2[i],vals)) continue;
            else if(trueOrNot(lastid3[i],vals)) continue;
            else if(trueOrNot(lastid4[i],vals)) continue;
            else{
                await saveLastId(i,vals,vals1,vals2,vals3);
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
                    startime = r.items[0].liveStreamingDetails.scheduledStartTime;
                    date = new Date(startime);
                    starmili = date.getTime();
                    timestr = (stat==="En Espera")? `Inicia <t:${starmili/1000}:R>` :`Empezo <t:${starmili/1000}:R>`;
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