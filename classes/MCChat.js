const config = require('../config.json');
const fs = require('fs');

class MCChat {

  constructor (client) {
    this.client = client;
    this.init();
  }

  async init () {
    const chatcfg = config.minecraft.chat;

    this.channel = await this.client.channels.fetch(chatcfg.channelId);

    try {
      this.webhook = await this.client.fetchWebhook(chatcfg.webhook.id, chatcfg.webhook.token);
    } catch (e) {
      this.webhook = await this.channel.createWebhook("Chat");
      chatcfg.webhook.id = this.webhook.id;
      chatcfg.webhook.token = this.webhook.token;
    }

    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
  }

  async add (uid, username, message) {
    if (!this.webhook) await this.init();
    let member;
    try { member = await this.channel.guild.members.fetch(uid); }
    catch (e) { console.error("Error while fetching member, defaulting to transmitted username\n", e) }
    await this.webhook.send({
      username: member?.displayName || username,
      avatarURL: member?.displayAvatarURL(),
      content: message
    });
  }
}

module.exports = MCChat;