const config = require('../config.json');
const fs = require('fs');

class MCChat {

  constructor (client) {
    this.client = client;
    this.init();
  }

  async init () {
    const chatcfg = config.minecraft.chat;

    this.channel = await this.client.channels.fetch(plcfg.channelId);

    this.webhook = await this.client.fetchWebhook(plcfg.webhook.id, plcfg.webhook.token);
    if (!this.webhook) {
      this.webhook = await channel.createWebhook({ name: "Chat" });
      plcfg.webhook.id = this.webhook.id;
      plcfg.webhook.token = this.webhook.token;
    }

    fs.writeFileSync("../config.json", JSON.stringify(config, null, 2));
    this.fetch();
  }

  async add (uid, username, message) {
    const user = await this.client.users.fetch(uid);
    await this.webhook.send({
      username: user?.username || username,
      avatarURL: user?.avatarURL(),
      content: message
    });
  }
}

module.exports = Playerlist;