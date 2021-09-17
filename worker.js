module.exports = (data, token = 'TOKEN') => {
  const prefix = `const { Client, Intents } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })\n\n\n`
  const middle = data.mapValues(cmd => makeCommand(parseCommand(cmd))).toJSON().join('\n')
  const suffix = `\nconst commands = [${data.mapValues(cmd => cmd.name + 'Command').toJSON().join(', ')}]
// When the client is ready, run this code (only once)
client.once('ready', async () => {
  const cmds = commands.map(x => x.toJSON()).map(x => ({ ...x, type: 'CHAT_INPUT' }))
  await client.application.commands.set(cmds)
  console.log('Done!')
  process.exit(0)
})
    
client.login('${token}')`
  return prefix + middle + suffix
}

function parseCommand (cmd) {
  const obj = {
    name: cmd.name,
    type: 'CHAT_INPUT',
    description: cmd.description,
    options: []
  }
  for (const option of (cmd.options ?? [])) {
    if (option.type === 'SUB_COMMAND') {
      obj.options.push({ ...parseCommand(option), type: 'SUB_COMMAND' })
    } else {
      obj.options.push({ name: option.name, description: option.description, required: option.required, choices: option.choices, type: option.type })
    }
  }
  return obj
}

function makeCommand (cmd) {
  const cmdName = `${cmd.name}Command`
  let text = `const ${cmdName} = new SlashCommandBuilder()${addNameAndDesc(cmd)}\n`
  for (const option of cmd.options) {
    let optText = ''
    if (cmd.options[0]?.type === 'SUB_COMMAND') {
      optText += `.addSubcommand((cmd) => ${makeInlineCommand(option)})`
    } else {
      optText += makeOption(option)
    }
    text += '  ' + optText + '\n'
  }
  return text
}

function makeInlineCommand (cmd) {
  let text = `cmd${addNameAndDesc(cmd)}`
  for (const opt of (cmd.options ?? [])) {
    text += makeOption(opt)
  }
  return text
}

function makeOption (opt) {
  return `.add${fixName(opt.type)}Option((opt) => opt${addNameAndDesc(opt)}.setRequired(${opt.required})${addChoices(opt.choices)})`
}

function addChoices (choices) {
  if (!choices || Object.values(choices).length === 0) return ''
  return `.addChoices([${Object.values(choices).map(x => `["${x.name}", "${x.value}"]`).join(', ')}])`
}

function addNameAndDesc (data) {
  return `.setName("${data.name}").setDescription("${data.description}")`
}

function fixName (n) {
  return n[0].toUpperCase() + n.slice(1).toLowerCase()
}
