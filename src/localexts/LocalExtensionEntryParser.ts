import IConfiguredExtension from '../config/IConfiguredExtension';
import IJsonEntryParser from '../config/IJSONEntryParser';
import ILocalExtension from './ILocalExtension';

export default class LocalExtensionEntryParser implements IJsonEntryParser {

    public isValid(entry: any): boolean {
        return typeof entry === 'object' &&
            typeof entry.id === 'string' &&
            entry.type === 'local' &&
            typeof entry.path === 'string';
    }

    public parse(entry: any): ILocalExtension {
        return {
            extensionPath: entry.path,
            id: entry.id,
            type: 'local',
        };
    }
}
