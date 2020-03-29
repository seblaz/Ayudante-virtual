import Textos from "mensajes/Textos";
import {Consulta} from "mensajes/Consulta";


export default class ConsultaNoConfigurada extends Consulta {

    respuesta() {
        return Textos.canalDeConsultasNoConfigurado();
    }
}