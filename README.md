# Aurea Talento — Sprint Planning RRHH

Tablero Angular de planificación académica para un sistema de recursos humanos de una firma de auditoría financiera en Guatemala. Reúne las 180 capacidades de los diez archivos de User Story Mapping y cinco precisiones funcionales del MVP.

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

Los sprints 1–6 describen el MVP funcional. El orden comienza por la consulta del propio expediente, sigue con Personas y niveles de acceso y luego con Pago y la edición autorizada de nómina. Reclutamiento, ausencias, documentos, beneficios, capacitación e incorporación completan el alcance funcional del texto facilitado. Los sprints 7–10 ordenan el backlog restante, incluidas evaluaciones, reportes avanzados, hojas de tiempo e integraciones.

Las cinco historias `MVP-01` a `MVP-05` precisan requisitos que el texto nuevo exige y que no estaban descritos de forma suficiente en los mapas originales. El resumen de permisos distingue Empleado, Gerente, RR. HH./contratación, Nómina y Administrador total. Un gerente no recibe acceso automático a datos de pago; el rol Nómina puede consultarlos y editarlos con validación y bitácora.

Este repositorio es solo el tablero público de Sprint Planning. No implementa autenticación, expedientes, servicios de nómina ni una base de datos. La arquitectura del sistema RR. HH. se decidirá y desarrollará por separado; las indicaciones técnicas del texto nuevo no se adoptaron como requisitos.
