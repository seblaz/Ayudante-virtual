import {Saludo} from "mensajes/Saludo";
import NoEntendido from "mensajes/NoEntendido";
import ConsultaNoConfigurada from "mensajes/ConsultaNoConfigurada";
import Servicios from "Servicios";
import ConsultaConfigurada from "mensajes/ConsultaConfigurada";

export default class Conversacion {

    _configurada(teamId) {
        return Servicios.get('canalesDeConsulta').existeCanal(teamId);
    }

    mensaje(message) {
        const consulta = this._configurada(message.team) ? new ConsultaConfigurada() : new ConsultaNoConfigurada();
        return  [new Saludo(), consulta, new NoEntendido()]
            .find(mensaje => mensaje.puedeRecibirMensaje(message.text))
    }
}