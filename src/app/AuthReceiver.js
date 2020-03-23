import {ExpressReceiver} from '@slack/bolt';
import {WebClient} from '@slack/web-api';


export default class AuthReceiver extends ExpressReceiver {

    constructor({signingSecret, ...other}) {
        AuthReceiver._checkParameters({signingSecret, ...other});
        super({signingSecret});
        this._appInstallation(other);
    }

    static _checkParameters({clientId, clientSecret, signingSecret, redirectUrl, stateCheck, onSuccess, onError}) {
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
    }

    _appInstallation({clientId, clientSecret, redirectUrl, stateCheck, onSuccess, onError}) {
        this.app.get(redirectUrl, (req, res) => {
            if (!stateCheck(req.query.state)) return onError(new Error('Invalid state.'));

            const webClient = new WebClient(null);
            return webClient.oauth.v2.access({ // get tokens
                client_id: clientId,
                client_secret: clientSecret,
                code: req.query.code,
                redirect_url: redirectUrl
            })
                .then(oAuthResult => {
                    return webClient.auth.test({token: oAuthResult.access_token})
                })
                .then(result => {
                    onSuccess({res, oAuthResult: {bot_id: result.bot_id, ...oAuthResult}})
                })
                .catch(async error => {
                    await onError(error);
                })
        });
    }
}