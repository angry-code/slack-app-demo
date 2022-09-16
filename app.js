const { App, asCodedError } = require('@slack/bolt');
const {config} = require('dotenv')
const axios = require('axios')
config()
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN, // add this
    socketMode: true, // add this
    port:process.env.PORT || 3000

})

app.message('hello', async ({ message, say }) => {
    // await say(`There is a message<@${message.user}>!`)
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                      "type": "plain_text",
                      "text": "Click Me"
                    },
                    "action_id": "button_click"
                  }
            }
        ],
        text: `Hey there <@${message.user}>!`
    });
    console.log("sdsad",text)
})
app.action('button_click', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
  });

const make_connection = async () => {
    await app.start();
    // let revoke =app.client.auth.revoke(process.env.SLACK_APP_TOKEN)
    // if(revoke){
    //     console.log("revoed")
    // }
    console.log("BOLT APP START")
}


make_connection()

