"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const cheerio_1 = require("cheerio");
const fs_1 = require("fs");
const nodePath = __importStar(require("path"));
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
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('InjectStylePlugin', (compilation) => {
            // Static Plugin interface |compilation |HOOK NAME | register listener
            html_webpack_plugin_1.default.getHooks(compilation).beforeEmit.tapAsync('InjectStylePlugin', (data, cb) => {
                const { html, outputName } = data;
                data.html = this.patchStyleIntoHtml(html);
                // Tell webpack to move on
                cb(null, data);
            });
        });
        // copy the style file (with hash) to dist
        compiler.hooks.done.tapAsync('InjectStylePlugin', (stats, cb) => __awaiter(this, void 0, void 0, function* () {
            const { path } = stats.compilation.options.output;
            this.options.forEach((style) => __awaiter(this, void 0, void 0, function* () {
                const { path: srcPath } = style;
                const styleFilename = nodePath.basename(srcPath);
                const targetPath = nodePath.resolve(path, styleFilename);
                yield fs_1.promises.copyFile(srcPath, targetPath);
            }));
            cb();
        }));
    }
    patchStyleIntoHtml(html) {
        // 1. parse html
        const $ = cheerio_1.load(html);
        // 2. traverse option list to insert style into html
        this.options.forEach((style) => {
            const link = this.generateStyleLink(style);
            $('head').append(link);
        });
        return $.html();
    }
    generateStyleLink(style) {
        const { path, sync } = style;
        const name = './' + nodePath.basename(path);
        if (sync) {
            return `<link rel="stylesheet" href="${name}">`;
        }
        else {
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
