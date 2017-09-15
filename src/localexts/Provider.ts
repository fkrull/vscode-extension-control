import LocalExtension from './LocalExtension';

export default class Provider {
    public listAvailableExtensions(): Promise<LocalExtension[]> {
        return Promise.resolve([]);
    }

    public listInstalledExtensions(): Promise<LocalExtension[]> {
        return Promise.resolve([]);
    }
}
