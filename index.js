(async () => {
	// === General ===

	// === Bot ===

	const fs = require('node:fs');
	const path = require('node:path');
	const { Client, Collection, Intents } = require('discord.js');
	const { general: { token } } = require('./config.json');

	const intents = new Intents();
	intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

	const client = new Client({ intents: intents });

	client.commands = new Collection();
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}

	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	await client.login(token);

	// === Playerlist ===

	const Playerlist = require('./classes/Playerlist.js');
	const playerlist = new Playerlist(client);

	// === Chat ===

	const MCChat = require('./classes/MCChat.js');
	const mcchat = new MCChat(client);

	// === REST ===

	const express = require('express');

	const app = express();
	app.use(express.json());

	app.post('/', (req, res) => {
		console.log(req.body)
		res.send('ok')
	});

	app.listen(3000, () => {
		console.log('Listening on port 3000!')
	});
})();