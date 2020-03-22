import Textos from "mensajes/Textos";
import {Mensaje} from "mensajes/Mensaje";

export class Saludo extends Mensaje {

    expresionRegular(mensaje) {
        const saludos = [
            "h", "hi", "hello", "hey", "hola", "buenas",
            "como estas?", "cómo estás?", "help", "ayuda"
        ];
        return new RegExp(`^(${saludos.join("|")})$`, "i");
    }

    respuesta({user}) {
        return Textos.saludar(user);
    }
}