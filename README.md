# Aurea Talento — Sprint Planning RRHH

Tablero Angular de planificación académica para un sistema de recursos humanos de una firma de auditoría financiera en Guatemala. Reúne las 180 capacidades de los diez archivos de User Story Mapping; las 16 capacidades acordadas para el MVP están en los sprints 1–3.

## Desarrollo local

```bash
npm install
npm start
```

El contenido publicado está en `public/stories.json`. Para regenerarlo desde los mapas originales:

```bash
node tools/build-stories.mjs "C:\Users\isaga\Downloads\Épicas y UserStoryMapping\Épicas y UserStoryMapping"
```

El generador conserva los identificadores, títulos, criterios y prioridad de los mapas. Si los archivos cambian, vuelve a ejecutarlo y confirma el nuevo JSON en Git.

## Vercel

Importa este directorio como proyecto de Vercel. El archivo `vercel.json` ya define la compilación y el directorio de salida. No se necesita backend para este tablero. La página es pública y solo contiene planificación, no expedientes de personas.

## Alcance

Los sprints 1–3 constituyen el MVP acordado: empleados, reclutamiento inicial y ausencias. Los sprints 4–10 ordenan el resto del backlog para fases posteriores. Esta asignación es una propuesta para el Sprint Planning; los criterios de aceptación siguen sujetos a validación y estimación del equipo.
