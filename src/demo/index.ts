import { readdirSync, writeFileSync, mkdirSync, mkdir, promises } from 'fs';
import { RecordParser } from '../main';

const allRecords = readdirSync('temp')
  .map(file => ({ file, records: new RecordParser(`temp/${file}`).parse() }));

promises
  .mkdir('dist')
  .catch(reason => console.warn(reason))
  .then(
    () => writeFileSync('dist/all-records.json', JSON.stringify(allRecords))
  );
