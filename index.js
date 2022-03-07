const Discord = require('discord.js');
const { prefix, token, apikey2 } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const pool = require('./db-connection.js');
const fetch = require("node-fetch");
//https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&channelId=UC6tSB9TnO0f01OBeo9UEJZA&key=AIzaSyCsOFf7mrrPNTPuB65VoyQpcTdIgBfuB9Q&maxResults=5

client.on('ready', message => {
    console.log(`El ${client.user.tag} esta listo`);
    client.user.setStatus('online');
    client.user.setActivity('Arriba Chicas de Wactor'); 
})

client.on('message', async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    console.log(message.content);
    if (!message.content.startsWith(prefix) || message.author.bot) return; 
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!client.commands.has(commandName)) return; 
    if (command.args && !args.length) {
        let reply = `No proporcionaste ningun comando, ${message.author}!`;
        if (command.usage) {
            reply += `\nla forma correcta es: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply)
    }
    if (message.channel.type === 'dm') {
        return message.reply('No puedo ejecutar este comando dentro de DMs!');
    }},
['command', 'event'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
})
);
client.login(token)