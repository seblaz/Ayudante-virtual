import Conversacion from "mensajes/Conversacion";
import Textos from "mensajes/Textos";
import EnviarMensaje from "acciones/EnviarMensaje";
import Servicios from "Servicios";

export default class Receptores {

    static nuevoMiembro({app, event, context}) {
        new EnviarMensaje({
            canal: event.user.id,
            mensaje: Textos.saludar(event.user.id)
        }).realizar({app, context});
    }

    static mensajes({app, message, say, context, body}) {
        message.team = body.team_id; // Cuando se envían archivos message.team no existe (https://github.com/slackapi/bolt/issues/435).
        const mensaje = new Conversacion().mensaje(message);

        return mensaje
            .accion(message)
            .realizar({app, context})
            .then(async () => await say(mensaje.respuesta(message)))
            .catch(async (error) => {
                app.logger.error(error);
                await say(Textos.error())
            });
    }

    static async setCanalDeConsultas({app, command, say, context, ack}) {
        await ack();

        let canal;
        if (['aquí', 'acá', 'aqui', 'aca', 'here'].includes(command.text)) {
            canal = command.channel_id;
        } else {
            const encontrarCanal = (mensaje) => {
                const results = /^<#(C[A-Z0-9]*)(?:\|[a-zA-Z0-9\-\_]*)?>$/.exec(mensaje);
                return results && results[1];
            };
            canal = encontrarCanal(command.text);
            if (!canal) {
                app.logger.info(`No se encontró el canal en el texto ${command.text}.`);
                return await say(Textos.setCanalDeConsultasIncorrecto());
            }
        }

        return new EnviarMensaje({
            canal: canal,
            mensaje: Textos.confirmacionEnCanal(command.user_id)
        })
            .realizar({app, context})
            .then(async () => {
                Servicios.get('canalesDeConsulta').setCanal(command.team_id, canal);
                await say(Textos.setCanalDeConsultasCorrecto(canal));
            })
            .catch(async (error) => {
                app.logger.error(error);
                await say(Textos.elBotNoSeEncuentraEnElCanal(canal))
            })
    }
}