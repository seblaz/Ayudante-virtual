import Almacenamiento from "persistencia/Almacenamiento";


export default class Tokens extends Almacenamiento {

    constructor({file = 'tokens.json', dataDir = '.data'} = {}) {
        super({file, dataDir});
    }

    setTokens({access_token, bot_user_id, team, bot_id}) {
        this.db.set(team.id, {
            botToken: access_token,
            botId: bot_id,
            botUserId: bot_user_id
        }).write()
    }

    getTokens({teamId}) {
        return new Promise((resolve) => {
            resolve(this.db.get(teamId).value())
        })
    }
}