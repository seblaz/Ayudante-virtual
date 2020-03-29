import fs from 'fs';
import Almacenamiento from "persistencia/Almacenamiento";
import path from 'path';
import CanalesDeConsulta from "persistencia/CanalesDeConsulta";
import Tokens from "persistencia/Tokens";


describe('Persistencia', () => {
    const dir = '.dataTest';

    const deleteFolderRecursive = (path) => {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                const curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    beforeEach(() => deleteFolderRecursive(dir));

    after(() => deleteFolderRecursive(dir));

    describe('Almacenamiento', () => {

        it('crea la carpeta de persistencia si no existe.', () => {
            new Almacenamiento({file: 'test.json', dataDir: dir});
            fs.existsSync(dir).should.be.true();
        });

        it('si la carpeta de persistencia existe, no borra sus contenidos.', () => {
            const file = path.join(dir, 'testFile.txt');
            fs.mkdirSync(dir);
            fs.writeFileSync(file, 'some nice unimportant content');

            new Almacenamiento({file: 'test.json', dataDir: dir});

            fs.existsSync(file).should.be.true();
        });
    });

    describe('Canales de consulta', () => {
        it('si el canal no existe, existeCanal devuelve false.', () => {
            const canales = new CanalesDeConsulta({dataDir: dir});
            canales.existeCanal('mi equipo').should.be.false()
        });

        it('si el canal no existe, getCanal devuelve false.', () => {
            const canales = new CanalesDeConsulta({dataDir: dir});
            canales.getCanal('mi equipo').should.be.false()
        });

        it('si el canal existe, existeCanal devuelve true.', () => {
            const canales = new CanalesDeConsulta({dataDir: dir});
            canales.setCanal('mi equipo', 'mi canal');
            canales.existeCanal('mi equipo').should.be.true()
        });

        it('getCanal devuelve el canal correcto.', () => {
            const canales = new CanalesDeConsulta({dataDir: dir});
            canales.setCanal('mi equipo', 'mi canal');
            canales.getCanal('mi equipo').should.equal('mi canal');
        });
    });

    describe('Tokens', () => {
        it('si el token no existe, getTokens devuelve undefined.', () => {
            const tokens = new Tokens({dataDir: dir});
            tokens.getTokens({teamId: 'mi equipo'}).should.eventually.equal(undefined)
        });

        it('si el token existe, getTokens lo devuelve.', () => {
            const tokens = new Tokens({dataDir: dir});
            tokens.setTokens({
                team: {id: 'mi equipo'},
                access_token: 'access_token',
                bot_user_id: 'bot_user_id',
                bot_id: 'bot_id'
            });

            return tokens.getTokens({teamId: 'mi equipo'}).should.eventually.eql({
                botToken: 'access_token',
                botId: 'bot_id',
                botUserId: 'bot_user_id'
            })
        });
    });
});
