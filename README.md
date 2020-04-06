# Ayudante virtual

[![Build Status](https://travis-ci.com/seblaz/Ayudante-virtual.svg?branch=master)](https://travis-ci.com/seblaz/Ayudante-virtual) &nbsp; [![Coverage Status](https://coveralls.io/repos/github/seblaz/Ayudante-virtual/badge.svg?branch=master&service=github)](https://coveralls.io/github/seblaz/Ayudante-virtual?branch=master&service=github)

Bot de Slack que sirve como ayudante virtual para realizar consultas que no pueden ser compartidas en canales públicos. Los alumnos realizan las consultas al bot y este las publica en un canal (posiblemente privado), donde estén solo los ayudantes. Ejemplo de consulta:

**Consulta del alumno (mensaje directo del alumno al ayudante virtual):**

<p align="center">
    <img alt="Tengo una consulta" src="images/tengo-una-consulta.png"/>
</p>

**Aviso a los ayudantes en otro canal (posiblemente privado):**

<p align="center">
    <img alt="Consulta reenviada a los ayudantes" src="images/tengo-una-consulta-ayudantes.png"/>
</p>

Esto permite que las consultas de los alumnos que no puedan compartirse públicamente con toda la clase queden centralizadas en un único canal, para que luego los ayudantes puedan organizarse y responder a los alumnos por mensaje directo.

De esta manera los ayudantes pueden responder más rápidamente dichas consultas, dado que cualquiera que este disponible pueda verlas y tomarlas. A su vez si hay muchas consultas para responder, al estar todas en el mismo lugar los ayudantes pueden organizarse para balancear el tiempo utilizado en dicha tarea.

### Bienvenida

El Ayudante Virtual también envía un mensaje de bienvenida a los nuevos miembros para que sepan cómo utilizarlo:

<p align="center">
    <img alt="Bienvenida" src="images/bienvenida-compacta.png"/>
</p>

### Instalación

Para instalar en el espacio de trabajo ir a: 

<p align="center">
<a href="https://slack.com/oauth/v2/authorize?client_id=1009494895799.996165417955&scope=chat:write,commands,im:history,im:read,im:write,users:read"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>
</p>

**Configurar canales públicos**
Luego es necesario **ejecutar el comando** `/set-canal-de-consultas #mi-canal-de-consultas` para que el bot envíe las consultas a `#mi-canal-de-consultas`. A su vez el bot **debe** ser miembro de dicho canal.
 
**Configurar canales privados**

Si se desea recibir las consultas en un canal privado, se **debe** agregar al bot al mismo y luego  **ejecutar el comando** `/set-canal-de-consultas aquí` en el canal donde se deseen recibir las consultas.

**Advertencia**

Durante la instalación es posible que observes un mensaje de Slack diciendo que **"Slack no revisó o aprobó esta aplicación"**. Esto es así porque por el momento no se envío la app para revisión por Slack dado que para ello se necesita un dominio, un sitio web, ofrecer la posibilidad de dar soporte fuera de GitHub y otros detalles. Sin embargo este bot es de código abierto y se ofrece la posibilidad de ver y mejorar el mismo a través de pull requests.

### Uso

Los alumnos simplemente deben hablar con el bot para enviarles sus consultas. Cuando un nuevo usuario se une al espacio de trabajo el bot lo saluda explicándole como usarlo. A su vez con las palabras clave 'hola', 'ayuda', 'hi', etc. se muestran mensajes de ayuda al alumno.

<p align="center">
    <img alt="Ayuda" src="images/ayuda.png"/>
</p>

Finalmente para enviar la consulta se debe anteponer la frase 'Tengo una consulta', y dicha consulta se enviará al canal configurado previamente. 

<p align="center">
    <img alt="Consulta con adjuntos" src="images/tengo-una-consulta-adjuntos.png"/>
</p>

La cual se notifica a los ayudantes en el canal configurado:

<p align="center">
    <img alt="Consulta con adjuntos reenviada a los ayudantes" src="images/tengo-una-consulta-adjuntos-ayudantes.png"/>
</p>

Cómo se ve previamente los alumnos pueden incluir links, texto en formato de código y adjuntos.

Por otro lado, si el alumno envía algo no entendido por el Ayudante Virtual, se envía una respuesta notificándolo:

<p align="center">
    <img alt="Mensaje no entendido" src="images/no-entendido.png"/>
</p>

### Reporte de problemas

Por favor reportar cualquier problema encontrado en la sección de [problemas](https://github.com/seblaz/Ayudante-virtual/issues).

### Privacidad

El Ayudante Virtual no guarda ni envía ningún tipo de información sobre los mensajes o miembros de los espacios de trabajo fuera de Slack. Lo único que es necesario guardar son los ids de los canales configurados para recibir las consultas. Dicha información no es divulgada con ninguna entidad.

### Contribuir

Se acepta la colaboración a través de reportes en la [sección de problemas](https://github.com/seblaz/Ayudante-virtual/issues) o pull requests. En caso de querer desarrollar, luego de clonar el repositorio los comandos disponibles son los siguientes (Node.js requerido):

 - **`npm install`**
 
    Instala las dependencias del projecto.
    
 - **`npm run build`**
 
    Compila el projecto en `dist`.
  
 - **`npm start`**
 
    Compila e inicia el projecto.
  
 - **`npm run dev`**
 
    Inicia el proyecto en modo desarrollo, recompilando cada vez que ocurra un cambio.

 - **`npm test`**

    Ejecuta los tests.

 - **`npm run test:watch`**

    Ejecuta los tests y los vuelve a ejecutar al detectar cambios.

 - **`npm run coverage`**

    Luego de ejecutar los tests, se envía el resultado a [coveralls](https://coveralls.io). Es necesario que esté configurada la variable de ambiente `COVERALLS_REPO_TOKEN`.

### Licencia

El Ayudante Virtual adhiere a la licencia [MIT](LICENSE.txt).