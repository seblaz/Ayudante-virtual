import AppReceiver from "app/AppReceiver";
import {LogLevel} from "@slack/bolt";
import {App} from "@slack/bolt";
import Receptores from "app/Receptores";
import Logger from "app/Logger";


export default class AyudanteVirtual {

    constructor() {
        const receiver = new AppReceiver();
        const logger = new Logger();

        this.app = new App({
            authorize: receiver.authorizeFn,
            logLevel: LogLevel.DEBUG,
            receiver: receiver,
            logger: logger
        });

        // Esto no está bueno, pero no puedo cambiar el logger porque Bolt no lo permite.
        // Ver https://github.com/slackapi/bolt/pull/278.
        this.app.client.logger = logger;

        this.app.logger.debug('App iniciada.');

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
