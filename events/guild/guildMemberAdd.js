const Discord = require('discord.js');
const config = require("../../config");
const client = new Discord.Client();
const prefix = config.prefix;
const Canvas = require('canvas')
const path = require('path');

module.exports = async (message,member) => {
try {
  const canvas = Canvas.createCanvas(1000, 500)
  const context = canvas.getContext('2d')
  // Load the background image and draw it to the canvas
  const background = await Canvas.loadImage(
    path.join(__dirname, '../../img/wlcm.png')
  )
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#B5FE9A';
  context.strokeRect(0, 0, canvas.width, canvas.height);
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
  context.beginPath();
	context.arc(145, 115, 100, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();
  context.drawImage(avatar, 45, 15, 200,200);
  var role= member.guild.roles.cache.find(role => role.name === "Neko");
  member.roles.add(role);
  const attachment = new Discord.MessageAttachment(canvas.toBuffer())
  message.channels.cache.get('934895680370135050').send(`Welcome To The Server <@${member.user.id}>`,attachment);
} catch(err) {
 console.log(err);
}
}
