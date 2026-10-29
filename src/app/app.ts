import { Component, OnInit, signal, computed } from '@angular/core';

interface Story { id: string; title: string; description: string; criteria: string[]; delivery: string; epic: number; }
interface Sprint { number: number; title: string; description: string; phase: 'MVP' | 'Después del MVP'; ids?: string[]; epics?: number[]; }

const sprints: Sprint[] = [
  { number: 1, title: 'Cimientos', description: 'Expedientes, perfiles, datos laborales y niveles de acceso.', phase: 'MVP', ids: ['HU-04-02', 'HU-04-03', 'HU-04-05', 'HU-04-12'] },
  { number: 2, title: 'Reclutamiento inicial', description: 'Requisición, publicación y recepción de postulaciones.', phase: 'MVP', ids: ['HU-02-02', 'HU-02-03', 'HU-02-08', 'HU-02-11', 'HU-02-13', 'HU-02-14', 'HU-03-01', 'HU-03-04'] },
  { number: 3, title: 'Ausencias', description: 'Saldos, solicitudes, seguimiento y decisión del responsable.', phase: 'MVP', ids: ['HU-01-02', 'HU-01-04', 'HU-01-07', 'HU-01-11'] },
  { number: 4, title: 'Contratación e ingreso', description: 'Ofertas, verificaciones e incorporación de nuevo personal.', phase: 'Después del MVP', epics: [3, 5] },
  { number: 5, title: 'Portal y organización', description: 'Completar el portal, las vacantes y la estructura organizacional.', phase: 'Después del MVP', epics: [1, 2, 4] },
  { number: 6, title: 'Historial y beneficios', description: 'Cambios laborales y beneficios del personal.', phase: 'Después del MVP', epics: [6] },
  { number: 7, title: 'Documentos y formación', description: 'Archivos, plantillas y seguimiento de capacitación.', phase: 'Después del MVP', epics: [7] },
  { number: 8, title: 'Desempeño', description: 'Objetivos, comentarios y evaluaciones.', phase: 'Después del MVP', epics: [8] },
  { number: 9, title: 'Reportes y satisfacción', description: 'Indicadores, reportes configurables y eNPS.', phase: 'Después del MVP', epics: [9] },
  { number: 10, title: 'Tiempo y nómina', description: 'Hojas de tiempo, periodos y recibos de pago.', phase: 'Después del MVP', epics: [10] },
];

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  readonly sprints = sprints;
  readonly stories = signal<Story[]>([]);
  readonly selectedSprint = signal(1);
  readonly expandedStory = signal<string | null>(null);
  readonly loadingError = signal(false);
  readonly visibleStories = computed(() => this.forSprint(this.selectedSprint()));
  readonly total = computed(() => this.stories().length);

  async ngOnInit(): Promise<void> {
    try {
      const response = await fetch('/stories.json');
      if (!response.ok) throw new Error('No se pudieron cargar las historias');
      this.stories.set(await response.json() as Story[]);
    } catch { this.loadingError.set(true); }
  }

  forSprint(number: number): Story[] {
    const sprint = sprints[number - 1];
    const mvpIds = new Set(sprints.slice(0, 3).flatMap(item => item.ids ?? []));
    return this.stories().filter(story => sprint.ids?.includes(story.id) || (sprint.epics?.includes(story.epic) && !mvpIds.has(story.id)));
  }
  selectSprint(number: number): void { this.selectedSprint.set(number); this.expandedStory.set(null); }
  toggleStory(id: string): void { this.expandedStory.update(current => current === id ? null : id); }
}
