import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
import path from 'path';


export default class Almacenamiento {

    constructor({file, dataDir}) {
        !fs.existsSync(dataDir) && fs.mkdirSync(dataDir);
        const adapter = new FileSync(path.join(dataDir, file));
        this.db = low(adapter);
    }
}