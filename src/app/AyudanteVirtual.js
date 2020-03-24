import Textos from "mensajes/Textos";
import Conversacion from "mensajes/Conversacion";
import EnviarMensaje from "acciones/EnviarMensaje";
import Servicios from "Servicios";
import AppReceiver from "app/AppReceiver";
import {LogLevel} from "@slack/bolt";
import App from "@slack/bolt/dist/App";


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

    recibirSetCanalDeConsultas(app) {
        app.command('/set-canal-de-consultas', ({command, say, context, ack}) => {
            ack();

            let canal;
            try {
                canal = this.encontrarCanal(command.text)
            } catch (e) {
                console.log(`No se encontró el canal en el texto ${command.text}.`, e);
                say(Textos.setCanalDeConsultasIncorrecto());
                return;
            }

            new EnviarMensaje({
                canal: canal,
                mensaje: Textos.confirmacionEnCanal(command.user_id)
            })
                .realizar({app, context})
                .then(() => {
                    Servicios.get('canalesDeConsulta').setCanal(command.team_id, canal);
                    say(Textos.setCanalDeConsultasCorrecto(canal));
                })
                .catch((error) => {
                    console.log(error);
                    say(Textos.elBotNoSeEncuentraEnElCanal(canal))
                })
        });
    };

    encontrarCanal(mensaje) {
        const results = /<#(C[A-Z0-9]*)(|.*)?>/.exec(mensaje);
        !results && throw new Error('Canal no encontrado');
        return results[1];
    }

    subscribirBienvenida(app) {
        app.event('team_join', async ({event, context}) => {
            new EnviarMensaje({
                canal: event.user.id,
                mensaje: Textos.saludar(event.user.id)
            }).realizar({app, context});
        });
    }

    subscribirMensajes(app) {
        app.message(/.*/, ({message, say, context, body}) => {
            message.team = body.team_id; // Cuando se envían archivos message.team no existe (https://github.com/slackapi/bolt/issues/435).
            const mensaje = new Conversacion().mensaje(message);

            mensaje
                .accion(message)
                .realizar({app, context})
                .then(() => say(mensaje.respuesta(message)))
                .catch((error) => {
                    console.log(error);
                    say(Textos.error())
                });
        })
    }
}
