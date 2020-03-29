import {Mensaje} from "mensajes/Mensaje";


export class Consulta extends Mensaje {

    expresionRegular() {
        return new RegExp("^Tengo una consulta", "i");
    }
}