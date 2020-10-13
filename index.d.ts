export declare type Options = {
    match: string | RegExp | ((value: string) => string);
    quotation?: "'" | '"';
    to?: string;
};
/**
 * externalize template
 */
export declare function externalize(template: string, options: Options, freemarkerParserOptions?: Record<string, unknown>): string;
