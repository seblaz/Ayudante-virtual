import CanalesDeConsulta from "persistencia/CanalesDeConsulta";
import Tokens from "persistencia/Tokens";


class Servicios {

    constructor() {
        this._servicios = [];
        this._set('canalesDeConsulta', new CanalesDeConsulta());
        this._set('tokens', new Tokens())
    }

    _set(nombre, servicio) {
        this._servicios[nombre] = servicio;
    }

    get(nombre) {
        return this._servicios[nombre];
    }
}

export default new Servicios();