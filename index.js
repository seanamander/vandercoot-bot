const Discord = require('discord.js');

const bot = new Discord.Client();

const ytdl = require("ytdl-core");

const request = require("request");

const fs = require("fs");

const getYouTubeID = require("get-youtube-id");

const fetchVideoInfo = require("youtube-info");


var random = `random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }`

var config = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));

var crushes = ["Emily", "Lundo", "Jamie", "Alex", "Lily", "Cessations", "Demons", "Josephine", "Cobalt", "Angela", "Candiece", "Allanah", ]

var fortunes = [":8ball: | Yes!", ":8ball: | No!", ":8ball: | Most definitely", ":8ball: | The answer is unclear, try again", ":8ball: | Hell, I don't know", ":8ball: | Bet on it", ":8ball: | Does that really need to be answered?", ":8ball: | Definitely not", ":8ball: | Why in the world would the answer be yes?", ":8ball: | Why in the world would the answer be no?", ":8ball: | Your question boggles me, try again.", ":8ball: | Quite possibly", ":8ball: | Maybe"];

var queue = [];

var isPlaying = false;

var dispatcher = null;

var voiceChannel = null;

var skipReq = 0;

var skippers = [];

var afkTimes = [60, 300, 900, 1800, 3600];

var servers = {};


const yt_api_key = config.yt_api_key;

const bot_controller = config.bot_controller;

const prefix = config.prefix;

const discord_token = config.discord_token;

const embed = new Discord.RichEmbed()

const blue = 3447003


