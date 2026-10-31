import { Component, OnInit, computed, signal } from '@angular/core';

interface Story { id: string; title: string; description: string; criteria: string[]; delivery: string; epic: number; }
interface Sprint { number: number; title: string; description: string; phase: 'MVP' | 'Después del MVP'; allocation: string; ids?: string[]; epics?: number[]; }
interface AccessSummary { role: string; scope: string; limit: string; }
interface PlanDay { date: string; focus: string; outcome: string; sprints: string; milestone?: boolean; }

// El tablero describe alcance funcional. No contiene datos de empleados ni lógica de nómina.
const addedMvpStories: Story[] = [
  { id: 'MVP-01', title: 'Abrir mi expediente desde Mi información', description: 'Cada empleado inicia por su propio perfil y consulta sus secciones con el mismo diseño que usa Personas.', criteria: ['Mi información identifica al usuario autenticado y abre exclusivamente su expediente.', 'El perfil compartido presenta cabecera, contacto, puesto, datos personales, ausencias, beneficios, pago, documentos y capacitación según los permisos.', 'Cambiar la dirección de la página no permite consultar el expediente de otra persona.'], delivery: 'MVP · prioridad inicial', epic: 0 },
  { id: 'MVP-02', title: 'Mostrar las ventanas según el nivel de acceso', description: 'La navegación y las acciones disponibles corresponden al rol y a la relación con cada empleado.', criteria: ['Empleado: consulta su expediente, sus recibos y sus solicitudes.', 'Gerente: consulta Personas y perfiles del equipo, junto con las vistas operativas autorizadas; no obtiene datos salariales por ser gerente.', 'RR. HH.: administra expedientes y el reclutamiento; responsable de contratación: consulta las vacantes y candidaturas asignadas.', 'Nómina: consulta y edita información de pago; solo administrador total gestiona niveles de acceso.', 'Los permisos también se comprueban al abrir directamente una página o solicitar datos.'], delivery: 'MVP · prioridad inicial', epic: 0 },
  { id: 'MVP-03', title: 'Consultar la cuenta y administrar niveles de acceso', description: 'Configuración muestra la información general y permite asignar niveles a los empleados.', criteria: ['El administrador total consulta la cuenta, filtra empleados por nivel y cambia asignaciones.', 'Cada cambio conserva responsable, nivel anterior, nivel nuevo y fecha.', 'La configuración impide dejar la cuenta sin un administrador total.', 'Las secciones no incluidas en el MVP se identifican como pendientes, sin simular funcionalidad.'], delivery: 'MVP', epic: 0 },
  { id: 'MVP-04', title: 'Editar información de nómina de forma autorizada', description: 'El personal de Nómina mantiene los datos de pago y corrige boletas mediante un flujo controlado.', criteria: ['El rol Nómina puede consultar y editar compensación, conceptos de ingresos, deducciones, periodo y acreditamiento autorizados.', 'Antes de publicar una boleta, se verifican el periodo y la igualdad entre devengado, descuentos y líquido.', 'Cada corrección registra quién cambió qué, cuándo, motivo y versión anterior; una boleta publicada no se sobrescribe silenciosamente.', 'El empleado consulta solo sus boletas publicadas y solicita correcciones; no modifica importes directamente.', 'Las cifras se presentan en quetzales y los conceptos se adaptan a Guatemala; las tasas legales quedan parametrizadas y sujetas a validación.'], delivery: 'MVP · requisito expreso', epic: 0 },
  { id: 'MVP-05', title: 'Solicitar cambios de acreditamiento bancario', description: 'El empleado propone una actualización y Nómina la revisa antes de que entre en vigor.', criteria: ['El empleado ve sus cuentas enmascaradas y solicita el cambio desde Pago.', 'La solicitud conserva los datos anteriores, los propuestos, el estado y la decisión.', 'Solo Nómina aplica el cambio aprobado; nunca se muestra el número completo a usuarios sin permiso.'], delivery: 'MVP · requisito expreso', epic: 0 },
];

