import { promises as fs } from 'fs';

class LogRemover {
  constructor() {
    console.log('log remover plugin registed');
  }

  apply(compiler: any) {
    compiler.hooks.done.tapAsync('RemoveLogs', async (stats, cb) => {
      try {
        const { path, filename } = stats.compilation.options.output;
        let filePath = path + '/' + filename;

        const data = (await fs.readFile(filePath, 'utf8')) as string;
        const rgx = /,?console.log\(['|"](.*?)['|"]\)/g;
        const newdata = data.replace(rgx, '');

        await fs.writeFile(filePath, newdata);
      } finally {
        console.log('LogRemover finished');
        cb();
      }
    });
  }
}

module.exports = LogRemover;
