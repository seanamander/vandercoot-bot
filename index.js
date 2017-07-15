const Discord = require("Discord.js");
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('loaded BOT'); //logs in the console the bot has loaded
});

bot.on('ready', () => {
    bot.user.setGame('%help') //sets the game to %help on launch
})

bot.on('messageDelete', message => {
    let args = message.content.split(" ").slice(1);
    var now = new Date();
    var date = "[" + now + "]: ";
    var serverName = "[" + message.guild.name + "]: ";
    let guild = message.guild;
    let content = args.join(" ");
    let user = message.author.username;
    console.log(date + serverName.toUpperCase() + "[DELETED]: " + user + ": " + message.content)
})

bot.on('message', message => {
    let args = message.content.split(" ").slice(1);
    var now = new Date();
    var date = "[" + now + "]: ";
    var serverName = "[" + message.guild.name + "]: ";
    let guild = message.guild;
    let content = args.join(" ")
    let user = message.author.username
    console.log(date + serverName.toUpperCase() + user + ": " + message.content)

  if(message.author.bot) return;
  let command = message.content.split(" ")[0];
  if(command === "test") {
    message.reply("worked");
  }
});

bot.login("MzM0MDk3NzYzNDYzNTkzOTg0.DEWQTg.CCEmUGc0KJKkKfX9iIy8zOI4ymE");
