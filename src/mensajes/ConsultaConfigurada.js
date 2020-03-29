import Textos from "mensajes/Textos";
import Servicios from "Servicios";
import EnviarMensaje from "acciones/EnviarMensaje";
import {Consulta} from "mensajes/Consulta";


export default class ConsultaConfigurada extends Consulta {

    respuesta() {
        return Textos.confirmarConsulta();
    }

    accion(message) {
        return new EnviarMensaje({
            canal: Servicios.get('canalesDeConsulta').getCanal(message.team),
            mensaje: Textos.transmitirConsulta(message.user, message.text) +
                "\n" + this._adjuntos(message.files)
        });
    }

    _adjuntos(archivos) {
        return archivos ? "Y adjuntó los siguientes archivos:\n" +
            archivos.map(archivo => ` • <${archivo.permalink}|${archivo.name}>`)
                .join("\n") : '';
    }
}