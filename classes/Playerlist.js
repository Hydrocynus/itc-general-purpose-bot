const config = require('../config.json');
const fs = require('fs');
const { request } = require('undici');
const { MessageActionRow, MessageButton } = require('discord.js');

class Playerlist {

  constructor (client) {
    this.client = client;
    this._list = [];
    this.ip = config.minecraft.api.ip;
    this.mcport = config.minecraft.api.mcport || 25565;
    this.maxplayers = "?";
    this.init();
  }

  async init () {
    const plcfg = config.minecraft.playerlist;

    this.channel = await this.client.channels.fetch(plcfg.channelId);

    try {
      this.webhook = await this.client.fetchWebhook(plcfg.webhook.id, plcfg.webhook.token);
    } catch (e) {
      this.webhook = await this.channel.createWebhook("Playerlist");
      plcfg.webhook.id = this.webhook.id;
      plcfg.webhook.token = this.webhook.token;
    }

    try {
      this.message = plcfg.messageId ? await this.channel.messages.fetch(plcfg.messageId) : null;
    } catch (e) {
      this.message = await this.webhook.send({
        embeds: [{ title: "Loading..." }],
        username: "Jürgen",
        avatarURL: this.client.user.displayAvatarURL()
      });
      plcfg.messageId = this.message.id;
    }

    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
    this.fetch();
  }

  async display () {
    const userManager = this.client.users;
    const list = [];
    const toMatch = [];
    for (let p of this._list) {
      let isDCUser;
      try { isDCUser = await userManager.fetch(p) }
      catch (e) { isDCUser = false }
      list.push(isDCUser ? `<@${p}>` : p);
      if (!isDCUser) toMatch.push(p);
    }

    const portString = this.mcport == 25565 ? "" : `:${this.mcport}`;

    const embeds = {
      title: `Players online: ${list.length}/${this.maxplayers}`,
      description: list.join("\n"),
      footer: { text: `${this.ip}${portString}` }
    };
    console.debug("Display playerlist:", embeds);

    const components = [];
    if (toMatch.length > 0) {
      components.push(
        new MessageActionRow().addComponents(new MessageButton()
          .setStyle("PRIMARY")
          .setLabel("Match Players")
          .setCustomId("Playerlist.matchPlayers")
        )
      )
    }

    await this.webhook.editMessage(this.message, {
      embeds: [embeds],
      components: components
    });
  }

  set list (list) {
    this._list = list;
    this.display();
  }

  get list () {
    return this._list;
  }

  async fetch () {
    const uri = `${this.ip}:${config.minecraft.api.port}/playerlist`;
		try {
			// const { statusCode, headers, body} = await request(uri, { method: "GET"	});
      const body = JSON.stringify({ maxplayers: 0, players: [] });
      const data = JSON.parse(body || "null");
      this.maxplayers = data.maxplayers;
      this._list = data.players;
      await this.display();
		} catch (e) {
			console.error("Error while retrieving playerlist", e);
		}
  }
}

module.exports = Playerlist;