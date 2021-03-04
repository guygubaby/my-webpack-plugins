interface StyleItem {
  path: string;
  sync: boolean;
}

type Options = Array<StyleItem>;

/**
 *
 * steps
 *
 * 1. tap done hook
 * 2. use [htmlparser2] parse html
 * 3. insert extra style into header
 *    - sync
 *    - async [defer]
 * 4. compress html
 */

class InjectStyle {
  options: Options;

  constructor(options: Options) {
    this.options = options;
    console.log('inject style registed ~');
  }

  apply(compiler) {
    console.log('inject style options ', this.options);
    compiler.hooks.done.tap('InjectStylePlugin', (stats) => {
      const { path, filename } = stats.compilation.options.output;
      console.log('filename: ', filename);
    });
  }
}

module.exports = InjectStyle;
