import sinon from "sinon";
import AccionNula from "acciones/AccionNula";
import EnviarMensaje from "acciones/EnviarMensaje";


describe('Acciones', () => {
    describe('Accion Nula', () => {
        it('siempre devuelve true.', () => {
            return new AccionNula().realizar().should.eventually.be.ok()
        });
    });

    describe('Enviar Mensaje', () => {
        it('llama correctamente a la app.', () => {
            const app = {client: {chat: {postMessage: sinon.stub()}}};
            const canal = 'mi canal';
            const mensaje = 'mi mensaje';
            const token = 'mi token';

            new EnviarMensaje({canal, mensaje})
                .realizar({app, context: {botToken: token}});

            app.client.chat.postMessage
                .should.be.calledWith({token: token, channel: canal, text: mensaje})
        });
    });
});
