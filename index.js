import DiscordJS, { Intents } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

let cooper_user_id = '122869082071498752'
let testing_user_id = '420981509814484998'
let cooper_afk_channel_id = '784982632923791360'
let testing_afk_channel_id = '955333205307842562'

if (process.env.NODE_ENV === "development") {
  console.log('Running development build')
  cooper_user_id = testing_user_id
  cooper_afk_channel_id = testing_afk_channel_id
}

const client = new DiscordJS.Client({
  fetchAllMembers: true,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
})

client.on('ready', () => {
  console.log('The bot is ready')
})

client.on('messageCreate', message => {
  if (message.author.bot) return;
  let lowercase_msg = message.content.toLowerCase()

  if (lowercase_msg.includes('cooper') && lowercase_msg.includes('afk')) {
    message.guild.members.fetch(cooper_user_id).then(cooper => {
      let isSelfDeafened = cooper.voice.selfDeaf
      let isInVoiceChannel = cooper.voice.channelId !== null
  
      let reply
      if (!isInVoiceChannel) {
        reply = 'not sure if cooper is afk :thinking: cooper is not in a voice channel'
      } else {
        if (isSelfDeafened) {
          reply = 'cooper is afk :pensive:'
        } else {
          reply = 'cooper is not afk :grinning:'
        }
      }
  
      message.reply({
        content: reply
      })
    })
    .catch(() => {
      console.log('cooper user not found')
    })
  }

  if (lowercase_msg.includes('arctic monkey')) {
    message.reply({
      content: 'https://www.youtube.com/watch?v=okqGTtes1_I'
    })
  }

  if (lowercase_msg.includes('wordle')) {
    if (lowercase_msg.includes('x/6')) {
      message.reply({
        content: 'lol'
      })
    }

    if (lowercase_msg.includes('1/6') || lowercase_msg.includes('2/6')) {
      message.reply({
        content: 'nice'
      })
    }
  }
})

client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.selfDeaf) {
    if (newState.id === cooper_user_id && newState.channelId !== cooper_afk_channel_id) {
      let channelExists = newState.guild.channels.cache.get(cooper_afk_channel_id) !== undefined

      if (channelExists) {
        if (newState.member.voice.channelId !== null) {
          newState.member.voice.setChannel(cooper_afk_channel_id)
        }
      } else {
        console.log('no cooper afk channel exists')
      }
    }
  }
});

client.login(process.env.TOKEN)