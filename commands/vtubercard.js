const Discord = require("discord.js");
const ytch = require('yt-channel-info');
const config = require("../config");
const prefix = config.prefix;

function generarObjetoVtubers() {
    return {
        lia:"UCJePO0Zl-zZTqjpHO82RNNA",
        liacolor:"#F196AF",
        hana:"UCMUmvaIF0-fBHzxt1PLOq3A",
        hanacolor:"#FFBED0",
        laila:"UCFSkExeBcqI4nb_ArHeByNw",
        lailacolor:"#D56FFF",
        suzu:"UCqTymU8oHTygrEzas_gVBFg",
        suzucolor:"#838383",
        hina:"UC6tSB9TnO0f01OBeo9UEJZA",
        hinacolor:"#366BC2",
        rose:"UCNJwC2OjJ0Hsc2HT1D6jmJw",
        rosecolor:"#FF00FF",
        miu:"UCM6iy_rSgSMbFjx10Z6VVGA",
        miucolor:"#6CFF90",
        himari:"UCAx0YWXJgyvXx5oDvrDaN_A",
        himaricolor:"#D38EFF",
        pal:"UCQdqGzhc5Ey_5nh_bOowAhg",
        palcolor:"#FF8E9C",
        luna:"UCN3mosAMYBdogyQovOhPrxA",
        lunacolor:"#8EA9FF",
        yue:"UCIm8pnnTNhCgGAtNxrQQv-g",
        yuecolor:"#3FFB97",
    }
};

module.exports = {
    name: "vtube",
    description: "Tarjeta vtubers",
    category: "Vtuber",
    usage: "nya",
    run: async (client, message, args) => {
        (async () => {
        try {
            if (!message.content.startsWith(prefix)) return; 
            if (message.author.bot) return;
            const args = message.content.slice(prefix.length+6).trim().split(/ +/g);       
            const texto = args.join(' ');
            if(!texto) return message.channel.send('Por favor, escribe el nombre de una vtuber');
            console.log(texto);
            switch(texto){
                case "lia":
                    filtrar = {
                    channelid:generarObjetoVtubers().lia,
                    color:generarObjetoVtubers().liacolor}
                    break;
                case "hana":
                    filtrar = {
                    channelid:generarObjetoVtubers().hana,
                    color:generarObjetoVtubers().hanacolor}
                    break;
                case "laila":
                    filtrar = {
                    channelid:generarObjetoVtubers().laila,
                    color:generarObjetoVtubers().lailacolor}
                    break;
                case "suzu":
                    filtrar = {
                    channelid:generarObjetoVtubers().suzu,
                    color:generarObjetoVtubers().suzucolor}
                    break;
                case "hina":
                    filtrar = {
                    channelid:generarObjetoVtubers().hina,
                    color:generarObjetoVtubers().hinacolor}
                    break;
                case "rose":
                    filtrar = {
                    channelid:generarObjetoVtubers().rose,
                    color:generarObjetoVtubers().rosecolor}
                    break;
                case "miu":
                    filtrar = {
                    channelid:generarObjetoVtubers().miu,
                    color:generarObjetoVtubers().miucolor}
                    break;
                case "himari":
                    filtrar = {
                    channelid:generarObjetoVtubers().himari,
                    color:generarObjetoVtubers().himaricolor}
                    break;
                case "pal":
                    filtrar = {
                    channelid:generarObjetoVtubers().pal,
                    color:generarObjetoVtubers().palcolor}
                    break;
                case "luna":
                    filtrar = {
                    channelid:generarObjetoVtubers().luna,
                    color:generarObjetoVtubers().lunacolor}
                    break;
                case "yue":
                    filtrar = {
                    channelid:generarObjetoVtubers().yue,
                    color:generarObjetoVtubers().yuecolor}
                    break;
                default:
                    break;
            }
            console.log(filtrar.channelid);
            ytch.getChannelInfo(filtrar.channelid).then((response) => {
            const embed = new Discord.MessageEmbed()
                .setTitle(`${response.author}`, message.guild.iconURL({ dynamic: true, format: 'png'}))
                .setImage(response.authorBanners[0].url)
                .setThumbnail(response.authorThumbnails[2].url)
                .setDescription((response.subscriberCount)/1000+"K Suscriptores")
                .setColor(filtrar.color)
                .setFooter("Comando realizado por " + `${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 }))
                .setTimestamp("xd")
                .setURL(response.authorUrl);
                message.channel.send(embed);
            }).catch((err) => {
                console.error(err);
                message.channel.send({embed: {
                    color: 16734039,
                    description: "Algo salio mal...:"
                }})
            })
        
            } catch(err) {
                console.log(err)
            message.channel.send({embed: {
                color: 16734039,
                description: "Algo salio mal... :cry:"
            }})
        }
    })();
}}