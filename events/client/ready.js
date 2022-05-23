const Discord = require("discord.js");
var {vtuberlist,yTlives} = require('../../lives.js');
const { apikey2, apikey } = require("../../config.json");
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const got = require("got");
const pool = require('../../db-connection.js');
const {YTLive} = require("../../YTlive/YTlive");
const { data } = require("cheerio/lib/api/attributes.js");
/*var lastIdUrl;
async function getLastId(urlx){
    let urs = "https://www.youtube.com/feeds/videos.xml?channel_id="+urlx;
        //Xml File to Json
    await got(urs).then(response => {
        let dom = new JSDOM(response.body);
        console.log(dom.window.document.querySelector('title').textContent);
        let vsg = dom.window.document.getElementsByTagName("yt:videoId");
        lastIdUrl = vsg[0].textContent;
      }).catch(err => {
        console.log(err);
      });
}
let totalVT='SELECT * FROM Pjt3W34Qzv.vtuberlist';*/
let clientMessage;
module.exports = async(message,client) => {
    try {
        vtuberlist = await listVtubers();
        clientMessage = message; 
        //checkLives();
        checkTwitchLives();
        checkVtubers();
        //checklastVideoRSS();
        console.log("Init!!");
        /*setInterval(async function(){
        try {
            const totalDb = await pool.query(totalVT);
            for(i=1;i<=totalDb.length;i++){
                let calldata=`select v.id_vtuber,v.nombre,v.channelid,v.activo,a.canal_alerta_key,
                c.value_color,e.logo
                from vtuberlist v 
                inner join canal_alerta a
                on v.id_canal_alerta = a.id_canal_alerta
                inner join empresa e
                on v.id_empresa = e.id_empresa
                inner join colores c
                on v.id_color=c.id_color
                Where v.id_vtuber = '${i}'`;
                let vtuberdata = await pool.query(calldata);
                console.log(vtuberdata[0].channelid)
                let r = vtuberdata[0];
                await getLastId(vtuberdata[0].channelid);
                console.log(lastIdUrl)
                let compareData = `SELECT * FROM Pjt3W34Qzv.video WHERE id_video='${lastIdUrl}'`
                let compare = await pool.query(compareData);
                if(compare.length===0){
                    let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails&fields=items(snippet(title,channelTitle,liveBroadcastContent),liveStreamingDetails(scheduledStartTime,concurrentViewers),statistics(viewCount))&id="+lastIdUrl+"&key="+apikey;
                    let apirl = await fetch(apiurl);
                    let r = await apirl.json();
                    let stat=(r.items[0].snippet.liveBroadcastContent==="live")? "En Vivo":(r.items[0].snippet.liveBroadcastContent==="none")?"Finalizado":"En Espera";
                    let estado =(r.items[0].snippet.liveBroadcastContent==="live")? 1:(r.items[0].snippet.liveBroadcastContent==="none")?0:2;
                    let addData = `INSERT INTO Pjt3W34Qzv.video(id_videos,id_vtuber,id_video,estado) VALUES(NULL,'${vtuberdata[0].id_vtuber}','${lastIdUrl}','${estado}')`;
                    await pool.query(addData);
                    if(stat!=="Finalizado"){
                        let img = "https://img.youtube.com/vi/"+lastIdUrl+"/maxresdefault.jpg";
                        var view = "???",timestr;
                        startime = r.items[0].liveStreamingDetails.scheduledStartTime;
                        date = new Date(startime);
                        starmili = date.getTime();
                        timestr = (stat==="En Espera")? `Inicia <t:${starmili/1000}:R>` :`Empezo <t:${starmili/1000}:R>`;
                        //Message Emmbed
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`${r.items[0].snippet.title}`)
                            .setImage(img)
                            .setDescription(r.items[0].snippet.channelTitle)
                            .setThumbnail(vtuberdata[0].logo)
                            .setColor(vtuberdata[0].value_color)
                            .addFields(
                                { name: 'Status', value: `${stat}`, inline: true },
                                { name: 'Time', value: `${timestr}`, inline: true },
                                { name: 'Viewers', value: `${view}`, inline: true },
                            )
                            .setTimestamp()
                            .setURL("https://www.youtube.com/watch?v="+lastIdUrl)
                        message.channels.cache.get(vtuberdata[0].canal_alerta_key).send(embed);
                    };
                }
            }
            let vt='SELECT * FROM Pjt3W34Qzv.video Where estado=1 Or estado=2 ORDER BY id_videos DESC'; // CAMBIAR A 1 Y 2
            let bd = await pool.query(vt);
            for(i=0;i<bd.length;i++){
            try {
                console.log(bd[i].id_video);
                
                //let estado = (ytlive.isLiveNow()) ? 1 : ytlive.isFinished() ? 0 : 2;
                let apixurl2 = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(liveBroadcastContent))&id="+bd[i].id_video+"&key="+apikey2;
                let luapi2 = await fetch(apixurl2);
                let respon2 = await luapi2.json();
                let estado =(respon2.items.length==0)?0:(respon2.items[0].snippet.liveBroadcastContent==="live")? 1:(respon2.items[0].snippet.liveBroadcastContent==="none")?0:2;
                if(bd[i].estado!==estado){
                    let up_estado=`UPDATE Pjt3W34Qzv.video SET estado = ${estado} WHERE id_videos = ${bd[i].id_videos};`; 
                    await pool.query(up_estado);
                    if(estado===1 && bd[i].estado!==estado){
                        let ytlive = new YTLive({liveId : bd[i].id_video})
                        await ytlive.getLiveData()
                        /*let apixurl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&fields=items(snippet(title,channelTitle,liveBroadcastContent),liveStreamingDetails(actualStartTime,concurrentViewers))&id="+bd[i].id_video+"&key="+apikey;
                        let luapi = await fetch(apixurl);
                        let respon = await luapi.json();*/
                        /*let vtx=`select v.id_vtuber,v.nombre,v.channelid,v.activo,a.canal_alerta_key,
                        c.value_color,e.logo
                        from vtuberlist v 
                        inner join canal_alerta a
                        on v.id_canal_alerta = a.id_canal_alerta
                        inner join empresa e
                        on v.id_empresa = e.id_empresa
                        inner join colores c
                        on v.id_color=c.id_color
                        Where v.id_vtuber = '${bd[i].id_vtuber}'`
                        let bdx = await pool.query(vtx);
                        let img2 = "https://img.youtube.com/vi/"+bd[i].id_video+"/maxresdefault.jpg";
                        let view2 = ytlive.getViewCount();//respon.items[0].liveStreamingDetails.concurrentViewers;
                        startime2 = ytlive.getStartTime()//respon.items[0].liveStreamingDetails.actualStartTime;
                        date2 = new Date(startime2);
                        starmili2 = date2.getTime();
                        let timestr2 = `Empezo <t:${starmili2/1000}:R>`;
                        let embed2 = new Discord.MessageEmbed()
                            .setTitle(`${respon.items[0].snippet.title}`)
                            .setImage(img2)
                            .setDescription(respon.items[0].snippet.channelTitle)
                            .setThumbnail(bdx[0].logo)
                            .setColor(bdx[0].value_color)
                            .addFields(
                                { name: 'Status', value: `En Vivo`, inline: true },
                                { name: 'Time', value: `${timestr2}`, inline: true },
                                { name: 'Viewers', value: `${view2}`, inline: true },
                            )
                            .setTimestamp()
                            .setURL("https://www.youtube.com/watch?v="+bd[i].id_video)
                        message.channels.cache.get(bdx[0].canal_alerta_key).send(embed2);
                    }
                }
            } catch (error) {
                console.log(error);
            } 
        }
        } catch (error) {
                
        }
        
    }, 60000); */
    } catch(err) {
        console.log(err);
    message.channel.send({embed: {
        color: 16734039,
        description: "Algo salio mal... :cry:"
        }})
    }
}

