import Servicios from "Servicios";


export default class AuthConfig {

    constructor() {
        this.clientId = process.env.SLACK_CLIENT_ID || 'client id';
        this.clientSecret = process.env.SLACK_CLIENT_SECRET || 'client secret';
        this.signingSecret = process.env.SLACK_SIGNING_SECRET || 'signing secret';
        this.redirectUrl = '/oauth/v2/authorize';
        this.stateCheck = this.stateCheck;
        this.onSuccess = this.onSuccess;
        this.onError = this.onError;
    }

    stateCheck(oAuthState) {
        return true
    }

    onSuccess({res, oAuthResult}) {
        Servicios.get('tokens').setTokens(oAuthResult);
        res.redirect('/confirmacion.html');
    }

    onError({res, error}) {
        console.log(error);
        res.redirect('/error.html');
    }
}