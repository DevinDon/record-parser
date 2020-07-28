import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { Record } from '../main';

interface Archive {
  file: string;
  records: Record[];
}

existsSync('dist/output') || mkdirSync('dist/output');

const allArchives: Archive[] = JSON.parse(readFileSync('dist/all-archives.json').toString());

for (const { file, records } of allArchives) {
  const output = records.map(
    record => {
      let result = `提问用户: ${record.user}\n提问时间：${record.time}\n提问内容：${record.question}\n`;

      if (record.answers.length) {
        result = result
          + '回答记录：\n\n'
          + record.answers
            .map(answer => `- 答疑助教：${answer.user}\n  答疑时间：${answer.time}\n  答疑内容：${answer.content}\n`)
            .join('\n');
      }

      result += '\n---\n';
      return result;
    }
  );
  writeFileSync(`dist/output/${file}.md`, output.join('\n'));
}
