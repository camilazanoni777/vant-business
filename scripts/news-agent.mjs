import { collectNewsPayload, defaultNewsOutputPath, saveStaticNewsPayload } from '../api/_newsCollector.js';

async function main() {
  const payload = await collectNewsPayload({ outputPath: defaultNewsOutputPath });
  await saveStaticNewsPayload(payload, defaultNewsOutputPath);

  console.log('News agent saved ' + payload.items.length + ' items to ' + defaultNewsOutputPath);
  if (payload.failedSources.length) {
    console.log('Failed sources: ' + payload.failedSources.map((item) => item.source).join(', '));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
