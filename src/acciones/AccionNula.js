import Accion from "acciones/Accion";

export default class AccionNula extends Accion {

    constructor() {
        super();
    }

    realizar() {
        return Promise.resolve(true);
    }
}