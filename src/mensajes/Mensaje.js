import AccionNula from "acciones/AccionNula";

export class Mensaje {

    puedeRecibirMensaje(mensaje){
        return this.expresionRegular().test(mensaje)
    }

    expresionRegular() {
        throw new Error('Método no implementado.')
    }

    respuesta(message) {
        throw new Error('Método no implementado.')
    }

    accion(message) {
        return new AccionNula();
    }
}