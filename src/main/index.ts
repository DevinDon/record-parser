import { readFileSync } from 'fs';

export interface Record {
  user: string;
  time: Date;
  question: string;
  answers: Answer[];
}

export interface Answer {
  user: string;
  content: string;
  time: Date;
}

export class RecordParser {

  static REG_USER = /(.+)\s(\d+:\d+)\s.M/;

  private readonly date: string;
  private readonly source: string;
  private readonly sections: string[];

  constructor(path: string) {
    this.date = (path.match(/(\d{4}-\d{2}-\d{2})/) ?? { 1: '2020-08-01' })[1];
    this.source = readFileSync(path).toString();
    this.sections = this.source.split('---').map(section => section.trim());
  }

  getDate(time: string, date: string = this.date) {
    return new Date(date + ' ' + time);
  }

  parse() {

    /** 所有回答记录 */
    const records: Record[] = [];

    // 遍历所有问题块
    for (const section of this.sections) {


      /** 用户，1 为提问者，其余为回答者 */
      let indexOfUser = 0;

      /** 记录，缓存 */
      const record: Record = {
        user: '',
        question: '',
        time: new Date(),
        answers: []
      };

      /** 回答，缓存 */
      let answer: Answer = { user: '', content: '', time: new Date() };

      /** 分割为行 */
      const lines = section.split('\n').map(line => line.trim());

      for (const line of lines) {

        // 是用户信息行
        if (RecordParser.REG_USER.test(line)) {
          // 获取用户和时间
          const [_, user, time] = line.match(RecordParser.REG_USER)?.map(text => text.trim()) ?? [];
          // 用户标记 + 1
          indexOfUser++;

          // 如果回答存在，说明此回答已经结束，可以存入数组
          if (answer.user) {
            record.answers.push(answer);
          }
          // 清空缓存
          answer = { user: '', content: '', time: new Date() };

          switch (indexOfUser) {
            case 1:
              record.user = user;
              record.time = this.getDate(time);
              break;
            default:
              answer.user = (/你/.test(user) && '小郁') || (/.*小郁.*/.test(user) && '小郁') || (/.*小天.*/.test(user) && '小天') || user;
              answer.time = this.getDate(time);
              break;
          }

        } else { // 填充内容

          // 判断是提问者还是回答者
          switch (indexOfUser) {
            case 1: // 提问者
              record.question += line + '\n';
              break;
            default: // 回答者
              answer.content += line + '\n';
              break;
          }

        }

      }

      // 本块问答结束
      record.answers.push(answer);
      // 清空缓存
      answer = { user: '', content: '', time: new Date() };

      // 清洗数据
      record.question = record.question.trim();
      for (const answer of record.answers) {
        answer.content = answer.content.trim();
      }

      // 存入记录数据
      records.push(record);

    }

    return records;

  }

}
