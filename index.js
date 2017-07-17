const Discord = require("Discord.js");
const bot = new Discord.Client();
var prefix = '%';
var commands = ["help", "newchannel", "kick", "ban", "mute", "unmute", "clear", "8ball"];
var descriptions = [
  "View help for certain commands",
]
var fortunes = [":8ball: | Yes!", ":8ball: | No!", ":8ball: | The answer is unclear, try again.", ":8ball: | I'm uncertain", ":8ball: | Most definitely.", ":8ball: | Definitely not!", ":8ball: | Maybe.", ":8ball: | Did you expect the answer to be yes? Because it's not yes.", ":8ball: | Why would the answer possibly be no?", ":8ball: | Do I really have to answer that?", ":8ball: | Perhaps.", ":8ball: | Totally.", ":8ball: | Not in a million years.", ":8ball: | You already know the answer is no.", ":8ball: | The answer couldn't be anything other than no.", ":8ball: | Probably. /shrug", ":8ball: | Maybe in another world buddy."]
var blue = 3447003;

bot.on('ready', () => {
    console.log('Loaded Bot'); //logs in the console the bot has loaded
});

bot.on('ready', () => {
    bot.user.setGame('%help'); //sets the game to %help on launch
})

bot.on('messageDelete', message => {
    if (message.channel.type === "dm") return;
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
    if (message.channel.type === "dm") return;
    let args = message.content.split(" ").slice(1);
    var now = new Date();
    var date = "[" + now + "]: ";
    var serverName = "[" + message.guild.name + "]: ";
    let guild = message.guild;
    let content = args.join(" ");
    let user = message.author.username;
    console.log(date + serverName.toUpperCase() + user + ": " + message.content);

    if (message.author.bot) return;
    let command = message.content.split(" ")[0];
    if(command.startsWith(prefix)) {
      command = command.substring(1, command.length);
      console.log(command)
    }
    var token = null;
    if(command.includes(prefix)) {
      token = command.split(prefix)[1];
      command = command.split(prefix)[0];
    }
    if (command === commands[0]) { //fixed
      if(token != null) {
        var index = 0;
        for(var x = 0; x < commands.length; x++) {
          if(token = commands[x]) {
            index = x;
            break;
          }
        }
        const embed = new Discord.RichEmbed()
        .setAuthor('Vandercoot')
        .setColor(3447003)
        .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
        .setTimestamp()
        .addField(token, descriptions[index]);
        message.author.send({embed});
      } else {
        const embed = new Discord.RichEmbed()
            .setTitle('Help/Commands')
            .addField('\u200b', '\u200b', true)
            .setAuthor('Vandercoot')
            .setColor(3447003)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Command Help', 'say `%help%<command>`', true)
            .addField('Example', '`%help%kick`')
            var list = "";
            for(var x = 0; x < commands.length; x++) {
              if(x != 0)
                list += "\n" + commands[x];
              else
                list += commands[x];
            }
            embed.addField("Available Commands", list);
        message.author.send({
            embed
        });
      }
    }

    if (command === commands[1]) { //fixed
        if (args.length == 1) {
            let name = args[0];
            if (name.length < 2) {
                message.reply("The name must be over 2 characters and below 100 characters.");
                return;
            }
            guild.createChannel(name, "text").then(console.log("Successfully created channel " + name)).catch(console.error);
            deleteBotMsg("Successfully created channel " + name)
        } else {
            message.reply(`Invalid usage, try %help.`)
                .then(m => {
                    m.delete(3000)
                })
        }
    }

    if (command === commands[2]) {
        let kickMember = message.mentions.members.first() //member to be kicked
        let modRole = message.guild.roles.find("name", "Moderator"); //gets the role Moderator
        let adminRole = message.guild.roles.find("name", "Admin"); //gets the role admin
        if (message.member.roles.has(modRole.id || adminRole.id) || message.member.id === message.guild.ownerID) { //checks if the user kicking has the modRole or adminRole or is the owner
        if (!kickMember) { //checks if the user to kick is real
            deleteBotMsg("That's not a valid user.")
            return;
        }
        if (kickMember.length === 0) { //checks if they specified a user to kick
            deleteBotMsg("You need to specify a user to kick.")
            return;
        }
        if (!kickMember.kickable) { //checks if the user specified can be kicked by the user trying to kick them
            deleteBotMsg("You can't kick that user.")
            return;
        }
        if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) { //checks if the bot has permission to kick
            deleteBotMsg("I don't have the sufficient permissions.")
            return;
        }
        kickMember.kick() //kicks the member
        deleteBotMsg("Successfully kicked " + kickMember)
    } else {
      deleteBotMsg("You don't have the sufficient permissions.")
      return;
    }
  }

  if (command === commands[3]) {
      let banMember = message.mentions.members.first() //member to be kicked
      let adminRole = message.guild.roles.find("name", "Admin"); //gets the role admin
      if (message.member.roles.has(adminRole.id) || message.member.id === message.guild.ownerID) { //checks if the user kicking has the modRole or adminRole or is the owner
      if (!banMember) { //checks if the user to kick is real
          deleteBotMsg("That's not a valid user.")
          return;
      }
      if (banMember.length === 0) { //checks if they specified a user to kick
          deleteBotMsg("You need to specify a user to ban.")
          return;
      }
      if (!banMember.bannable) { //checks if the user specified can be kicked by the user trying to kick them
          deleteBotMsg("You can't ban that user.")
          return;
      }
      if (!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) { //checks if the bot has permission to kick
          deleteBotMsg("I don't have the sufficient permissions.")
          return;
      }
      banMember.ban() //kicks the member
      deleteBotMsg("Successfully banned " + banMember)
  } else {
    deleteBotMsg("You don't have the sufficient permissions.")
    return;
  }
}

    if (command === commands[4]) {
        let modRole = message.guild.roles.find("name", "Moderator");
        let adminRole = message.guild.roles.find("name", "Admin");
        let mutedRole = message.guild.roles.find("name", "Muted");
        let muteMember = message.mentions.members.first();
        if (message.member.roles.has(modRole.id || adminRole.id) || message.member.id === message.guild.ownerID) {
            if (!muteMember) {
                deleteBotMsg("That's not a valid user.")
                return;
            }
            if (muteMember.length === 0) {
                deleteBotMsg("Please specify a user to mute.")
            }
            if (!message.guild.member(bot.user).hasPermission("MANAGE_ROLES")) {
                deleteBotMsg("I don't have the sufficient permissions.")
                return;
            }
            muteMember.addRole(mutedRole);
            deleteBotMsg("Successfully muted " + muteMember)
        } else {
            deleteBotMsg("You don't have the sufficient permissions.");
            return;
        }
    }

    if (command === commands[4]) {
        let modRole = message.guild.roles.find("name", "Moderator");
        let adminRole = message.guild.roles.find("name", "Admin");
        let mutedRole = message.guild.roles.find("name", "Muted");
        let unmuteMember = message.mentions.members.first();
        if (message.member.roles.has(modRole.id || adminRole.id) || message.member.id === message.guild.ownerID) {
            if (!unmuteMember) {
                deleteBotMsg("That's not a valid user.")
                return;
            }
            if (unmuteMember.length === 0) {
                deleteBotMsg("Please specify a user to mute.")
            }
            if (!message.guild.member(bot.user).hasPermission("MANAGE_ROLES")) {
                deleteBotMsg("I don't have the sufficient permissions.")
                return;
            }
            unmuteMember.addRole(mutedRole);
            deleteBotMsg("Successfully muted " + unmuteMember)
        } else {
            deleteBotMsg("You don't have the sufficient permissions.");
            return;
        }
    }

    if (command === commands[6]) {
        if (isNaN(args.join(" "))) {
            deleteBotMsg("That's not a valid number.")

            return;
        }
        if (content < 2) {
            deleteBotMsg("The number provided must be atleast 2.")

            return;
        }
        if (content > 100) {
            deleteBotMsg("The number provided must be below 100.")

            return;
        }
        message.channel.bulkDelete(args.join(" ")) + 2;
        deleteBotMsg("Successfully cleared " + args.join(" "))
    }

    if (command === commands[7]) {
        if (args.join(" ").length === 0) {
            return message.reply("I can't read invisible ink, please provide a question.")
        }
        if (args[1]) {
            message.reply(fortunes[Math.floor(Math.random() * fortunes.length)]);
        } else {
            message.reply(":8ball: | I can't read that, try something else.")
            return
        }
    }

});

var deleteBotMsg = function(msg) {
    message.reply(msg)
        .then(m => {
            m.delete(3000)
        })
}

bot.login("MzM0MDk3NzYzNDYzNTkzOTg0.DE2JJA.RzpOPViDjhwxTEJmPS0PRrCcv9A"); //bot token
