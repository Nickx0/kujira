module.exports = {
	name: 'kick',
	description: 'ban the mentioned user',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    args: true,
    category: "Moderation",
    usage: "kick <user>",
	run: async (client, message, args) => {
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**NO TIENES PERMISO PARA USAR EL COMANDO**");
        const member = (message).mentions.members.first();
        member.kick();
}};