const sprints: Sprint[] = [
  { number: 1, title: 'Mi información y acceso', description: 'El empleado entra y consulta su expediente; permisos y edición básica del perfil.', phase: 'MVP', allocation: '2 nov · validar acceso y perfil', ids: ['MVP-01', 'MVP-02', 'HU-04-02', 'HU-04-04', 'HU-04-07', 'HU-04-13', 'HU-04-17', 'HU-06-01', 'HU-06-02'] },
  { number: 2, title: 'Personas y configuración', description: 'Lista de empleados, alta, perfil laboral, vistas de gerencia y niveles de acceso.', phase: 'MVP', allocation: '2 nov · probar roles y altas', ids: ['MVP-03', 'HU-04-01', 'HU-04-03', 'HU-04-05', 'HU-04-12', 'HU-06-03', 'HU-06-04', 'HU-06-05', 'HU-06-07', 'HU-06-09'] },
  { number: 3, title: 'Pago y nómina', description: 'Consulta de boletas propias y edición controlada de datos de nómina.', phase: 'MVP', allocation: '3 nov · pagos y permisos', ids: ['MVP-04', 'MVP-05', 'HU-06-06', 'HU-10-12', 'HU-10-13', 'HU-10-14', 'HU-10-15', 'HU-10-16', 'HU-10-17', 'HU-10-19'] },
  { number: 4, title: 'Reclutamiento', description: 'Vacantes, formulario, página pública, postulaciones y seguimiento inicial.', phase: 'MVP', allocation: '4–5 y 16 nov · flujo y pruebas', ids: ['HU-02-01', 'HU-02-02', 'HU-02-03', 'HU-02-04', 'HU-02-05', 'HU-02-07', 'HU-02-08', 'HU-02-09', 'HU-02-11', 'HU-02-12', 'HU-02-13', 'HU-02-14', 'HU-02-15', 'HU-03-01', 'HU-03-02', 'HU-03-04'] },
  { number: 5, title: 'Ausencias e inicio', description: 'Saldos, vacaciones, suspensiones, solicitudes, aprobaciones y panel personal.', phase: 'MVP', allocation: '5 y 17 nov · solicitudes', ids: ['HU-01-01', 'HU-01-02', 'HU-01-03', 'HU-01-04', 'HU-01-05', 'HU-01-06', 'HU-01-07', 'HU-01-08', 'HU-01-11', 'HU-01-16'] },
  { number: 6, title: 'Expediente integral', description: 'Documentos, beneficios, capacitación y avance de incorporación.', phase: 'MVP', allocation: '6 y 18 nov · vistas y datos', ids: ['HU-05-01', 'HU-05-04', 'HU-05-05', 'HU-05-09', 'HU-05-10', 'HU-05-11', 'HU-06-10', 'HU-06-11', 'HU-06-12', 'HU-06-14', 'HU-07-01', 'HU-07-02', 'HU-07-03', 'HU-07-04', 'HU-07-06', 'HU-07-07', 'HU-07-09', 'HU-07-11', 'HU-07-12', 'HU-07-13', 'HU-07-14', 'HU-07-17'] },
  { number: 7, title: 'Selección avanzada', description: 'Entrevistas, verificaciones, independencia, ofertas y banco de talento.', phase: 'Después del MVP', allocation: '19 nov · revisar backlog', epics: [2, 3] },
  { number: 8, title: 'Operación de personal', description: 'Políticas, estructura, incorporaciones y expedientes con más profundidad.', phase: 'Después del MVP', allocation: '19 nov · revisar backlog', epics: [1, 4, 5, 6, 7] },
  { number: 9, title: 'Desempeño y reportes', description: 'Objetivos, evaluaciones, indicadores y satisfacción del personal.', phase: 'Después del MVP', allocation: '19 nov · revisar backlog', epics: [8, 9] },
  { number: 10, title: 'Tiempo e integraciones', description: 'Hojas de tiempo, calendario y automatizaciones de nómina.', phase: 'Después del MVP', allocation: '19 nov · revisar backlog', epics: [10] },
];

