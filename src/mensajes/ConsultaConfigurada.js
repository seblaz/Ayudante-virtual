import Textos from "mensajes/Textos";
import {Mensaje} from "mensajes/Mensaje";
import Servicios from "Servicios";
import EnviarMensaje from "acciones/EnviarMensaje";


export default class ConsultaNoConfigurada extends Mensaje {

    expresionRegular() {
        return new RegExp("^Tengo una consulta", "i");
    }

    respuesta() {
        return Textos.confirmarConsulta();
    }

    accion(message) {
        return new EnviarMensaje({
            canal: Servicios.get('canalesDeConsulta').getCanal(message.team),
            mensaje: Textos.transmitirConsulta(message.user, message.text)
        });
    }
}