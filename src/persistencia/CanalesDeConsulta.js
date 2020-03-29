import Almacenamiento from "persistencia/Almacenamiento";


export default class CanalesDeConsulta extends Almacenamiento {

    constructor({file = 'canales.json', dataDir = '.data'} = {}) {
        super({file, dataDir});
    }

    setCanal(teamId, canal) {
        this.db.set(`${teamId}.canal`, canal).write()
    }

    getCanal(teamId) {
        return this.existeCanal(teamId) && this.db.get(`${teamId}.canal`).value();
    }

    existeCanal(teamId) {
        return this.db.has(`${teamId}.canal`).value();
    }
}