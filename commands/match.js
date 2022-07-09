const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');
const { modApi } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('match')
		.setDescription('Matches a Minecraft username to a Discord user ID')
    .addStringOption(option => option.setName('minecraftUserName').setRequired(true).setDescription('The Minecraft username to match'))
    .addUserOption(option => option.setName('discordUser').setRequired(true).setDescription('The Discord user to match')),
	async execute(interaction) {
		await interaction.deferredReply('Matching Minecraft username to Discord user ID...');
		const uri = modApi + "/playerlist/match";
		const { statusCode, headers, body} = await request(uri, {
			method: "POST",
			body: JSON.stringify({
				minecraftUserName: interaction.getStringOption('minecraftUserName'),
				discordUserID: interaction.getUserOption('discordUser').id
			})
		});
		if (`${statusCode}`.match(/^2\d\d$/)) {
			await interaction.editReply(`${interaction.getStringOption('minecraftUserName')} is linked to ${interaction.getUserOption('discordUser').tag}`);
		} else {
			await interaction.editReply("An error occurred");
			console.error(`Error while matching Minecraft username to Discord user ID: ${body}`);
		}
	},
};