const config = require('../config.json');
const fs = require('fs');

class Playerlist {

  constructor (client) {
    this.client = client;
    this._list = new Set();
    this.ip = config.minecraft.api.ip;
    this.maxplayers = "?";
    this.init();
  }

  async init () {
    const plcfg = config.minecraft.playerlist;

    this.channel = await this.client.channels.fetch(plcfg.channelId);

    this.webhook = await this.client.fetchWebhook(plcfg.webhook.id, plcfg.webhook.token);
    if (!this.webhook) {
      this.webhook = await channel.createWebhook({ name: "Playerlist" });
      plcfg.webhook.id = this.webhook.id;
      plcfg.webhook.token = this.webhook.token;
    }

    this.message = await this.channel.messages.fetch(plcfg.messageId);
    if (!this.message) {
      this.message = await this.webhook.send({
        embeds: [{ title: "Loading..." }],
        username: "Jürgen"
      });
      plcfg.messageId = this.message.id;
    }

    fs.writeFileSync("../config.json", JSON.stringify(config, null, 2));
    this.fetch();
  }

  async display () {
    const list = this.list.map(p => await this.client.users.fetch(p) ? `<@${p}>` : p);
    const embeds = {
      title: `Players online: ${list.length}/${this.maxplayers}`,
      description: list.join("\n"),
      footer: { text: this.ip }
    };
    await this.message.edit({ embeds });
  }

  set list (list) {
    this._list = list;
    this.display();
  }

  get list () {
    return this._list;
  }

  async fetch () {
    const uri = `${ip}:${config.minecraft.api.port}/playerlist`;
		try {
			const { statusCode, headers, body} = await request(uri, { method: "GET"	});
      const data = JSON.parse(body);
      this.maxplayers = data.maxplayers;
      this._list = data.players;
      await this.display();
		} catch (e) {
			console.error("Error while retrieving playerlist", e);
		}
  }
}

module.exports = Playerlist;