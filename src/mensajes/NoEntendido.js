import {Mensaje} from "mensajes/Mensaje";
import Textos from "mensajes/Textos";

export default class NoEntendido extends Mensaje {

    expresionRegular() {
        return new RegExp(".*")
    }

    respuesta() {
        return Textos.noEntendido()
    }
}