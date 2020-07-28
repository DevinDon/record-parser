import { readFileSync, writeFileSync } from 'fs';
import { Record } from '../main';

const archives: { file: string; records: Record[]; }[] = JSON.parse(readFileSync('dist/all-archives.json').toString());

const questions: string[] = [];
const answers: string[] = [];

for (const { file, records } of archives) {
  const question = records.map(record => record.question).join('\n');
  const answer = records.map(
    record => record.answers.map(answer => answer.content).join('\n')
  ).join('\n');
  questions.push(question);
  answers.push(answer);
  writeFileSync(`dist/question/${file}.question.txt`, question);
  writeFileSync(`dist/answer/${file}.answer.txt`, answer);
}

writeFileSync('dist/question/questions.txt', questions.join('\n\n'));
writeFileSync('dist/answer/answers.txt', answers.join('\n\n'));
