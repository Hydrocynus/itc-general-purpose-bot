const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');
const { minecraft: { api: { ip, port }}} = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('match')
		.setDescription('Matches a Minecraft username to a Discord user ID')
    .addStringOption(option => option.setName('mcusername').setRequired(true).setDescription('The Minecraft username to match'))
    .addUserOption(option => option.setName('discorduser').setRequired(true).setDescription('The Discord user to match')),
	async execute(interaction) {
		await interaction.deferReply('Matching Minecraft username to Discord user ID...');
		const uri = `${ip}:${port}/playerlist/match`;
		try {
			const { statusCode, headers, body} = await request(uri, {
				method: "POST",
				body: JSON.stringify({
					minecraftUserName: interaction.options.getString('mcusername'),
					discordUserID: interaction.options.getUser('discorduser')?.id
				})
			})
	
			if (`${statusCode}`.match(/^2\d\d$/)) {
				await interaction.editReply(`${interaction.getStringOption('minecraftUserName')} is linked to ${interaction.getUserOption('discordUser').tag}`);
			} else {
				await interaction.editReply("An error occurred");
				console.error("Error while matching Minecraft username to Discord user ID:", body);
			}
		} catch (e) {
			await interaction.editReply("An error occurred");
			console.error("Error while matching Minecraft username to Discord user ID:", e);
		}
	},
};