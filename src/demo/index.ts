import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { RecordParser } from '../main';

const allArchives = readdirSync('temp')
  .filter(file => file.slice(-2) === 'md')
  .map(file => ({ file: file.slice(0, -3), records: new RecordParser(`temp/${file}`).parse() }));

if (!existsSync('dist')) {
  mkdirSync('dist');
}

writeFileSync('dist/all-archives.json', JSON.stringify(allArchives));

allArchives
  .forEach(
    record => writeFileSync(`dist/${record.file}.json`, JSON.stringify(record.records))
  );
