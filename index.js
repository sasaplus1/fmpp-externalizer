"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.externalize = void 0;
var freemarker_parser_1 = require("freemarker-parser");
/**
 * externalize template
 */
function externalize(template, options, freemarkerParserOptions) {
    var parser = new freemarker_parser_1.Parser();
    var data = parser.parse(template, freemarkerParserOptions);
    var match = options.match, _a = options.quotation, quotation = _a === void 0 ? '"' : _a, _b = options.to, to = _b === void 0 ? '' : _b;
    var text = data.tokens.map(function (token) {
        var endTag = token.endTag, params = token.params, startTag = token.startTag, text = token.text, type = token.type;
        var tokenText = '';
        if (startTag) {
            tokenText += startTag;
        }
        tokenText += text;
        if (params) {
            // NOTE: freemarker-parser is not supported include options. see below:
            // <#include "/path/to/file" encoding="utf-8" parse=false>
            // {
            //   type: 'Directive',
            //   start: 0,
            //   end: 57,
            //   startTag: '<#',
            //   endTag: '/>',
            //   text: 'include',
            //   params: '"/path/to/file" encoding="utf-8" parse=false ',
            //   isClose: false
            // }
            if (type === 'Directive' && /include/i.test(text)) {
                var includePath = params.replace(/["']+/g, '').trim();
                if (typeof match === 'string' && match === includePath) {
                    tokenText += " " + (quotation + to + quotation) + " ";
                }
                else if (match instanceof RegExp && match.test(includePath)) {
                    tokenText += " " + (quotation + to + quotation) + " ";
                }
                else if (typeof match === 'function') {
                    tokenText += " " + (quotation + match(includePath) + quotation) + " ";
                }
                else {
                    tokenText += " " + params;
                }
            }
            else {
                tokenText += params;
            }
        }
        if (endTag) {
            tokenText += token.endTag;
        }
        return tokenText;
    });
    return text.join('');
}
exports.externalize = externalize;
//# sourceMappingURL=index.js.map