import IConfiguredExtension from './IConfiguredExtension';

export default interface IJsonEntryParser {
    isValid(entry: any): boolean;
    parse(entry: any): IConfiguredExtension;
}
