module.exports = {
	name: 'cl',
	description: 'limpiara mensajes(uso de admin)',
    guildOnly: true,
    category: "Moderation",
	run: async (client, message, args) => { {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**NO TIENES EL PERMISO PARA USAR EL COMANDO**");
            const amount = parseInt(args[0]) + 1;
            if (isNaN(amount)) {
                return message.reply('Ese no es un numero valido');
            }
            else if (amount <= 1 || amount > 100) {
                return message.reply('Necesitas poner un numero entre 1 y 99.');
            }
            message.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                message.channel.send('¡Hubo un error al intentar eliminar los mensajes en este canal!');
            });
        }
}};


