import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { RecordParser } from '../main';

const allRecords = readdirSync('temp')
  .map(file => ({ file, records: new RecordParser(`temp/${file}`).parse() }));

if (!existsSync('dist')) {
  mkdirSync('dist');
}

writeFileSync('dist/all-records.json', JSON.stringify(allRecords));

allRecords.forEach(
  record => writeFileSync(`dist/${record.file}.json`, JSON.stringify(record.records))
);
