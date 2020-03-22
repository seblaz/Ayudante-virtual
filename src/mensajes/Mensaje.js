import AccionNula from "acciones/AccionNula";

export class Mensaje {

    puedeRecibirMensaje(mensaje){
        return this.expresionRegular().test(mensaje)
    }

    expresionRegular() {
        throw new Error('Mensaje no implementado.')
    }

    respuesta(message) {
        throw new Error('Mensaje no implementado.')
    }

    accion(message) {
        return new AccionNula();
    }
}