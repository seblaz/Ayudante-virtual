import Conversacion from "mensajes/Conversacion";
import Textos from "mensajes/Textos";
import EnviarMensaje from "acciones/EnviarMensaje";
import Servicios from "Servicios";


/**
 * Guardo los mensajes respondidos. Esto se debe a que
 * Bolt no me permite saber si el mensaje es el original
 * o uno repetido por error en la red.
 * Esta solución no es buena, pero abría que abrir un issue
 * en Bolt para ver cómo obtener esta info (probablemente
 * modificando ExpressServer).
 * A su vez no me interesa persistir esta info mucho tiempo,
 * dado que las repeticiones ocurren en periodos no mucho
 * mayores a un minuto.
 */
const elementosRespondidos = new Set();

export default class Receptores {

    static nuevoMiembro({app, event, context}) {
        if(elementosRespondidos.has(event.user.id))
            return app.logger.debug(`Bienvenida repetida de: ${event.user.id}.`);

        elementosRespondidos.add(event.user.id);
        app.logger.debug(`Se unió un nuevo miembro: ${event.user.id}.`);

        new EnviarMensaje({
            canal: event.user.id,
            mensaje: Textos.saludar(event.user.id)
        }).realizar({app, context});
    }

    static mensajes({app, message, say, context, body}) {
        if(elementosRespondidos.has(message.client_msg_id))
            return app.logger.debug(`Mensaje repetido: ${message.text}.`);

        elementosRespondidos.add(message.client_msg_id);
        app.logger.debug(`Mensaje recibido: ${message.text}.`);

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
        app.logger.info(`SetCanalDeConsultas recibido con: ${command.text}.`);

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