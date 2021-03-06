import HtmlWebpackPlugin from 'html-webpack-plugin';
import { load } from 'cheerio';
import { promises as fs } from 'fs';
import * as nodePath from 'path';

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
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InjectStylePlugin', (compilation) => {
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InjectStylePlugin',
        (
          data: { html: string; outputName: string; plugin: HtmlWebpackPlugin },
          cb
        ) => {
          const { html, outputName } = data;
          data.html = this.patchStyleIntoHtml(html);

          // Tell webpack to move on
          cb(null, data);
        }
      );
    });

    // copy the style file (with hash) to dist
    compiler.hooks.done.tapAsync('InjectStylePlugin', async (stats, cb) => {
      const { path } = stats.compilation.options.output;
      this.options.forEach(async (style) => {
        const { path: srcPath } = style;
        const styleFilename = nodePath.basename(srcPath);
        const targetPath = nodePath.resolve(path, styleFilename);
        await fs.copyFile(srcPath, targetPath);
      });
      cb();
    });
  }

  patchStyleIntoHtml(html: string): string {
    // 1. parse html
    const $ = load(html);
    // 2. traverse option list to insert style into html
    this.options.forEach((style) => {
      const link = this.generateStyleLink(style);
      $('head').append(link);
    });
    return $.html();
  }

  generateStyleLink(style: StyleItem): string {
    const { path, sync } = style;
    const name = './' + nodePath.basename(path);
    if (sync) {
      return `<link rel="stylesheet" href="${name}">`;
    } else {
      return `
        <link
        href="${name}"
        rel="preload"
        as="style"
        onload="this.onload=null;this.rel='stylesheet'"
      />`;
    }
  }
}

module.exports = InjectStyle;
