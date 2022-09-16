const { App } = require('@slack/bolt');
const { config } = require('dotenv')

const axios = require('axios')
config()
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN, // add this
    socketMode: true, // add this
    port: process.env.PORT || 3000

})
let channel_id="C042SJ6LA57"

const convo_history =async()=>{

    const history_message=
    axios({
        method:'get',
        url:`https://slack.com/api/conversations.history?channel=${channel_id}&inclusive=text&pretty=1`,
        contentType: 'application/x-www-form-urlencoded',
        headers: { "Authorization": "Bearer xoxb-4104987748384-4089260640547-AEM8DgI2EOcA9gbSAXbIEJw3" },
    }).then((response)=>{
        console.log(response.data)
    },(error)=>{
        console.log(error)
    })
}
const revoke = async () => {

    const revok_rtoken = axios({
        method: 'get',
        url: 'https://slack.com/api/auth.revoke',
        contentType: 'application/x-www-form-urlencoded',
        headers: { "Authorization": "Bearer xoxb-4104987748384-4089260640547-AEM8DgI2EOcA9gbSAXbIEJw3" },
    }).then((response) => {
        console.log(response.data)
    }, (error) => {
        console.log(error)
    });
}
app.message('hello', async ({ context, say }) => {
    // RegExp matches are inside of context.matches
    const greeting = context.matches[0];

    await say(`${greeting}, how are you?`);
});
const make_connection = async () => {
    await app.start();
    console.log("BOLT APP START")
}



convo_history()
// revoke()
// listen_to_message()
make_connection()