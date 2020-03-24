import AuthReceiver from "app/AuthReceiver";
import AuthConfig from "app/AuthConfig";
import express from "express";
import Servicios from "Servicios";


export default class AppReceiver extends AuthReceiver {

    constructor() {
        super(new AuthConfig());
        this._staticAssets();
    }

    _staticAssets() {
        this.app.use(express.static('public'));
    }

    authorizeFn(authorize) {
        return Servicios.get('tokens').getTokens(authorize)
    }
}
