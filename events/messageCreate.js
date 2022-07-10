const { minecraft: { chat: { channelId }, modApi } } = require('../config.json');
const { request } = require('undici');

module.exports = {
	name: 'messageCreate',
	execute: async message => {
		if (message.channelId !== channelId) return;

		console.log(`${message.author.tag} said: ${message.content}`);

		try {
			const { statusCode, headers, body} = await request(modApi + "/message", {
				method: "POST",
				body: JSON.stringify({
					user: message.author.id,
					text: message.content
				})
			});
			console.log(`Mod answered with status code ${statusCode}:`, body);
		} catch (e) {
			console.error("Error while sending message to mod:", e);
		}
	}
}