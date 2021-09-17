#!/usr/bin/env node

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js')
const fsp = require('fs/promises')
const work = require('./worker')
const { once } = require('events')

// Create a new client instance
async function main () {
  const token = process.argv[2]
  if (!(typeof token === 'string' && token !== '')) {
    console.error('Incorrect usage.\nUsage: slash-convert MY_DISCORD_TOKEN')
    process.exit(1)
  }
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
  client.login(token)
  await once(client, 'ready')
  const code = work(await client.application.commands.fetch(), token)
  await fsp.writeFile('./out.js', code)
  console.log('Done!')
  process.exit(0)
}

main()
