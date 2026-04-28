import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pairs = [
  ['server/.env.example', 'server/.env'],
  ['client/.env.example', 'client/.env'],
  ['agent/.env.example', 'agent/.env'],
];

for (const [sourceRelative, targetRelative] of pairs) {
  const source = path.join(root, sourceRelative);
  const target = path.join(root, targetRelative);

  if (!fs.existsSync(source)) continue;
  if (fs.existsSync(target)) continue;

  fs.copyFileSync(source, target);
  console.log(`Created ${targetRelative} from ${sourceRelative}`);
}
