import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { RecordParser } from '../main';

const allArchives = readdirSync('temp')
  .map(file => ({ file, records: new RecordParser(`temp/${file}`).parse() }));

if (!existsSync('dist')) {
  mkdirSync('dist');
}

writeFileSync('dist/all-archives.json', JSON.stringify(allArchives));

allArchives
  .forEach(
    record => writeFileSync(`dist/${record.file.slice(0, -3)}.json`, JSON.stringify(record.records))
  );
