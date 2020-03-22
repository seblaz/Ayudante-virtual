import Almacenamiento from "persistencia/Almacenamiento";


export default class CanalesDeConsulta extends Almacenamiento {

    constructor() {
        super('canales.json');
    }

    setCanal(teamId, canal) {
        console.log(`Actualizando canal del equipo ${teamId} a ${canal}`);
        this.db.set(`${teamId}.canal`, canal).write()
    }

    getCanal(teamId) {
        return this.existeCanal(teamId) && this.db.get(`${teamId}.canal`).value();
    }

    existeCanal(teamId) {
        return this.db.has(`${teamId}.canal`).value();
    }
}