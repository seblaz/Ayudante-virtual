const {ExpressReceiver} = require('@slack/bolt');
const {WebClient} = require('@slack/web-api');


const Auth = ({clientId, clientSecret, signingSecret, redirectUrl, stateCheck, onSuccess, onError}) => {
    // param checks
    !clientId && throw new Error('clientId is required.');
    !clientSecret && throw new Error('clientSecret is required.');
    !signingSecret && throw new Error('signingSecret is required.');
    !redirectUrl && throw new Error('redirectUrl is required.');
    !onSuccess && throw new Error('onSuccess is required.');
    typeof (onSuccess) !== 'function' && throw new Error('onSuccess must be a function.');
    !onError && throw new Error('onError is required.');
    typeof (onError) !== 'function' && throw new Error('onError must be a function.');
    !stateCheck && throw new Error('stateCheck is required.');
    typeof (stateCheck) !== 'function' && throw new Error('stateCheck is required.');

    // custom receiver
    const receiver = new ExpressReceiver({signingSecret});

    // the express app
    const expressApp = receiver.app;

    // the oauth callback
    const callbackUrl = new URL(redirectUrl);
    expressApp.get(callbackUrl.pathname, async (req, res) => {
        // do a state check
        let state = req.query.state;
        let stateIsValid = stateCheck(state);

        // if not valid, throw error
        if (!stateIsValid) {
            await onError(new Error('Invalid state.'));
            return;
        }

        // get tokens
        const webClient = new WebClient(null);
        return webClient.oauth.v2.access({
            client_id: clientId,
            client_secret: clientSecret,
            code: req.query.code,
            redirect_url: redirectUrl
        }).then(async oAuthResult => {
            const result = await webClient.auth.test({token: oAuthResult.access_token});
            await onSuccess({res, oAuthResult: {bot_id: result.bot_id, ...oAuthResult}});
        }).catch(async error => {
            await onError(error);
        })
    });

    return receiver;
};

module.exports = ({app, clientId, clientSecret, signingSecret, redirectUrl, stateCheck, onSuccess, onError}) => {
    return Auth({app, clientId, clientSecret, signingSecret, redirectUrl, stateCheck, onSuccess, onError});
};