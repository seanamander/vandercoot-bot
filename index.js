const Discord = require("Discord.js");
const bot = new Discord.Client();
var commands = ["%help", "%newchannel", "%kick", "%ban", "%mute", "%unmute"];
var blue = 3447003;

bot.on('ready', () => {
    console.log('loaded BOT'); //logs in the console the bot has loaded
});

bot.on('ready', () => {
    bot.user.setGame('%help'); //sets the game to %help on launch
})

bot.on('messageDelete', message => {
  if(message.channel.type === "dm") return;
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
  if(message.channel.type === "dm") return;
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

  if(command === commands[0]) { //fixed
    const embed = new Discord.RichEmbed()
        .setTitle('Help/Commands')
        .setAuthor('Vandercoot')
        .setColor(3447003)
        .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
        .setTimestamp()
        .addField('Command Help', 'say `%help%<command>`', true)
        .addField('Example', '`%help%kick`')
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

  if(command === commands[2]) {
      let kickMember = message.mentions.members.first() //member to be kicked
      let modRole = message.guild.roles.find("name", "Moderator"); //gets the role Moderator
      let adminRole = message.guild.roles.find("name", "Admin"); //gets the role admin
      if(!kickMember) { //checks if the user to kick is real
        message.reply("That's an invalid user.");
        return;
      }
      if(kickMember.length === 0) { //checks if they specified a user to kick
        message.reply("You need to specify a user to kick.");
        return;
      }
      if(!kickMember.kickable) { //checks if the user specified can be kicked by the user trying to kick them
        message.reply("You can't kick that user.")
        return;
      }
      if(!message.member.roles.has(modRole.id || adminRole.id) && !message.author.id === message.guild.ownerID) { //checks if the user kicking has the modRole or adminRole or is the owner
        message.reply("You don't have the sufficient permissions.");
        return;
      }
      if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) { //checks if the bot has permission to kick
        message.reply("I don't have the sufficient permissions.");
        return;
      }
    kickMember.kick() //kicks the member
    message.reply(`Successfully kicked ${kickMember}.`)\n.then(m => { m.delete(3000) })
  }

  if(command === commands[3]) {
      let banMember = message.mentions.members.first() //member to be banned
      let adminRole = message.guild.roles.find("name", "Admin"); //gets the role admin
      if(!banMember) { //checks if the user to ban is real
        message.reply("That's an invalid user.");
        return;
      }
      if(banMember.length === 0) { //checks if they specified a user to ban
        message.reply("You need to specify a user to ban.");
        return;
      }
      if(!banMember.bannable) { //checks if the user specified can be ban by the user trying to ban them
        message.reply("You can't ban that user.")
        return;
      }
      if(!message.member.roles.has(adminRole.id) && !message.author.id === message.guild.ownerID) { //checks if the user ban has the adminRole or is the owner
        message.reply("You don't have the sufficient permissions.");
        return;
      }
      if(!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) { //checks if the bot has permission to kick
        message.reply("I don't have the sufficient permissions.");
        return;
      }
    banMember.ban() //kicks the member
    message.reply(`Successfully banned ${banMember}.`)\n.then(m => { m.delete(3000) })
  }

  if(command === commands[4]) {
    let modRole = message.guild.roles.find("name", "Moderator");
    let adminRole = message.guild.roles.find("name", "Admin");
    let mutedRole = message.guild.roles.find("name", "Muted");
    let muteMember = message.mentions.members.first();
    if(!muteMember) {
      message.reply("That's an invalid user.");
      return;
    }
    if(muteMember.length === 0) {
      message.reply("Please specify a user to mute.");
    }
    if(!message.member.roles.has(modRole.id||adminRole.id) && !message.author.id === message.guild.ownerID) {
      message.reply("You don't have the sufficient permissions")
      return;
    }
    if(!message.guild.member(bot.user).hasPermission("MANAGE_ROLES")) {
      message.reply("I don't have the sufficient permissions");
    }
    muteMember.addRole(mutedRole);
    message.reply(`Successfully muted ${muteMember}.`)\n.then(m => { m.delete(3000) })
  }

  if (command === commands[5]) {
    let modRole = message.guild.roles.find("name", "Moderator");
    let adminRole = message.guild.roles.find("name", "Admin");
    let mutedRole = message.guild.roles.find("name", "Muted");
    let unmuteMember = message.mentions.members.first();
    if(!unmuteMember) {
      message.reply("That's an invalid user.");
      return;
    }
    if(unmuteMember.length === 0) {
      message.reply("Please specify a user to mute.");
    }
    if(!message.member.roles.has(modRole.id||adminRole.id) && !message.author.id === message.guild.ownerID) {
      message.reply("You don't have the sufficient permissions")
      return;
    }
    if(!message.guild.member(bot.user).hasPermission("MANAGE_ROLES")) {
      message.reply("I don't have the sufficient permissions");
    }
    unmuteMember.removeRole(mutedRole);
    message.reply(`Successfully unmuted ${unmuteMember}.`)\n.then(m => { m.delete(3000) })
  }

});

bot.login("MzM0MDk3NzYzNDYzNTkzOTg0.DEWQTg.CCEmUGc0KJKkKfX9iIy8zOI4ymE"); //bot token
