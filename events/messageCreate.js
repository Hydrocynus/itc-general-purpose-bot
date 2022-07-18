const { minecraft: { chat: { channelId }, api: { ip, port } } } = require('../config.json');
const { request } = require('undici');

module.exports = {
	name: 'messageCreate',
	execute: async message => {
		if (message.channelId !== channelId) return;
		if (message.author.bot) return;

		console.log(`${message.author.tag} said: ${message.content}`);

		try {
			const { statusCode, headers, body} = await request(`${ip}:${port}/message`, {
				method: "POST",
				body: JSON.stringify({
					user: message.author.id,
					name: message.author.displayName,
					text: message.content
				})
			});
			console.log(`Mod answered with status code ${statusCode}:`, body);
		} catch (e) {
			console.error("Error while sending message to mod:", e);
		}
	}
}