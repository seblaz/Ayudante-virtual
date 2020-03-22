const {App, LogLevel} = require("@slack/bolt");

import Respuestas from "Respuestas";
import Auth from 'Auth';
import Tokens from "persistencia/Tokens";


const tokens = new Tokens();

const oauthError = (error) => {
    console.log(error);
};

const oauthStateCheck = (oAuthState) => {
    // check the parameter state against your saved state to ensure everything is ok
    return true;
};

const oauthSuccess = ({ res, oAuthResult }) => {
    tokens.setTokens(oAuthResult);
    res.redirect('https://htmlpreview.github.io/?https://github.com/seblaz/Ayudante-virtual/blob/master/confirmacion/index.html');
};

const authorizeFn = (authorize) => {
    return tokens.getTokens(authorize);
};

const app = new App({
    authorize: authorizeFn,
    logLevel: LogLevel.DEBUG,
    receiver: Auth({
        clientId:  process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        redirectUrl: process.env.SLACK_REDIRECT_URL,
        stateCheck: oauthStateCheck,
        onSuccess: oauthSuccess,
        onError: oauthError
    })
});

new Respuestas(app);

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
})();
