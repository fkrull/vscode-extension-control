import IConfiguredExtension from '../config/IConfiguredExtension';
import IJsonEntryParser from '../config/IJsonEntryParser';
import LocalExtension from './LocalExtension';

export default class LocalExtensionEntryParser implements IJsonEntryParser<LocalExtension> {

    public isValid(entry: any): boolean {
        return typeof entry === 'object' &&
            typeof entry.id === 'string' &&
            entry.type === 'local' &&
            typeof entry.path === 'string';
    }

    public parse(entry: any): LocalExtension {
        return new LocalExtension(entry.id, entry.path);
    }
}