const dailyPlan: PlanDay[] = [
  { date: 'Lun 2 nov', focus: 'Acceso y Personas', outcome: 'Revisar perfiles, permisos, altas y pruebas por rol.', sprints: '1–2' },
  { date: 'Mar 3 nov', focus: 'Pago y nómina', outcome: 'Cerrar consulta de boletas, edición autorizada y pruebas de privacidad.', sprints: '3' },
  { date: 'Mié 4 nov', focus: 'Reclutamiento', outcome: 'Vacantes y formulario público con datos de prueba.', sprints: '4' },
  { date: 'Jue 5 nov', focus: 'Postulaciones y ausencias', outcome: 'Probar postulación y crear el recorrido básico de solicitud.', sprints: '4–5' },
  { date: 'Vie 6 nov', focus: 'Demostración de avance', outcome: 'Presentar la mayoría de experiencias de usuario probadas y enumerar historias implementadas; mostrar primeras vistas del expediente integral.', sprints: '1–6', milestone: true },
  { date: '9–13 nov', focus: 'Exámenes finales', outcome: 'Sin trabajo del proyecto ni tareas comprometidas.', sprints: 'Pausa' },
  { date: 'Lun 16 nov', focus: 'Reclutamiento', outcome: 'Corregir el flujo y cerrar pruebas de vacantes y candidaturas.', sprints: '4' },
  { date: 'Mar 17 nov', focus: 'Ausencias', outcome: 'Completar aprobaciones, saldos y estados con pruebas por rol.', sprints: '5' },
  { date: 'Mié 18 nov', focus: 'Expediente integral', outcome: 'Integrar documentos, beneficios, capacitación e incorporación priorizados.', sprints: '6' },
  { date: 'Jue 19 nov', focus: 'Pruebas y alcance final', outcome: 'Probar recorridos completos, corregir fallos críticos y dejar los sprints 7–10 como backlog documentado.', sprints: '1–10' },
  { date: 'Vie 20 nov', focus: 'Entrega final', outcome: 'Congelar versión, validar demostración y entregar evidencia de historias terminadas y pendientes.', sprints: 'MVP', milestone: true },
];

const accessSummary: AccessSummary[] = [
  { role: 'Empleado', scope: 'Mi información, ausencias, documentos, beneficios, capacitación y pago propios.', limit: 'Puede pedir cambios; no edita importes de nómina.' },
  { role: 'Gerente', scope: 'Personas y perfiles del equipo, solicitudes y vistas operativas autorizadas.', limit: 'El cargo no habilita salario, cuentas ni boletas ajenas.' },
  { role: 'RR. HH. / contratación', scope: 'Expedientes, vacantes, candidatos e incorporación según asignación.', limit: 'RR. HH. no recibe acceso salarial por defecto.' },
  { role: 'Nómina', scope: 'Listado de pago, compensación, boletas y acreditamiento del personal.', limit: 'Edita con validación, versiones y bitácora.' },
  { role: 'Administrador total', scope: 'Cuenta y niveles de acceso.', limit: 'No recibe datos de pago sin permiso de Nómina.' },
];

@Component({ selector: 'app-root', imports: [], templateUrl: './app.html', styleUrl: './app.css' })
export class App implements OnInit {
  readonly sprints = sprints;
  readonly accessSummary = accessSummary;
  readonly dailyPlan = dailyPlan;
  readonly stories = signal<Story[]>([]);
  readonly selectedSprint = signal(1);
  readonly expandedStory = signal<string | null>(null);
  readonly loadingError = signal(false);
  readonly visibleStories = computed(() => this.forSprint(this.selectedSprint()));
  readonly total = computed(() => this.stories().length);
  readonly mvpTotal = computed(() => sprints.filter(sprint => sprint.phase === 'MVP').reduce((sum, sprint) => sum + this.forSprint(sprint.number).length, 0));

  async ngOnInit(): Promise<void> {
    try {
      const response = await fetch('/stories.json');
      if (!response.ok) throw new Error('No se pudieron cargar las historias');
      this.stories.set([...addedMvpStories, ...(await response.json() as Story[])]);
    } catch { this.loadingError.set(true); }
  }

  forSprint(number: number): Story[] {
    const sprint = sprints[number - 1];
    if (!sprint) return [];
    const mvpIds = new Set(sprints.filter(item => item.phase === 'MVP').flatMap(item => item.ids ?? []));
    if (sprint.ids) return sprint.ids.flatMap(id => { const story = this.stories().find(item => item.id === id); return story ? [story] : []; });
    return this.stories().filter(story => sprint.epics?.includes(story.epic) && !mvpIds.has(story.id));
  }

  selectSprint(number: number): void { this.selectedSprint.set(number); this.expandedStory.set(null); }
  toggleStory(id: string): void { this.expandedStory.update(current => current === id ? null : id); }
}
