import AppReceiver from "app/AppReceiver";
import {LogLevel} from "@slack/bolt";
import {App} from "@slack/bolt";
import Receptores from "app/Receptores";


export default class AyudanteVirtual {

    constructor() {
        const receiver = new AppReceiver();
        this.app = new App({
            authorize: receiver.authorizeFn,
            logLevel: LogLevel.DEBUG,
            receiver: receiver
        });

        this.subscribirBienvenida(this.app);
        this.subscribirMensajes(this.app);
        this.recibirSetCanalDeConsultas(this.app);
    }

    start(port) {
        return this.app.start(port);
    }

    stop() {
        return this.app.stop()
    }

    subscribirBienvenida(app) {
        app.event('team_join', request => Receptores.nuevoMiembro({app, ...request}));
    }

    subscribirMensajes(app) {
        app.message(/.*/, request => Receptores.mensajes({app, ...request}))
    }

    recibirSetCanalDeConsultas(app) {
        app.command('/set-canal-de-consultas', request => Receptores.setCanalDeConsultas({app, ...request}));
    };
}
