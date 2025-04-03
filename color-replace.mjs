import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const replacements = [
  ['text-green-', 'text-primary-'],
  ['bg-green-', 'bg-primary-'],
  ['border-green-', 'border-primary-'],
  ['ring-green-', 'ring-primary-'],
  ['hover:bg-green-', 'hover:bg-primary-'],
  ['hover:text-green-', 'hover:text-primary-'],
  ['text-gray-', 'text-secondary-'],
  ['bg-gray-', 'bg-secondary-'],
  ['border-gray-', 'border-secondary-'],
  ['ring-gray-', 'ring-secondary-'],
  ['hover:bg-gray-', 'hover:bg-secondary-'],
  ['hover:text-gray-', 'hover:text-secondary-']
];

async function* getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* getFiles(path);
    } else if (entry.name.endsWith('.tsx')) {
      yield path;
    }
  }
}

async function replaceInFile(filePath) {
  let content = await readFile(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replace(new RegExp(from, 'g'), to);
  }
  await writeFile(filePath, content);
}

async function main() {
  try {
    for await (const file of getFiles('src')) {
      await replaceInFile(file);
      console.log(`Updated ${file}`);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();