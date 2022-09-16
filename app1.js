
var SlackClient = require('@slack/client');

var autoReconnect = true;

// Put your bot API token here
var token = process.env.SLACK_BOT_TOKEN;

var team = "slackread";

var slackClient =  new SlackClient(token, autoReconnect);
 
var bot;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var getChannelHistory = function() {
  this.get = function(family, value, callback) {
  var xhr = new XMLHttpRequest();
  var url = "https://" + team + ".slack.com/api/" + family + ".history?token=" + token + "&channel=" + value;
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4 && xhr.status == 200)
      callback(xhr.responseText);
    }
    xhr.open("GET", url, true); 
    xhr.send();
  }
}

slackClient.on('loggedIn', function(user, team) {
  bot = user;
  console.log("Logged in as " + user.name
    + " of " + team.name + ", but not yet connected");
});

slackClient.on('open', function() {

  // Find out which public channels the bot is a member of
  var botChannels = Object.keys(slackClient.channels)
    .map(function (k) { return slackClient.channels[k]; })
    .filter(function (c) { return c.is_member; })
    .map(function (c) { return c.name; });

  // Find out which private channels the bot is a member of
  var botGroups = Object.keys(slackClient.groups)
    .map(function (k) { return slackClient.groups[k]; })
    .filter(function (g) { return g.is_open && !g.is_archived; })
    .map(function (g) { return g.name; });
 
  // Tell us when the bot is connected
  console.log('Connected as ' + slackClient.self.name + ' of ' + slackClient.team.name);
 
  if (botChannels.length > 0) {
    console.log('You are in these public channels: ' + botChannels.join(', '));
  } else {
    console.log('You are not in any public channels.');
  }
 
  if (botGroups.length > 0) {
     console.log('You are in these private channels: ' + botGroups.join(', '));
  } else {
    console.log('You are not in any private channels.');
  }
});

slackClient.on('message', function(message) {
  // Ignore the bot's own messages
  if (message.user == bot.id) return;
 
  // Get the current channel, 
  var channel = slackClient.getChannelGroupOrDMByID(message.channel);
  if (message.type === 'message' && message.text.length >= 0 && message.text.indexOf(slackClient.self.id) > -1) { 
    searchString = message.text.split(" ").pop();

    console.log("Attempting to query channel: " + searchString);
    var myChannel = slackClient.getChannelGroupOrDMByName(searchString);
    if (typeof myChannel != "undefined") {      
      var myChannelID = myChannel['id'];
      if (myChannel.getType() == 'Group') {
        family = "groups";
      } else {
        family = "channels";
      };
      history = new getChannelHistory();
      history.get(family, myChannelID, function(response) {
        json = JSON.parse(response);
        mymessages = json['messages'];

        var unresolved = [];

        for (var i = 0; mymessages.length > i; i++) {
          var msgStatus = mymessages[i]['reactions'];

          if (typeof msgStatus == "undefined") {
            unresolved.push(mymessages[i].text);
          }
        };

        var myCount = unresolved.length;
        var list = unresolved.join("\n");

        channel.send("Your Unresolved Items: \n" + list);
        console.log("Query successful! Returned " + myCount + " items")
      });

    } else {
      channel.send("I'm sorry, I don't understand. I need you to end your sentence with a valid channel name of which I am a member.");

      console.log("Query FAILED.");
      console.log("Did your sentence end with a valid channel name?");
      console.log("Have you invited TaskBot to join the requested channel?");
    }
  }; 
});

slackClient.login()
