import LocalExtension from './LocalExtension';

export default class Provider {
    listAvailableExtensions(): Promise<Array<LocalExtension>> {
        return Promise.resolve([]);
    }

    listInstalledExtensions(): Promise<Array<LocalExtension>> {
        return Promise.resolve([]);
    }
}