function random(min, max) { //function for a random value to randomly select a crush from above for %crush %hottest
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(ytdl(server.queue[0], {
        filter: "audioonly"
    }));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect()
    });
}

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
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.split(" ")[0]; //the split for using commands %kick @zamidiot (the space)
    command = command.slice(prefix.length);

    var picCmd = function(url) {
        message.channel.send(url);
    }

    if (command === play) {
        if (!args[1]) {
            message.channel.send("Please provide a link")
            return;
        }
        if (!message.member.voiceChannel) {
            message.channel.send("You must be in a voice channel")
            return;
        }

        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }

        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
            play(connection, message);
        });
    }

    if (command === "devdelete") {
        message.reply("```message.reply(`Cleared ${content} messages.`)\n.then(m => { m.delete(3000) })```")
    }

    if (command === "skip") {
        var server = servers[message.guild.id];

        if (server.dispatcher) server.dispatcher.end();
    }

    if (command === "stop") {
        var server = servers[message.guild.id];

        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect()
    }

    if (command === "execute") {
        picCmd("https://bw-1651cf0d2f737d7adeab84d339dbabd3-bcs.s3.amazonaws.com/products/product_75671/Full75671.jpg")
    }

    if (command === "credits") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('Credits')
            .setColor(blue)
            .addField('Main dev', 'Zmarik Awais#3332')
            .addField('Main help', 'cobalt#1475')
            .addField('More help', 'discord.js Official server')
            .addField('Discord.js Discord', 'https://discord.gg/bRCvFy9')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
        message.reply({
            embed
        });
    }

    if (command === "newtext") {
        let content = args.join(" ")
        guild.createChannel(content, 'text');
        message.reply("Made a new text channel: `" + content + ("`"));
    }

    if (command === "clear") {
        let content = args.join(" ")
        if (isNaN(content)) {
            message.reply("That's not a valid number");

            return;
        }
        if (content < 2) {
            message.reply("The number provided must be atleast 2")

            return;
        }
        if (content > 100) {
            message.reply("The number provided must be less than 100")

            return;
        }
        message.channel.bulkDelete(content) + 1;
        message.reply(`Cleared ${content} messages.`)
            .then(m => {
                m.delete(3000)
            })

    }

    if (command === "god") {
      if (!message.author.id === 135222378518020096) {
        message.reply("You don't have access to that command")
        return;
      }
      let member = message.mentions.members.first()
      let role = message.guild.roles.find('name', 'GOD')
      member.addRole(role)
    }

    if (command === "ungod") {
      if (!message.author.id === 135222378518020096) {
        message.reply("You don't have access to that command")
        return;
      }
      let member = message.mentions.members.first()
      let role = message.guild.roles.find('name', 'GOD')
      member.removeRole(role)
    }

    if (command === "newvoice") {
        let content = args.join(" ")
        guild.createChannel(content, 'voice');
        message.reply("Made a new voice channel: `" + content + ("`"));

    }

    if (command === "mc") {
        message.reply("There are `" + guild.memberCount + "` users in this server");

    }

    if (command === "roles") {
        message.reply("The roles needed to make this bot functional are:\n`Moderator` - will serve as the `moderator` role\n`Admin` - will serve as the `administrator` role\n`Muted` - will serve as the `muted` role\nThese role names are CaSe-SeNsItIvE, if they are spelled or capitalized incorrectly, kick, mute, and ban commands will not work.")
    }

    if (command === "help") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('Help/Commands')
            .setAuthor('Vandercoot')
            .setColor(3447003)
            .setDescription("`%roles`\n`%credits`\n`%clear`\n`%unmod`\n`%mod`\n\n`%newtext`\n`%newvoice`\n`%mc`\n`%geticon`\n`%owner`\n`%random`\n`%cock`\n`%setavatar`\n`%setafk`\n`%afktime`\n`%ban`\n`%kick`\n`%molt`\n`%molt2`\n`%molt3`\n`%molt4`\n`%8ball`\n`%crush`\n`%hottest`\n`%setgame`\n`%say`\n`%add`\n`%subtract`\n`%multiply`\n`%divide`\n`%modulo`\n`%play`\n`%skip`")
            .setFooter('Made by Zmarik Awais#3332')
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Command Help', 'say `%help%<command>`', true)
            .addField('Example', '`%help%newvoice`')
            .addField('\u200b', '\u200b', true)
        message.author.send({
            embed
        });

    }

    if (command === "help%mod") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%mod')
            .setColor(blue)
            .setDescription('Gives a specified user the moderator role')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage', '`%mod <name>`')
            .addField('Example', '%mod @Zmarik Awais#3332')
        message.reply({
            embed
        });

    }

    if (command === "help%unmod") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%unmod')
            .setColor(blue)
            .setDescription("Removes the specified user's moderator role")
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage', '`%unmod <name>`')
            .addField('Example', '%unmod @Zmarik Awais#3332')
        message.reply({
            embed
        });

    }

    if (command === "help%credits") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%credits')
            .setColor(blue)
            .setDescription('Shows who helped with creating the bot')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage', '`%credits`')
            .addField('Example', '%credits')
        message.reply({
            embed
        });

    }

    if (command === "help%roles") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%roles')
            .setColor(blue)
            .setDescription('Shows the role names needed to make the bot functional (important)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage', '`%roles`')
            .addField('Example', '%roles')
        message.reply({
            embed
        });

    }

    if (command === "help%newtext") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%newtext')
            .setColor(blue)
            .setDescription('Creates a new text channel')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%newtext <name>`')
            .addField('Example:', '`%newvoice text`')
        message.reply({
            embed
        });

    }

    if (command === "help%newvoice") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%newvoice')
            .setColor(blue)
            .setDescription('Creates a new voice channel')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%newvoice <name>`')
            .addField('Example:', '`%newvoice General`')
        message.reply({
            embed
        });
    }

    if (command === "help%mc") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%mc')
            .setColor(blue)
            .setDescription('Tells you how many members are in the server')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%mc`')
            .addField('Example:', '`%mc`')
        message.reply({
            embed
        });
    }

    if (command === "help%geticon") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%geticon')
            .setColor(blue)
            .setDescription('Gets the icon of the server')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%geticon`')
            .addField('Example:', '`%geticon`')
        message.reply({
            embed
        });
    }

    if (command === "help%owner") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%owner')
            .setColor(blue)
            .setDescription('Mentions the owner of the server')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%owner`')
            .addField('Example:', '`%owner`')
        message.reply({
            embed
        });
    }

    if (command === "help%random") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%random')
            .setColor(blue)
            .setDescription('Gives you a function to get the random')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%random`')
            .addField('Example:', '`%random`')
        message.reply({
            embed
        });
    }

    if (command === "help%cock") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%cock')
            .setColor(blue)
            .setDescription('A picture of a chicken in shoes')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%cock`')
            .addField('Example:', '`%cock`')
        message.reply({
            embed
        });
    }

    if (command === "help%ban") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%ban')
            .setColor(blue)
            .setDescription('Bans a user')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%ban <user>`')
            .addField('Example:', '`%ban @Zmarik Awais#3332`')
        message.reply({
            embed
        });
    }

    if (command === "help%kick") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%kick')
            .setColor(blue)
            .setDescription('Kicks a user')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%kick <user>`')
            .addField('Example:', '`%kick @Zmarik Awais#3332`')
        message.reply({
            embed
        });
    }

    if (command === "help%molt") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%molt')
            .setColor(blue)
            .setDescription('A picture of molt')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%molt`')
            .addField('Example:', '`%molt`')
        message.reply({
            embed
        });
    }

    if (command === "help%molt2") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%molt2')
            .setColor(blue)
            .setDescription('Another picture of molt')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%molt2`')
            .addField('Example:', '`%molt2`')
        message.reply({
            embed
        });
    }

    if (command === "help%molt3") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%molt3')
            .setColor(blue)
            .setDescription('Another picture of molt')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%molt3`')
            .addField('Example:', '`%molt3`')
        message.reply({
            embed
        });
    }

    if (command === "help%molt4") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%molt4')
            .setColor(blue)
            .setDescription('Another picture of molt')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%molt4`')
            .addField('Example:', '`%molt4`')
        message.reply({
            embed
        });
    }

    if (command === "help%crush") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%crush')
            .setColor(blue)
            .setDescription('Gets a random crush from a list of 10 people (set by default)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%crush`')
            .addField('Example:', '`%crush`')
        message.reply({
            embed
        });
    }

    if (command === "help%hottest") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%hottest')
            .setColor(blue)
            .setDescription('Chooses a random person to be the hottest out of a list of 10 people (set by default)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%hottest`')
            .addField('Example:', '`%hottest`')
        message.reply({
            embed
        });
    }

    if (command === "help%setgame") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%setgame')
            .setColor(blue)
            .setDescription('Sets the game the bot is playing (limited to bot creator)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%setgame <game>`')
            .addField('Example:', '`%setgame Minecraft`')
        message.reply({
            embed
        });
    }

    if (command === "help%say") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%say')
            .setColor(blue)
            .setDescription('Makes the bot say something (limited to bot creator)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%say <message>`')
            .addField('Example:', '`%say Hello`')
        message.reply({
            embed
        });
    }

    if (command === "help%add") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%add')
            .setColor(blue)
            .setDescription('Adds 2 integers (only 2)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%add <num1 num2>`')
            .addField('Example:', '`%add 5 5`')
        message.reply({
            embed
        });
    }

    if (command === "help%subtract") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%subtract')
            .setColor(blue)
            .setDescription('Subtracts 1 integer from another (only 2)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%subtract (num1 num2)`')
            .addField('Example:', '`%subtract 9 5`')
        message.reply({
            embed
        });
        log("used: %help%subtract ")
    }

    if (command === "help%multiply") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%multiply')
            .setColor(blue)
            .setDescription('Multiplies 2 integers (only 2)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%multiply <num1 num2>`')
            .addField('Example:', '`%multiply 5 5`')
        message.reply({
            embed
        });
    }

    if (command === "help%divide") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%divide')
            .setColor(blue)
            .setDescription('Divides 1 integer by another (only 2)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%divide <num1 num2>`')
            .addField('Example:', '`%divide 10 5`')
        message.reply({
            embed
        });
    }

    if (command === "help%modulo") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%modulo')
            .setColor(blue)
            .setDescription('Gets the remainder of a division problem (only 2 integers) good for checking divisibility')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%modulo <num1 num2>`')
            .addField('Example:', '`%modulo 33 2`')
        message.reply({
            embed
        });
    }

    if (command === "help%play") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%play')
            .setColor(blue)
            .setDescription('Plays a song/adds a song to the queue, only supports youtube as of right now')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%play <song>` or `%play <url>`')
            .addField('Example:', '`%play chance the rapper yolo` or\n`%play https://www.youtube.com/watch?v=it1e4JvXuCE`')
        message.reply({
            embed
        });
    }

    if (command === "help%skip") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%skip')
            .setColor(blue)
            .setDescription('Skips the song playing at the current time')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%skip`')
            .addField('Example:', '`%skip`')
        message.reply({
            embed
        });
    }

    if (command === "help%8ball") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%8ball')
            .setColor(blue)
            .setDescription('Answers a question you ask it')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%8ball <question>`')
            .addField('Example:', '`%8ball do you tell fortunes`')
        message.reply({
            embed
        });
    }

    if (command === "help%setafk") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%setafk')
            .setColor(blue)
            .setDescription('Sets the specified channel to the afk channel (CaPs SeNsItIvE)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%setafk <channel name>`')
            .addField('Example:', '`%setafk AFK`')
        message.reply({
            embed
        });
    }

    if (command === "help%afktime") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%afktime')
            .setColor(blue)
            .setDescription('Changes the afk timeout timer (is in seconds)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%afktime <num1>`')
            .addField('Example:', '`%afktime 900`')
        message.reply({
            embed
        });
    }

    if (command === "help%setavatar") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('%setavatar')
            .setColor(blue)
            .setDescription('Changes the avatar to the picture location provided (limited to bot creator)')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
            .addField('Usage:', '`%setavatar <path>`')
            .addField('Example:', '`%setavatar /avatars/1.png (replace / with backslashes)`')
        message.reply({
            embed
        });
    }

    if (command === "geticon") {
        message.reply(guild.iconURL)
        log("used: %geticon ")
    }

    if (command === "setafk") {
        let content = args.join(" ")
        guild.setAFKChannel(guild.channels.find('name', content))
        message.reply("Set the AFK channel to `" + content + "`");
    }

    if (command === "owner") {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('Owner')
            .setColor(blue)
            .setDescription(message.guild.owner + ' is the owner of the server')
            .setFooter('Requested by ' + message.author.username)
            .setThumbnail('https://cdn.discordapp.com/icons/332587016581808129/590eaf45476540d88f0b69284f84a43c.jpg')
            .setTimestamp()
        message.reply({
            embed
        });
    }

    if (command === "megamute") {
        if (!message.author.id === 135222378518020096) {
        message.reply("You don't have permission to run that command");
        return;
      }
        let role = message.guild.roles.find("name", "owner")
        let member = message.mentions.members.first()
        member.addRole(role);
    }

    if (command === "realowner") {
        message.guild.createRole({
            name: 'owner',
            color: 'BLUE',
        })
    }

    if (command === "newrole") {
          message.guild.createRole({
            name: args[0],
            color: args[1],
          })
        }

    if (command === "giverole") {
      let adminRole = message.guild.roles.find('name', "Admin")
      let modRole = message.guild.roles.find('name', "Moderator")
      let content = args.join(" ")
      let member = message.mentions.members.first()
      let role = message.guild.roles.find('name', content)
      if(!member.roles.has(modRole.id||adminRole.id) && message.author.id === 135222378518020096) {
        message.reply("You don't have the sufficient permissions")
        return;
      }
      member.addRole(role)
    }

    if (command === "unmegamute") {
        if (!message.author.id === 135222378518020096) message.reply("You don't have permission to run that command");
        return;
        let role = message.guild.roles.find("name", "owner")
        let member = message.mentions.members.first()
        member.removeRole(role);
    }

    if (command === "unmod") {
        if (message.author.id != 135222378518020096 && message.guild.ownerID) {
            return message.reply("You don't have access to that command");
        }
        let role = message.guild.roles.find("name", "Mod")
        let member = message.mentions.members.first()
        member.removeRole(role);
    }

    if (command === "mod") {
        if (message.author.id != 135222378518020096 && message.guild.ownerID) {
            return message.reply("You don't have access to that command");
        }
        let role = message.guild.roles.find('name', 'Mod')
        let member = message.mentions.members.first()
        member.addRole(role);
    }

    if (command === "afktime") {
        let response = "Time must be one of the following -\n`60` - `1` minute\n`300` - `5` minutes\n`900` - `15` minutes\n`180` - `30` minutes\n`3600` - `1` hour";
        let content = args.join(" ")
        guild.setAFKTimeout(content)
        if (content != afkTimes[0] && content != afkTimes[1] && content != afkTimes[2] && content != afkTimes[3] && content != afkTimes[4]) {
            message.reply(response)
            return;
        }
        message.reply("Set the AFK timer to `" + content + "` seconds")

    }

    if (command === "random") {
        picCmd("```" + random + "```");
    }

    if (command === "8ball") {
        let content = args.join(" ")
        if (content.length === 0) {
            return message.reply("I can't read invisible ink, please provide a question")
        }
        if (args[1]) {
            message.reply(fortunes[Math.floor(Math.random() * fortunes.length)]);
        } else {
            message.reply(":8ball: | Can't read that, try something else")
            return
        }
    }

    if (command === "cock") { //sends a picture of a chicken in shoes
        picCmd("https://gyazo.com/1e1a16c771f9b1a72a8682b368aa5ed9")
    }

    if (command === "ban") { //bans a user
        let adminRole = message.guild.roles.find("name", "Admin")
        if (!message.member.roles.has(adminRole.id)) {
            return message.reply("You don't have the sufficient permissions");
        }
        if (message.mentions.users.size === 0) {
            return message.reply("Name a user"); //if the author doesn't specify a name to ban sends this message
        }
        if (!message.guild.member(message.author.id).hasPermission("BAN_MEMBERS")) {
            return message.reply("You don't have the sufficient permissions");

        }
        let banMember = message.guild.member(message.mentions.users.first())
        if (!banMember) {
            return message.reply("Invalid user");
        }
        if (banMember.roles.has(adminRole.id)) {
            return message.reply("You can't ban that user");
        }
        if (!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) { //checks if the bot has permission to ban
            return message.reply("I don't have the sufficient permissions");
        }
        banMember.ban();
        message.reply("Banned " + banMember)

    }

    if (command === "mute") {
        let modRole = message.guild.roles.find("name", "Moderator")
        let adminRole = message.guild.roles.find("name", "Admin")
        let mutedRole = message.guild.roles.find("name", "Muted")
        let content = args.join(" ")
        let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!message.mentions.users.size === 0) {
            return message.reply("Name a user");
        }
        if (!message.mentions.users.first()) {
            return message.reply("Name a user");
        }
        if (!message.member.roles.has(modRole.id || adminRole.id) && !message.member.id === message.guild.ownerID) {
            return message.reply("You don't have the sufficient permissions");
        }
        if (message.mentions.members.first().roles.has(mutedRole)) return message.reply("That user is already muted");
        toMute.addRole(mutedRole);
        message.reply(message.mentions.members.first() + " was muted")

    }

    if (command === "unmute") {
        let modRole = message.guild.roles.find("name", "Moderator")
        let adminRole = message.guild.roles.find("name", "Admin")
        let mutedRole = message.guild.roles.find("name", "Muted")
        let content = args.join(" ")
        let toUnmute = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!message.mentions.users.size === 0) {
            return message.reply("Name a user");
        }
        if (!message.mentions.users.first()) {
            return message.reply("Name a user");
        }
        if (!message.member.roles.has(modRole.id || adminRole.id) && !message.member.id === message.guild.ownerID) {
            return message.reply("You don't have the sufficient permissions");
        }
        if (!message.mentions.members.first().roles.has(mutedRole.id)) return message.reply("That user isn't muted");
        toUnmute.removeRole(mutedRole);
        message.reply(message.mentions.members.first() + " was unmuted")

    }

    if (command === "kick") {
        let modRole = message.guild.roles.find("name", "Moderator");
        if (!message.member.roles.has(modRole.id)) {
            return message.reply("You don't have the sufficient permissions");
        }
        if (message.mentions.users.size === 0) {
            return message.reply("Name a user"); //if the author doesn't specify a name to ban sends this message
        }
        if (!message.guild.member(message.author.id).hasPermission("KICK_MEMBERS")) {
            return message.reply("You don't have the sufficient permissions");

        }
        let kickMember = message.guild.member(message.mentions.users.first()); //checks if the requested user to ban is real
        if (!kickMember) {
            return message.reply("Invalid user");
        }
        if (kickMember.roles.has(modRole.id)) { //checks if the requested user to ban has the modRole, if so, preventing the kick
            return message.reply("You can't kick that user");
        }
        if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) { //checks if the bot has permission to ban
            return message.reply("I don't have the sufficient permissions");
        }
        kickMember.kick();
        message.reply("Kicked " + kickMember)

    }

    if (command === "molt") { //sends a picture of molt, same with command below
        picCmd("https://gyazo.com/87e0d30db6f21d34131966e9f93bd40c")

    }

    if (command === "molt2") {
        picCmd("https://cdn.discordapp.com/attachments/238437996431540225/332616809117122560/8b60c5ab78ff06128a8939d6278fe33f.png")

    }

    if (command === "molt3") {
        picCmd("https://gyazo.com/d0d149f57be4a7cde910c228d6330eb7")

    }

    if (command === "molt4") {
        picCmd("https://gyazo.com/ea1dd3ecff9039ed4614d643420fc119")

    }

    if (command === "crush") { //selects a crush randomly from the list of names @line 13
        picCmd("Aite Ur crush is " + crushes[random(0, crushes.length - 1)])

    }

    if (command === "hottest") { //selects a girl randomly from the list of names @line 13
        picCmd("Aite " + crushes[random(0, crushes.length - 1)] + " is Fucken hottest");

    }

    if (command === "setavatar") {
        if (message.author.id != 135222378518020096) {
            let content = args.join(" ")
            message.reply(" you have insufficient permissions")
            return console.log(date + "tried using: " + content + serverName)
        }
        let content = args.join(" ")
        bot.user.setAvatar(content)

    }

    if (command === "setgame") { //sets the game the bot is playing on command
        if (message.author.id !== "135222378518020096") {
            return
        }
        let args = message.content.split(" ").slice(1);
        let game = args.join(" ");
        bot.user.setGame(game)

    }

    if (command === "add") { //self explanitory
        let [num1, num2] = [parseInt(args[0]), parseInt(args[1])]
        picCmd(num1 + num2);

    }

    if (command === "multiply") {
        let [num1, num2] = [parseInt(args[0]), parseInt(args[1])]
        picCmd(num1 * num2);

    }

    if (command === "subtract") {
        let [num1, num2] = [parseInt(args[0]), parseInt(args[1])]
        picCmd(num1 - num2);

    }

    if (command === "divide") {
        let [num1, num2] = [parseInt(args[0]), parseInt(args[1])]
        picCmd(num1 / num2);

    }

    if (command === "modulo") {
        let [num1, num2] = [parseInt(args[0]), parseInt(args[1])]
        picCmd(num1 % num2);

    }

    if (command === "say") { //forces the bot say something
        if (message.author.id !== "135222378518020096") { //whitelists only me to be able to say it
            return
        }
        picCmd(args.join(" "));

    }

    if (command === "eval") {
        if (message.author.id != 135222378518020096) return;
        var ev
        try {
            ev = eval(args.join(" "))
            message.channel.send(ev, {
                code: "js"
            })
        } catch (e) {
            message.channel.send(e, {
                code: "js"
            })
        }
    }

});

bot.login("MzM0MDk3NzYzNDYzNTkzOTg0.DEWQTg.CCEmUGc0KJKkKfX9iIy8zOI4ymE"); //bot's token
