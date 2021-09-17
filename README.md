# slash-convert

What does it do?

```
$ slash-convert DISCORD_BOT_TOKEN
Done.
```

Then it makes a out.js file where you ran it using discord.js builders.

Example:
```js
const { Client, Intents } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const allianceCommand = new SlashCommandBuilder().setName("alliance").setDescription("General commands about alliances")
  .addSubcommand((cmd) => cmd.setName("who").setDescription("Lists the members in an alliance and some other information").addStringOption((opt) => opt.setName("name").setDescription("Name of the alliance or username of a member from an alliance").setRequired(true)))
  .addSubcommand((cmd) => cmd.setName("balance").setDescription("Gets the alliance of all players in an alliance and their total balance combined").addStringOption((opt) => opt.setName("name").setDescription("Name of the alliance or username of a member from an alliance").setRequired(true)))
  .addSubcommand((cmd) => cmd.setName("level").setDescription("Gets the levels of all players in an alliance").addStringOption((opt) => opt.setName("name").setDescription("Name of the alliance or username of a member from an alliance").setRequired(true)))
  .addSubcommand((cmd) => cmd.setName("list").setDescription("Gets the alliance with the most players currently online").addIntegerOption((opt) => opt.setName("page").setDescription("The page entered in /a list {page} (default = 1)").setRequired(false)))

const islandCommand = new SlashCommandBuilder().setName("island").setDescription("General commands about islands")
  .addSubcommand((cmd) => cmd.setName("top").setDescription("Gets the top islands from /is top in game").addStringOption((opt) => opt.setName("tier").setDescription("The tier of /is top (default = all)").setRequired(false).addChoices([["All", "all"], ["Empire", "empire"], ["Legion", "legion"], ["Hardcore", "hardcore"]])).addIntegerOption((opt) => opt.setName("page").setDescription("The page of /is top (default = 1)").setRequired(false)).addBooleanOption((opt) => opt.setName("extra_info").setDescription("Shows Total value, Spawner value, Points, Hourly XP Gain").setRequired(false)))
  .addSubcommand((cmd) => cmd.setName("who").setDescription("Gets information about a player's islands").addStringOption((opt) => opt.setName("username").setDescription("Username of player").setRequired(true)))

const commands = [allianceCommand, islandCommand]
// When the client is ready, run this code (only once)
client.once('ready', async () => {
  const cmds = commands.map(x => x.toJSON()).map(x => ({ ...x, type: 'CHAT_INPUT' }))
  await client.application.commands.set(cmds)
  console.log('Done!')
  process.exit(0)
})
    
client.login('DISCORD_BOT_TOKEN')
```

## If there are any issues, open an issue on github