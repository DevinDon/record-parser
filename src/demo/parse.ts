import { readFileSync } from 'fs';

const source1 = readFileSync('temp/source-1.txt').toString();

class WordsSpliter {

  static STOP_WORDS = ['和', '与', '你', '我', '两', '这', '把', '那', '个', '他', '您', '它', '们', '是', '的', '一', '了', '在']

  private trie: { [index: string]: number } = {};

  private temp: any = {};

  // private source: string;

  constructor(private source: string) { }

  clean(source: string = this.source) {
    return source
      .replace(/[^\u4e00-\u9fa5]/g, ' ');
  }

  split(cleaned: string) {

    const shorts = cleaned.split(' ');

    for (const words of shorts) {

      // 筛选单词长度
      switch (words.length) {
        case 1:
          continue;
        case 2:
          // 处理
          break;
        default:
          for (let i = 0; i < words.length - 2; i++) {
            // 处理 words.substr(j, 4)
          }
      }

    }
    // for end

  }

  toTrie(words: string) {
    const letters = words.split('');
    // 词语首个字符是停止词，无效
    if (WordsSpliter.STOP_WORDS.includes(letters[0])) {
      return false;
    }
    // 处理
    this.trie[]
  }

}
