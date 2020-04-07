import Conversacion from "mensajes/Conversacion";
import Textos from "mensajes/Textos";
import EnviarMensaje from "acciones/EnviarMensaje";
import Servicios from "Servicios";


/**
 * Guardo los elementos respondidos (mensajes, comandos, eventos,
 * etc...).Esto se debe a que Bolt no me permite saber si el evento es
 * el original o uno repetido por error en la red.
 * Esta solución no es buena, pero abría que abrir un issue en Bolt
 * para ver cómo obtener esta info (probablemente modificando
 * ExpressServer).
 * A su vez no me interesa persistir esta info mucho tiempo, dado que
 * las repeticiones ocurren en periodos no mucho mayores a un minuto.
 */
const elementosRespondidos = new Set();

export default class Receptores {

    static checkEvent(id) {
        if (elementosRespondidos.has(id)) {
            Servicios.get('logger').debug(`evento repetido: ${id}.`);
            throw new Error('Evento repetido');
        }
        elementosRespondidos.add(id);
    }

    static nuevoMiembro({app, event, context}) {
        this.checkEvent(event.user.id);
        app.logger.debug(`Se unió un nuevo miembro: ${event.user.id}.`);

        new EnviarMensaje({
            canal: event.user.id,
            mensaje: Textos.saludar(event.user.id)
        }).realizar({app, context});
    }

    static mensajes({app, message, say, context, body}) {
        this.checkEvent(message.client_msg_id);
        app.logger.debug(`Mensaje recibido: ${message.text} con id ${message.client_msg_id}.`);

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

    static async setCanalDeConsultas({app, command, say, respond, ack}) {
        this.checkEvent(command.trigger_id);
        app.logger.info(`SetCanalDeConsultas recibido con: ${command.text}.`);

        await ack();

        if (!['aquí', 'acá', 'aqui', 'aca', 'here'].includes(command.text)) {
            app.logger.info(`No se indicaron palabras claves al setear un canal en: ${command.text}.`);
            return await respond(Textos.setCanalDeConsultasIncorrecto());
        }

        return say(Textos.confirmacionEnCanal(command.user_id))
            .then(async () => {
                Servicios.get('canalesDeConsulta').setCanal(command.team_id, command.channel_id);
                await respond(Textos.setCanalDeConsultasCorrecto());
            })
            .catch(async (error) => {
                app.logger.error(error);
                await respond(Textos.elBotNoSeEncuentraEnElCanal())
            })
    }
}