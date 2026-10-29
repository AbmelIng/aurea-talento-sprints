import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Uso: node tools/build-stories.mjs <carpeta-de-mappings>');
const files = ['UserStoryMapping.md', ...Array.from({ length: 9 }, (_, i) => `UserStoryMappingEp${i + 2}.md`)];
const stories = [];
for (const file of files) {
  const contents = readFileSync(join(source, file), 'utf8');
  const pattern = /^#### (HU-\d{2}-\d{2})\. (.+)\r?\n([\s\S]*?)(?=^#### HU-|$(?![\s\S]))/gm;
  for (const match of contents.matchAll(pattern)) {
    const [, id, title, body] = match;
    const block = body.match(/\*\*Criterios de aceptación(?: propuestos)?:\*\*\s*([\s\S]*?)(?=\*\*Entrega(?: propuesta)?:|$)/)?.[1] ?? '';
    const criteria = block.split(/\r?\n/).filter(line => line.startsWith('- ')).map(line => line.slice(2).trim());
    const delivery = body.match(/\*\*Entrega(?: propuesta)?:\*\*\s*([^\r\n]+)/)?.[1]?.trim() ?? '';
    stories.push({ id, title: title.trim(), description: criteria[0] ?? title.trim(), criteria, delivery, epic: Number(id.slice(3, 5)) });
  }
}
if (stories.length < 150 || new Set(stories.map(s => s.id)).size !== stories.length) throw new Error(`Extracción incompleta: ${stories.length}`);
writeFileSync(join('public', 'stories.json'), JSON.stringify(stories, null, 2) + '\n', 'utf8');
console.log(`Generadas ${stories.length} capacidades de ${files.length} archivos.`);
