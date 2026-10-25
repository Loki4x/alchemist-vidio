// Pins every remotion package in package.json to the newest published version,
// so all of them match exactly (Remotion requires identical versions).
import {execSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';

const version = process.argv[2] || execSync('npm view remotion version', {encoding: 'utf8'}).trim();
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const name of Object.keys(pkg.dependencies)) {
  if (name === 'remotion' || name.startsWith('@remotion/')) pkg.dependencies[name] = version;
}
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log(`Remotion pinned to ${version}`);
