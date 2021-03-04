"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class LogRemover {
    constructor() {
        console.log('log remover plugin registed');
    }
    apply(compiler) {
        compiler.hooks.done.tapAsync('RemoveLogs', (stats, cb) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { path, filename } = stats.compilation.options.output;
                let filePath = path + '/' + filename;
                const data = (yield fs_1.promises.readFile(filePath, 'utf8'));
                const rgx = /,?console.log\(['|"](.*?)['|"]\)/g;
                const newdata = data.replace(rgx, '');
                yield fs_1.promises.writeFile(filePath, newdata);
            }
            finally {
                console.log('LogRemover finished');
                cb();
            }
        }));
    }
}
module.exports = LogRemover;
