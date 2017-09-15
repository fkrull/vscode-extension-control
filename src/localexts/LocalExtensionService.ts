import Provider from './Provider';
import Installer from './Installer';

export default class LocalExtensionService {
    private provider: Provider;
    private installer: Installer;

    constructor(provider: Provider, installer: Installer) {
        this.provider = provider;
        this.installer = installer;
    }

    syncLocalExtensions(): Promise<void> {
        return this.provider.listAvailableExtensions()
            .then(this.installer.install);
    }
}