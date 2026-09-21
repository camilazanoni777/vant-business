import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recursos } from '../src/data/recursos.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const missing = recursos
  .map((tool) => {
    if (!tool.logo) {
      return `${tool.name}: campo logo ausente`;
    }

    const publicPath = tool.logo.startsWith('/') ? tool.logo.slice(1) : tool.logo;
    const absolutePath = path.join(rootDir, 'public', publicPath);

    if (!existsSync(absolutePath)) {
      return `${tool.name}: arquivo nao encontrado em public/${publicPath}`;
    }

    return null;
  })
  .filter(Boolean);

if (missing.length > 0) {
  console.error('Logos de ferramentas incompletas:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Logos validadas para ${recursos.length} ferramentas.`);
