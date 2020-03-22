import Textos from "mensajes/Textos";
import {Mensaje} from "mensajes/Mensaje";


export default class ConsultaNoConfigurada extends Mensaje {

    expresionRegular() {
        return new RegExp("^Tengo una consulta", "i");
    }

    respuesta() {
        return Textos.canalDeConsultasNoConfigurado();
    }
}