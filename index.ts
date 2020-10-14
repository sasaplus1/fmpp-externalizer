import { Parser as FreemarkerParser } from 'freemarker-parser';

export type Options = {
  match: string | RegExp | ((value: string) => string);
  quotation?: "'" | '"';
  to?: string;
};

/**
 * externalize template
 */
export function externalize(
  template: string,
  options: Options,
  freemarkerParserOptions?: Record<string, unknown>
): string {
  const parser = new FreemarkerParser();
  const data = parser.parse(template, freemarkerParserOptions);

  const { match, quotation = '"', to = '' } = options;

  const text = data.tokens.map((token) => {
    const { endTag, params, startTag, text, type } = token;

    let tokenText = '';

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
        const includePath = params.replace(/["']+/g, '').trim();

        if (typeof match === 'string' && match === includePath) {
          tokenText += ` ${quotation + to + quotation} `;
        } else if (match instanceof RegExp && match.test(includePath)) {
          tokenText += ` ${quotation + to + quotation} `;
        } else if (typeof match === 'function') {
          tokenText += ` ${quotation + match(includePath) + quotation} `;
        } else {
          tokenText += ` ${params}`;
        }
      } else {
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
