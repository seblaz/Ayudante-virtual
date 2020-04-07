import sinon from "sinon";
import AuthReceiver from "app/AuthReceiver";
import request from 'supertest';
import * as WebApi from "@slack/web-api";
import AuthConfig from "app/AuthConfig";
import Tokens from "persistencia/Tokens";
import AppReceiver from "app/AppReceiver";
import AyudanteVirtual from "app/AyudanteVirtual";
import {App} from "@slack/bolt";
import Receptores from "app/Receptores";
import CanalesDeConsulta from "persistencia/CanalesDeConsulta";
import Logger from "app/Logger";


describe('App', () => {
    before(() => {
        process.env.SLACK_CLIENT_ID = 'client id';
        process.env.SLACK_CLIENT_SECRET = 'client secret';
        process.env.SLACK_SIGNING_SECRET = 'signing secret';
    });

    describe('AuthReceiver', () => {
        const params = {
            clientId: 'clientId',
            clientSecret: 'clientSecret',
            signingSecret: 'signingSecret',
            redirectUrl: '/redirectUrl',
            onSuccess: () => null,
            stateCheck: () => true,
            onError: () => null
        };

        it('eleva un error si no recibe parámetros.', () => {
            (() => new AuthReceiver()).should.throw()
        });

        it('eleva un error si falta algún parámetro requerido.', () => {
            ['clientId', 'clientSecret', 'signingSecret', 'redirectUrl', 'stateCheck', 'onSuccess', 'onError']
                .forEach(prop => {
                    const myParams = {...params};

                    delete myParams[prop];
                    (() => {
                        new AuthReceiver(myParams)
                    }).should.throw(`${prop} is required.`)
                });
        });

        it('eleva un error si "onSuccess", "onError" o "stateCheck" no son funciones.', () => {
            ['onSuccess', 'onError', 'stateCheck']
                .forEach(prop => {
                    const myParams = {...params};

                    myParams[prop] = 'string';
                    (() => {
                        new AuthReceiver(myParams)
                    }).should.throw(`${prop} must be a function.`)
                });
        });

        it('llama a "onError" si "stateCheck" devuelve false.', (done) => {
            const myParams = {
                ...params,
                stateCheck: () => false,
                onError: ({res}) => res.sendStatus(501)
            };
            const onErrorSpy = sinon.spy(myParams, "onError");
            const receiver = new AuthReceiver(myParams);

            request(receiver.app)
                .get(myParams.redirectUrl)
                .end(() => {
                    onErrorSpy.should.be.calledOnce();
                    done();
                });
        });

        it('llama a "onError" webClient.oauth.v2.access falla.', (done) => {
            const myParams = {
                ...params,
                onError: ({res}) => res.sendStatus(501)
            };
            const onErrorSpy = sinon.spy(myParams, "onError");
            const receiver = new AuthReceiver(myParams);

            sinon.stub(WebApi, 'WebClient').returns({
                oauth: {v2: {access: () => Promise.reject("Error de conexión.")}},
            });
            request(receiver.app)
                .get(myParams.redirectUrl)
                .end(() => {
                    onErrorSpy.should.be.calledOnce();
                    done();
                });
        });

        it('llama a "onSuccess" si "stateCheck" devuelve true (y pasan los ckecks).', (done) => {
            const myParams = {
                ...params,
                onSuccess: ({res}) => res.sendStatus(200)
            };
            const onSuccessSpy = sinon.spy(myParams, "onSuccess");
            sinon.stub(WebApi, 'WebClient').returns({
                oauth: {v2: {access: () => Promise.resolve(true)}},
                auth: {test: () => Promise.resolve(true)}
            });
            const receiver = new AuthReceiver(myParams);

            request(receiver.app)
                .get(myParams.redirectUrl)
                .end(() => {
                    onSuccessSpy.should.be.calledOnce();
                    done();
                });
        });
    });

    describe('Auth Config', () => {
        it('stateCheck no realiza validaciones.', () => {
            new AuthConfig().stateCheck().should.be.ok();
        });

        let setTokensStub;

        beforeEach(() => {
            setTokensStub = sinon.stub(Tokens.prototype, "setTokens");
        });

        it('onSuccess guarda los tokens.', () => {
            new AuthConfig().onSuccess({res: {redirect: sinon.stub()}, oAuthResult: {team: {id: 1}}});
            setTokensStub.should.be.calledOnce();
        });

        it('onSuccess redirecciona a una página de confirmación.', () => {
            const redirect = sinon.stub();
            new AuthConfig().onSuccess({res: {redirect}, oAuthResult: {team: {id: 1}}});
            redirect.should.be.calledOnce().and.be.calledWithMatch('confirmacion');
        });

        it('onError redirecciona a una página de error.', () => {
            const redirect = sinon.stub();
            new AuthConfig().onError({res: {redirect}});
            redirect.should.be.calledOnce().and.be.calledWithMatch('error');
        });
    });

    describe('AppReceiver', () => {
        it('authorizeFn busca los tokens.', () => {
            const getTokensStub = sinon.stub(Tokens.prototype, "getTokens");
            new AppReceiver().authorizeFn();
            getTokensStub.should.be.calledOnce();
        });
    });

    describe('Ayudante Virtual', () => {
        it('puede inisciarse y pararse.', async () => {
            const ayudante = new AyudanteVirtual();
            await ayudante.start();
            await ayudante.stop();
        });

        it('envía un mensaje de bienvenida a los miembros.', () => {
            const eventSpy = sinon.spy(App.prototype, "event");
            new AyudanteVirtual();
            eventSpy.should.be.calledWith('team_join');
        });

        it('responde a mensajes.', () => {
            const messageSpy = sinon.spy(App.prototype, "message");
            new AyudanteVirtual();
            messageSpy.should.be.called();
        });

        it('responde a comandos.', () => {
            const commandSpy = sinon.spy(App.prototype, "command");
            new AyudanteVirtual();
            commandSpy.should.be.called();
        });
    });

    describe('Receptores', () => {
        const loggerStub = {
            info: sinon.stub(),
            error: sinon.stub(),
            debug: sinon.stub(),
            warn: sinon.stub(),
        };

        it('nuevoMienbro envía un mensaje de bienvenida directo al usuario.', () => {
            const postMessage = sinon.stub();
            const idUsuario = 'id de un usuario';
            Receptores.nuevoMiembro({
                app: {
                    client: {chat: {postMessage}},
                    logger: loggerStub
                },
                event: {user: {id: idUsuario}},
                context: {botToken: 'dome token'}
            });
            postMessage.should.be.calledWithMatch({channel: idUsuario});
        });

        it('mensajes responde correctamente un mensaje.', async () => {
            const say = sinon.stub();
            await Receptores.mensajes({
                app: {logger: loggerStub},
                say: say,
                message: {
                    text: 'hola',
                    client_msg_id: '1'
                },
                body: {team_id: 'my team id'},
            });
            say.should.be.calledOnce();
        });

        it('mensajes responde con error si ocurre un error.', async () => {
            const say = sinon.stub();
            say.onFirstCall().rejects();

            await Receptores.mensajes({
                say: say,
                app: {logger: loggerStub},
                message: {
                    text: 'hola',
                    client_msg_id: '2'
                },
                body: {team_id: 'my team id'},
            });
            say.secondCall.should.be.calledWithMatch('error');
        });

        it('setCanalDeConsultas responde con error si no se encuentra una palabra clave.', async () => {
            const text = "dónde se usa la palabra clave?";
            const respondStub = sinon.stub();

            await Receptores.setCanalDeConsultas({
                app: {logger: loggerStub},
                command: {text, trigger_id: 1},
                say: sinon.stub(),
                respond: respondStub,
                ack: sinon.stub()
            });

            respondStub.should.be.calledWithMatch('no estás usando el comando correctamente');
        });

        it('setCanalDeConsultas responde con error si el bot no se encuentra en el canal.', async () => {
            const respondStub = sinon.stub();
            await Receptores.setCanalDeConsultas({
                app: {logger: loggerStub},
                command: {text: 'aquí', trigger_id: 2},
                say: sinon.stub().rejects(),
                respond: respondStub,
                ack: sinon.stub()
            });

            respondStub.should.be.calledWithMatch('no soy miembro de este canal');
        });

        it('setCanalDeConsultas guarda el canal de consultas si se utiliza una palabra clave y el bot es miembro del canal.', async () => {
            const setCanalesDeConsultaStub = sinon.stub(CanalesDeConsulta.prototype, "setCanal");

            await Receptores.setCanalDeConsultas({
                app: {logger: loggerStub},
                command: {text: 'aquí', trigger_id: 3},
                say: sinon.stub().resolves(true),
                respond: sinon.stub(),
                ack: sinon.stub()
            });

            setCanalesDeConsultaStub.should.be.called()
        });
    });

    describe('Logger', () => {
        it('getLevel devuelve el nivel con el que fue inicializado el logger.', () => {
            const logger = new Logger({level: 'error'});
            logger.getLevel().should.equal('error');
        });

        it('setLevel cambia el nivel del logger.', () => {
            const logger = new Logger();
            logger.setLevel('error');
            logger.getLevel().should.equal('error');
        });
    });
});
