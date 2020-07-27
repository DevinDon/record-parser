import { readFileSync } from 'fs';

export interface Record {
  questioner: string;
  time: Date;
  question: string;
  answers: Answer[];
}

export interface Answer {
  who: string;
  content: string;
  time: Date;
}

export function getDate(time: string, date: string = '2020-07-26') {
  return new Date(date + ' ' + time);
}

const source = readFileSync('source.md').toString();

const texts = source.split('---').map(text => text.trim());

const regWho = /(.+)\s(\d+:\d+)\s.M/;

function parserRecord(text: string) {

  const record: Record = {
    questioner: '',
    question: '',
    time: new Date(),
    answers: []
  };

  const lines = text.split('\n').map(v => v.trim());
  let answer: Answer = { who: '', content: '', time: new Date() };

  let indexOfWho = 0;

  for (const line of lines) {

    // 是用户信息栏
    if (regWho.test(line)) {
      // 获取用户和时间
      const [temp1, who, time] = line.match(regWho) ?? [];
      // 用户序号 + 1，用于区分提问者和回答者
      indexOfWho++;
      // 如果存在回答，那么说明上一条回答已经结束，存入数组
      if (answer.who) {
        record.answers.push(answer);
      }
      // 清空回答
      answer = { who: '', content: '', time: new Date() };
      // 判断是提问者还是回答者
      switch (indexOfWho) {
        case 1:
          record.questioner = who.trim();
          record.time = getDate(time);
          break;
        default:
          answer.who = who.trim();
          answer.time = getDate(time);
          break;
      }
    } else { // 填充问题
      // 判断是提问者还是回答者
      switch (indexOfWho) {
        case 1: // 提问者
          record.question += line + '\n';
          break;
        default: // 回答者
          answer.content += line + '\n';
          break;
      }
    }

  }

  // 清洗数据
  record.question = record.question.trim();
  for (const answer of record.answers) {
    answer.content = answer.content.trim();
  }

  return record;

}

const records = texts.map(parserRecord);

console.log(JSON.stringify(records));

// 10:15 AM
