# Ayudante-virtual

Bot de Slack que sirve como ayudante virtual para realizar consultas que no pueden ser compartidas en canales públicos. Los alumnos realizan las consultas al bot y este las publica en un canal (posiblemente privado), donde estén solo los ayudantes.

### Instalación

Para instalar en el espacio de trabajo ir a: 

<p align="center">
<a href="https://slack.com/oauth/v2/authorize?client_id=1009494895799.996165417955&scope=chat:write,commands,im:history,im:read,im:write,users:read"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>
</p>

Luego es necesario **ejecutar el comando** `/set-canal-de-consultas #mi-canal-de-consultas` para que el bot envíe las consultas a `#mi-canal-de-consultas`. A su vez el bot **debe** ser miembro de dicho canal.

### Uso

Los alumnos simplemente deben hablar con el bot para enviarles sus consultas. Cuando un nuevo usuario se une al espacio de trabajo el bot lo saluda explicándole como usarlo. A su vez con las palabras clave 'hola', 'ayuda', 'hi', etc. se muestran mensajes de ayuda al alumno.

Finalmente para enviar la consulta se debe anteponer la frase 'Tengo una consulta', y dicha consulta se enviará al canal configurado previamente. 

**Nota**: el alumno también puede incluir links o archivos adjuntos.

### Reporte de problemas

Por favor reportar cualquier problema encontrado en la sección de [problemas](https://github.com/seblaz/Ayudante-virtual/issues).

### Privacidad

El ayudante virtual no guarda ni envía ningún tipo de información sobre los mensajes o miembros de los espacios de trabajo fuera de Slack. Lo único que es necesario guardar son los ids de los canales configurados para recibir las consultas. Dicha información no es divulgada con ninguna entidad.

### Contribuir

Se acepta la colaboración a través de reportes en la [sección de problemas](https://github.com/seblaz/Ayudante-virtual/issues) o pull requests. En caso de querer desarrollar, luego de clonar el repositorio los comandos disponibles son los siguientes (Node.js requerido):

 - #### `npm install`
    Instala las dependencias del projecto.
    
 - #### `npm run build`
    Compila el projecto en `dist`.
  
 - #### `npm start`
    Compila e inicia el projecto.
  
 - #### `npm run dev`
    Inicia el proyecto en modo desarrollo, recompilando cada vez que ocurra un cambio.

 - #### `npm test`
    Ejecuta los tests.

 - #### `npm test:watch`
    Ejecuta los tests y los vuelve a ejecutar al detectar cambios.

### Licencia

El ayudante virtual adhiere a la licencia [MIT](LICENSE.txt).