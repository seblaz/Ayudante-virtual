# Ayudante-virtual

Bot de Slack que sirve como ayudante virtual para realizar consultas que no pueden ser compartidas en canales públicos.

### Instalación

Para instalar en el espacio de trabajo dirgirse [acá](https://slack.com/oauth/v2/authorize?client_id=1009494895799.996165417955&scope=im:read,im:write,chat:write,users:read,im:history,commands).

Luego es necesario ejecutar el comando `/set-canal-de-consultas #mi-canal-de-consultas` para que el bot envíe las consultas allí. A su vez el bot **debe** ser miembro de dicho canal.

### Uso

Los alumnos simplemente deben hablar con el bot para enviarles sus consultas. Cuando un nuevo usuario se une al espacio de trabajo el bot lo saluda explicándole como usarlo. A su vez con las palabras clave 'hola', 'ayuda', 'hi', etc. se muestran mensajes de ayuda al alumno.

Finalmente para enviar la consulta se debe anteponer la frase 'Tengo una consulta', y dicha consulta se enviará al canal configurado previamente.