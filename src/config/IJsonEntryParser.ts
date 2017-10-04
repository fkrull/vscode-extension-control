import IConfiguredExtension from 'config/IConfiguredExtension';

export default interface IJsonEntryParser<T extends IConfiguredExtension> {
    isValid(entry: any): boolean;
    parse(entry: any, configFilePath: string): T;
}
