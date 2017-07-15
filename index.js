const Discord = require("Discord.js");
const bot = new Discord.Client();
var commands = ["%help", "%newchannel"];
var blue = 3447003;

bot.on('ready', () => {
    console.log('loaded BOT'); //logs in the console the bot has loaded
});

bot.on('ready', () => {
    bot.user.setGame('%help'); //sets the game to %help on launch
})

bot.on('messageDelete', message => {
    let args = message.content.split(" ").slice(1);
    var now = new Date();
    var date = "[" + now + "]: ";
    var serverName = "[" + message.guild.name + "]: ";
    let guild = message.guild;
    let content = args.join(" ");
    let user = message.author.username;
    console.log(date + serverName.toUpperCase() + "[DELETED]: " + user + ": " + message.content);
})

bot.on('message', message => {
    let args = message.content.split(" ").slice(1);
    var now = new Date();
    var date = "[" + now + "]: ";
    var serverName = "[" + message.guild.name + "]: ";
    let guild = message.guild;
    let content = args.join(" ");
    let user = message.author.username;
    console.log(date + serverName.toUpperCase() + user + ": " + message.content);

  if(message.author.bot) return;
  let command = message.content.split(" ")[0];

  if(command === commands[0]) { //works but crashes when after execution
  const embed = new Discord.RichEmbed()
    .setTitle("Help/Commands")
    .setAuthor("Vandercoot")
    .setFooter("Requested by " + message.author.username)
    .setTimestamp()
    .addField("Command help", "Say `%help%<command>`")
    .addField("Example", "`%help%kick`")
    .setColor(blue)
    message.author.send({
      embed
    });
  }

  if(command === commands[1]) { //fixed
    if(args.length == 1) {
      let name = args[0];
      if(name.length < 2) {
        message.reply("The name must be over 2 characters and below 100 characters.");
        return;
      }
      guild.createChannel(name, "text").then(console.log("Successfully created channel " + name)).catch(console.error);
      message.reply("Successfully created channel " + name);
    } else {
      message.reply("Invalid usage, try %help.");
    }
  }

});

bot.login("MzM0MDk3NzYzNDYzNTkzOTg0.DEWQTg.CCEmUGc0KJKkKfX9iIy8zOI4ymE");
