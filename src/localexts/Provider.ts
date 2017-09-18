import LocalExtension from './LocalExtension';

export default class Provider {
    private availableExtensionPath: string;

    constructor(availableExtensionPath: string) {
        this.availableExtensionPath = availableExtensionPath;
    }

    public listAvailableExtensions(): Promise<LocalExtension[]> {
        return Promise.resolve([]);
    }

    public listInstalledExtensions(): Promise<LocalExtension[]> {
        return Promise.resolve([]);
    }
}
