const Discord = require("Discord");
const client = new Discord.Client();

client.on('message', message => {
  let args = message.content.split(" ").slice(1);
  let user = message.author.username;
  var now = new Date();
  var date = "[" + now + "]";
  let guild = message.guild;
  var serverName = guild.name;
  console.log(date + serverName.toUpperCase() + " " + user + ": " + message.content)

  if(message.author.bot) return;
  let command = message.content.split(" ")[0];
  if(command === "test") {
    message.reply("worked");
  }
});

cient.on('messageDelete', message => {
  let user = message.author.username;
  var now = new Date();
  var date = "[" + now + "]";
  let guild = message.guild;
  var serverName = guild.name;
  console.log("[DELETED] " + date + serverName.toUpperCase() + " " + user + ": " + message.content)
});
