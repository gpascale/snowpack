"use strict";
/**
This plugin was forked from the https://github.com/rollup/plugins/tree/master/packages/alias package:

The MIT License (MIT)

Copyright (c) 2019 RollupJS Plugin Contributors (https://github.com/rollup/plugins/graphs/contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollupPluginAlias = void 0;
const os_1 = require("os");
const slash_1 = __importDefault(require("slash"));
const VOLUME = /^([A-Z]:)/i;
const IS_WINDOWS = os_1.platform() === 'win32';
const noop = () => null;
function matches(alias, importee) {
    if (alias.find instanceof RegExp) {
        return alias.find.test(importee);
    }
    if (importee.length < alias.find.length) {
        return false;
    }
    if (importee === alias.find) {
        return true;
    }
    if (alias.exact) {
        return false;
    }
    const importeeStartsWithKey = importee.indexOf(alias.find) === 0;
    const importeeHasSlashAfterKey = importee.substring(alias.find.length)[0] === '/';
    return importeeStartsWithKey && importeeHasSlashAfterKey;
}
function normalizeId(id) {
    if (typeof id === 'string' && (IS_WINDOWS || VOLUME.test(id))) {
        return slash_1.default(id.replace(VOLUME, ''));
    }
    return id;
}
function getEntries({ entries }) {
    if (!entries) {
        return [];
    }
    return entries;
}
function rollupPluginAlias(options) {
    const entries = getEntries(options);
    if (entries.length === 0) {
        return {
            name: 'alias',
            resolveId: noop,
        };
    }
    return {
        name: 'alias',
        resolveId(importee, importer) {
            const importeeId = normalizeId(importee);
            const importerId = normalizeId(importer);
            // First match is supposed to be the correct one
            const matchedEntry = entries.find((entry) => matches(entry, importeeId));
            if (!matchedEntry || !importerId) {
                return null;
            }
            const updatedId = normalizeId(importeeId.replace(matchedEntry.find, matchedEntry.replacement));
            return this.resolve(updatedId, importer, { skipSelf: true }).then((resolved) => {
                let finalResult = resolved;
                if (!finalResult) {
                    finalResult = { id: updatedId };
                }
                return finalResult;
            });
        },
    };
}
exports.rollupPluginAlias = rollupPluginAlias;
//# sourceMappingURL=rollup-plugin-alias.js.map