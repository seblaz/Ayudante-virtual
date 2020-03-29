import sinon from "sinon";
import AuthReceiver from "app/AuthReceiver";
import request from 'supertest';
import * as WebApi from "@slack/web-api";
import AuthConfig from "app/AuthConfig";
import Tokens from "persistencia/Tokens";
import AppReceiver from "app/AppReceiver";
import AyudanteVirtual from "app/AyudanteVirtual";
import {App} from "@slack/bolt";


describe('App', () => {
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
            setTokensStub = sinon.stub(Tokens.prototype, "setTokens")
        });

        it('onSuccess guarda los tokens.', () => {
            new AuthConfig().onSuccess({res: {redirect: sinon.stub()}});
            setTokensStub.should.be.calledOnce();
        });

        it('onSuccess redirecciona a una página de confirmación.', () => {
            const redirect = sinon.stub();
            new AuthConfig().onSuccess({res: {redirect}});
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
});
