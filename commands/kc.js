module.exports = {
	name: 'kick',
	description: 'banear gente',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    args: true,
    category: "Moderation",
	run: async (client, message, args) => {
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**NO TIENES PERMISO PARA USAR EL COMANDO**");
        const member = (message).mentions.members.first();
        member.kick();
}};
