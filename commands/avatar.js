module.exports = {
	name: 'avatar',
	description: 'proporcionara tu avatar o de quien tagees',
    guildOnly: true,
    category: "General",
    cooldown: 10,
	run: async (client, message, args) => {
        if (!message.mentions.users.size) {
            return message.channel.send(`Tu avatar es  <${message.author.displayAvatarURL({ format: "jpg", dynamic: true })}>`);
        } 
        const avatarList = message.mentions.users.map(user => {
            return `El avatar del Usuario ${user.username}  es <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
        });
        message.channel.send(avatarList);
}};