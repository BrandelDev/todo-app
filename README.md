# To Do App

Aplicacion movil/web basada en Ionic + Angular para gestionar tareas con categorias, detalle de tarea, y configuracion basica.

## Funcionalidades
- Crear, editar y eliminar tareas.
- Marcar tareas como completadas.
- Filtrar tareas por categoria.
- Gestionar categorias (crear y eliminar).

## Stack
- Ionic + Angular (standalone components)
- Firebase Firestore

## Rutas
- `/home`: lista de tareas
- `/nueva-tarea`: crear tarea
- `/detalle-tarea/:id`: detalle/edicion de tarea
- `/configuracion`: gestionar categorias

## Configuracion
Asegura tu configuracion de Firebase en el proyecto (Firestore) y tus variables de entorno segun tu setup.

## Scripts comunes
- `npm install`
- `ionic serve`

## Notas
- Las categorias se almacenan en la coleccion `categorias`.
- Las tareas se almacenan en la coleccion `tareas`.
