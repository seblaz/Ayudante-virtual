import Almacenamiento from "persistencia/Almacenamiento";


export default class Tokens extends Almacenamiento {

    constructor() {
        super('tokens.json');
    }

    setTokens({access_token, bot_user_id, team, bot_id}) {
        console.log('Storing oAuthResult.');

        this.db.set(team.id, {
            botToken: access_token,
            botId: bot_id,
            botUserId: bot_user_id
        }).write()
    }

    getTokens({teamId}) {
        console.log('Getting tokens.');

        return new Promise((resolve) => {
            resolve(this.db.get(teamId).value())
        })
    }
}