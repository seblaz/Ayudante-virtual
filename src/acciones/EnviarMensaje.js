import Accion from "acciones/Accion";

export default class EnviarMensaje extends Accion {

    constructor({canal, mensaje, archivos}) {
        super();
        this._canal = canal;
        this._mensaje = mensaje;
    }

    realizar({app, context}) {
        return app.client.chat.postMessage({
            token: context.botToken,
            channel: this._canal,
            text: this._mensaje
        })
    }
}