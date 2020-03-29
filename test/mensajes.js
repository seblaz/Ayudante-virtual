import sinon from "sinon";
import {Saludo} from "mensajes/Saludo";
import NoEntendido from "mensajes/NoEntendido";
import {Consulta} from "mensajes/Consulta";
import {Mensaje} from "mensajes/Mensaje";
import AccionNula from "acciones/AccionNula";
import ConsultaConfigurada from "mensajes/ConsultaConfigurada";
import Conversacion from "mensajes/Conversacion";
const EnviarMensaje = require("acciones/EnviarMensaje");


describe('Mensajes', () => {
    describe('Mensaje', () => {
        it('tiene una accion nula.', () => {
            const mensaje = new Mensaje();
            mensaje.accion().should.be.instanceOf(AccionNula)
        });
    });

    describe('Saludo', () => {
        it('recibe mensajes que dicen "hola".', () => {
            const saludo = new Saludo();
            saludo.puedeRecibirMensaje("hola").should.be.true()
        });

        it('recibe mensajes que comienzan con "hola".', () => {
            const saludo = new Saludo();
            saludo.puedeRecibirMensaje("Hola ayudante virtual.").should.be.true()
        });

        it('no recibe mensajes que contienen "hola".', () => {
            const saludo = new Saludo();
            saludo.puedeRecibirMensaje("Ayudante virtual, hola, todo bien?.").should.be.false()
        });
    });

    describe('No entedido', () => {
        it('recibe cualquier mensaje', () => {
            const noEntendido = new NoEntendido();
            noEntendido.puedeRecibirMensaje("hola").should.be.true();
            noEntendido.puedeRecibirMensaje("cualquier mensaje").should.be.true()
        });
    });

    describe('Consulta', () => {
        it('recibe los mensajes que comienzan con "Tengo una consulta".', () => {
            const consulta = new Consulta();
            consulta.puedeRecibirMensaje("Tengo una consulta: que puede hacer el ayudante?").should.be.true();
            consulta.puedeRecibirMensaje("Tengo una consulta: mi consulta puede empezar con minúscula?").should.be.true();
        });

        it('no recibe los mensajes que contien la frase "Tengo una consulta".', () => {
            const consulta = new Consulta();
            consulta.puedeRecibirMensaje("Que pasa si tengo una consulta?").should.be.false();
        });
    });

    describe('Consulta configurada', () => {
        it('envia un mensaje con los links de los archivos de la consulta.', () => {
            const consulta = new ConsultaConfigurada();
            const files = [
                {permalink: "mi link1"},
                {permalink: "mi link2"},
            ];

            const spy = sinon.spy(EnviarMensaje, "default");
            consulta.accion({files});
            spy.should.be.calledWithMatch(
                sinon.match(({mensaje}) =>
                    mensaje.includes('mi link1') && mensaje.includes('mi link2')
                )
            );
        });
    });

    describe('Conversacion', () => {
        it('devuelve un saludo si el mensaje empieza con "hola".', () => {
            const conversacion =  new Conversacion();
            conversacion.mensaje({text: "hola ayudante"}).should.be.instanceOf(Saludo);
        });

        it('devuelve una consulta si el mensaje empieza con "tengo una consulta".', () => {
            const conversacion =  new Conversacion();
            conversacion.mensaje({text: "tengo una consulta: cómo funciona?"}).should.be.instanceOf(Consulta);
        });

        it('devuelve no entendido si el mensaje no es reconocido por otros saludos.', () => {
            const conversacion =  new Conversacion();
            conversacion.mensaje({text: "Y tengo una consulta: cómo decir hola?"}).should.be.instanceOf(NoEntendido);
        });
    });
});
