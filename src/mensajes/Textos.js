/* istanbul ignore next */
export default class Textos {

    static saludar(usuario) {
        return `Hola <@${usuario}>! Acá podés enviar *consultas particulares* ` +
            "que no puedas compartir en canales con otros alumnos. " +
            "Simplemente enviame la consulta, empezando con \"*Tengo " +
            "una consulta*\", y uno de los ayudantes se contactará con " +
            "vos en cuanto le sea posible."
    }

    static confirmarConsulta() {
        return "Gracias por enviar tu consulta, en breve un ayudante " +
            "te contactará para resolverla. Saludos!"
    }

    static transmitirConsulta(usuario, consulta) {
        return `<@${usuario}> tiene una consulta:\n${consulta}`
    }

    static noEntendido() {
        return "Lo siento, no entendí lo que querés hacer. Escribí " +
            "\"*ayuda*\" para ver que puedo hacer por vos."
    }

    static canalDeConsultasNoConfigurado() {
        return "Lo siento, los ayudantes aún no me configuraron " +
            "correctamente. Por favor *enviá tu consulta nuevamete* " +
            "más tarde."
    }

    static setCanalDeConsultasIncorrecto() {
        return "Lo siento, parece que no estás usando el comando " +
            "correctamente. Por favor simplemente escribí 'aquí' " +
            "luego del comando. Recordá que el ayudante virtual debe " +
            "ser miembro de este canal." +
            "Ej: /set-canal-de-consultas aquí."
    }

    static setCanalDeConsultasCorrecto() {
        return `Gracias por configurar el ayudante virtual! Las consultas se recibirán aquí.`
    }

    static confirmacionEnCanal(usuario) {
        return `<@${usuario}> configuró este canal para recibir las consultas a través del ayudante virtual.`
    }

    static elBotNoSeEncuentraEnElCanal() {
        return "*Error*: no soy miembro de este canal. " +
            `Debo ser miembro del ` +
            "canal al que se deseen enviar las consultas. Por favor, " +
            `agregarme y luego configurame devuelta.`
    }

    static error() {
        return "Lo siento, ocurrió un error inesperado. Por favor " +
            "*enviá tu consulta nuevamete* más tarde."
    }

}