async function checkVtubers(){
  setInterval(async function(){
    let list = await listVtubers();
    let addList = Array();
    if (vtuberlist.length!==list.length){
      for (let vtuber of list) {
      let index = vtuberlist.indexOf(vtuber);
      addList.push(vtuberlist[index]);
      }
      loadVTObjects(addList);
      updateVTlist(addList);
    }
  }, 300000);
}

async function checklastVideoRSS(){
  try{
    setInterval(async function(){
      for (let vtuber of vtuberlist) {
        let urs = "https://www.youtube.com/feeds/videos.xml?channel_id="+vtuber.channelid;
        r = await fetch(urs);
        const body = await r.text();
        let LiveInfo="";
        const info = body.toString().match(/<yt:videoId>(.+?)<\//);
        if (info) {
          LiveInfo = info[1];
        }
        live = new YTLive({liveId: LiveInfo});
        try {
          await live.getLiveData();
          if (live.liveId!==''){
            updateStates(live)
            console.log(`RSS: ${live.liveId}`)
          }else{
            console.log('RSS :'+live.id+" "+vtuber.channelid);
          }
        } catch (error) {
          console.error(`RSS: ${error}`);
          console.log(`RSS: ${vtuber.channelid}`)
        }
        await sleep(500);
        }
    }, 300000); 
  } catch(err) {
    console.log(err);
  }
}

async function checkLives(){
  loadVTObjects(vtuberlist)
  //console.log(yTlives)
  try{
    setInterval(async function(){
      for (let ytlive of yTlives) {
        try {
          await ytlive.getLiveData();
          console.log(`LIVE: ${ytlive.liveId}`)
          updateStates(ytlive);
        } catch (error) {
          console.error(`LIVE: ${error}`);
          console.log(`LIVE: ${ytlive.id.channelId}`)
        }
        await sleep(300);
        //console.log(ytlive.getVideoInfo());
      }
    }, 120000); 
  } catch(err) {
    console.log(err);
  }
}

async function getTwitchInfo(twitch){
  uptime = await fetch(`https://decapi.me/twitch/uptime/${twitch}`);
  avatar = "";
  viewercount = "";
  title = "";
  game = "";
  live = false;
  uptime =  await uptime.text();
  if(uptime !== `${twitch} is offline`){
    avatar = await fetch(`https://decapi.me/twitch/avatar/${twitch}`);
    viewercount = await fetch(`https://decapi.me/twitch/viewercount/${twitch}`);
    title = await fetch(`https://decapi.me/twitch/title/${twitch}`);
    game = await fetch(`https://decapi.me/twitch/game/${twitch}`);
    avatar = await avatar.text();
    viewercount = await viewercount.text();
    title = await title.text();
    game = await game.text();
    live = true
  }

  return {uptime,avatar,viewercount,title,game,live}
}

function toseconds(timestr){
  valor = timestr.split(',')
  seconds = 0
  for(let time of valor){
    let val = time.split(' ')
    if(val[val.length-1].match(/hour/)) seconds+=(val[val.length-2]*60*60)
    if(val[val.length-1].match(/minute/)) seconds+=(val[val.length-2]*60)
    if(val[val.length-1].match(/second/)) seconds+=(val[val.length-2]*1)
    console.log(val)
  }
  return seconds
}

async function sendDTMessage(live,estado,vTuber,timestamp){
  let img =  live.avatar;
  let view ="???",timestr="",Status ="";
  if(estado===1){
    Status = `En Vivo`;
    view = live.viewercount;
    starmili = (timestamp.getTime())-(toseconds(live.uptime)*1000);
    timestr = `Empezo <t:${(starmili/1000).toFixed(0)}:R>`;
  }
  let embed = new Discord.MessageEmbed()
      .setTitle(`${live.title}`)
      .setImage(img)
      .setDescription(vTuber.twitch)
      .setThumbnail(vTuber.logo)
      .setColor(vTuber.value_color)
      .addFields(
      { name: 'Status', value: `${Status}`, inline: true },
      { name: 'Time', value: `${timestr}`, inline: true },
      { name: 'Viewers', value: `${view}`, inline: true },
      { name: 'Game', value: `${live.game}`, inline: true }
      )
      .setTimestamp()
      .setURL("https://www.twitch.tv/"+vTuber.twitch)
  clientMessage.channels.cache.get(vTuber.canal_alerta_key).send(embed);
}

async function checkTwitchLives(){
  try{
    setInterval(async function(){
      for (let vtuber of vtuberlist) {
        if(vtuber.twitch!=='-'){
          try {
            timestamp = new Date()
            let data = await getTwitchInfo(vtuber.twitch)
            console.log(data)
            console.log(`TLIVE: ${vtuber.twitch}`)
            let estadodb = await stateTLivedb(vtuber.id_vtuber)
            if(data.live != estadodb[0].tlive){
              if(data.live){
                sendDTMessage(data, 1, vtuber,timestamp);
                updateTLiveStatedb(vtuber.id_vtuber,1)
              }else{
                updateTLiveStatedb(vtuber.id_vtuber,0)
              }
              console.log(`TLIVE: ${vtuber.twitch}`)
            }
          } catch (error) {
            console.error(`TLIVE: ${error}`);
            console.log(`TLIVE: ${vtuber.twitch}`)
          }
          await sleep(300);
        }else{
          console.log(`TLIVE: ${vtuber.nombre}`)
        }
      }
    }, 20000); 
  } catch(err) {
    console.log(err);
  }
}

async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  
  async function updateStates(live)
  {
    try {
    let estado = (live.isLiveNow() ? 1:live.isWaiting() ? 2:0);//getting status live class
    let exists = await existLivedb(live.liveId);//load validador
    let vTuber = vtuberlist.find(vtuber => vtuber.channelid === live.getChannelId());
    if(exists){//validador if exist or no
      let db = await getLiveState(live.liveId);//getting status of live
      if(db.length!==0){//live finished, officialy finished in db
        if(db[0].estado!==estado){
          if(estado===1){//state 2 is imposible, but i don´t want to lose anything
            sendDMessage(live,estado,vTuber)//message sender
            checkFinisheds(vTuber)
          }
          await updateLiveStatedb(live.liveId,estado)
        }
      }
    }else{
      //let vTuber = vtuberlist.find(vtuber => vtuber.channelid === live.getChannelId());
      await setLivedb(vTuber,live.liveId,estado);
      if(estado!==0||live.isVideo()){
        sendDMessage(live,estado,vTuber);
      }
      checkFinisheds(vTuber);
    }
    
    
  } catch (error) {
      console.error(error);
  }
  }
  
  async function checkFinisheds(vTuber){
    try {
    let db = await getLastestLives(vTuber.channelid);
    if(db.length >0){
      for (let dblive of db) {
        live = new YTLive({liveId: dblive.liveId});
        try {
          await live.getLiveData();
          let estado = (live.isLiveNow() ? 1:live.isWaiting() ? 2:0);
          console.log(`CheckF: ${live.liveId} state: ${estado}`)
          if(dblive.estado!==estado){
            if(estado===0) {
              updateLiveStatedb(live.liveId,estado)
            } 
          }
        } catch (error) {
          updateLiveStatedb(live.liveId,0)
        }
      }
    }
  } catch (error) {
      console.log(error);
  }
  } 
  
  async function getLiveState(liveId){
    return await pool.query(`select v.id_video as liveId,v.estado as estado
    from Pjt3W34Qzv.video v
    where v.id_video='${liveId}' AND (estado=1 Or estado=2)`);
  }
  
  async function getLastestLives(channelId){
    return await pool.query(`select vi.id_video as liveId,vi.estado as estado
    from vtuberlist v 
    inner join video vi
    on v.id_vtuber = vi.id_vtuber
    where activo=1 AND v.channelid='${channelId}' AND (estado=1 Or estado=2)
    order by v.id_vtuber DESC`);
  }
  
  async function sendDMessage(live,estado,vTuber){
    let img = "https://img.youtube.com/vi/"+live.liveId+"/maxresdefault.jpg";
    let view ="???",timestr="",Status ="";
    if(estado===1){
      Status = `En Vivo`;
      view = live.getViewCount();

      let apiurl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,liveStreamingDetails&fields=items(snippet(title),liveStreamingDetails(actualStartTime),statistics(viewCount))&id="+live.liveId+"&key="+apikey;
      let apirl = await fetch(apiurl);
      let r = await apirl.json();

      let startime = r.items[0].liveStreamingDetails.actualStartTime;

      let date = new Date(startime);
      starmili = date.getTime();
      timestr = `Empezo <t:${starmili/1000}:R>`;
    }else if(estado===2){
      Status = `En Espera`;
      timestr = `Inicia <t:${live.getScheduledStartTime()}:R>`
    }else if(live.isVideo()){
      Status = `Video`
      timestr = `${convertMS(live.getDuration()*1000)}`;
      view = live.getViewCount();
    }
    let embed = new Discord.MessageEmbed()
        .setTitle(`${live.getTitle()}`)
        .setImage(img)
        .setDescription(live.getProfileInfo().author)
        .setThumbnail(vTuber.logo)
        .setColor(vTuber.value_color)
        .addFields(
        { name: 'Status', value: `${Status}`, inline: true },
        { name: 'Time', value: `${timestr}`, inline: true },
        { name: 'Viewers', value: `${view}`, inline: true },
        )
        .setTimestamp()
        .setURL("https://www.youtube.com/watch?v="+live.liveId)
    clientMessage.channels.cache.get(vTuber.canal_alerta_key).send(embed);
  }
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
        return ((h!==0)?(h<10)?'0'+h+':':h+':':'')+((m<10)?'0'+m:m)+':'+((s<10)?'0'+s:s);
  }

  async function setLivedb(vTuber,liveId,estado){
    return await pool.query(`INSERT INTO Pjt3W34Qzv.video(id_videos,id_vtuber,id_video,estado) VALUES(NULL,'${vTuber.id_vtuber}','${liveId}',${estado})`);
  }
  
  async function updateLiveStatedb(liveId,estado){
    return await pool.query(`UPDATE Pjt3W34Qzv.video SET estado = ${estado} WHERE id_video = '${liveId}';`);
  }
  
  async function updateTLiveStatedb(vtuberId,estado){
    return await pool.query(`UPDATE Pjt3W34Qzv.vtuberlist SET tlive = '${estado}' WHERE id_vtuber = ${vtuberId};`);
  }

  async function existLivedb(live){
    list = await pool.query(`SELECT * FROM Pjt3W34Qzv.video WHERE id_video='${live}'`);
    return (list.length!=0)
  }

  async function stateTLivedb(vtuberId){
    return pool.query(`SELECT tlive FROM Pjt3W34Qzv.vtuberlist WHERE id_vtuber = '${vtuberId}'`);
  }

  function loadVTObjects(vtuberlist){
      vtuberlist.forEach(element => {
          yTlives.push(new YTLive({channelId: element.channelid}))
          console.log(`LOADED: ${element.nombre} ${element.channelid}`)
      });
  }
  function updateVTlist(list){
      list.forEach(element => {
          vtuberlist.push(new YTLive({channelId: element.channelid}))
          console.log(`ADDED: ${element.nombre} ${element.channelid}`)
      });
  }

  async function listVtubers(){
      return await pool.query(`select v.id_vtuber,v.nombre,v.channelid,v.twitch,v.activo,a.canal_alerta_key,
          c.value_color,e.logo
          from vtuberlist v 
          inner join canal_alerta a
          on v.id_canal_alerta = a.id_canal_alerta
          inner join empresa e
          on v.id_empresa = e.id_empresa
          inner join colores c
          on v.id_color=c.id_color`);
  }