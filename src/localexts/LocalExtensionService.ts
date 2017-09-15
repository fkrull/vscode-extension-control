import Provider from './Provider';
import Installer from './Installer';
import LocalExtension from './LocalExtension';

export default class LocalExtensionService {
    private provider: Provider;
    private installer: Installer;

    constructor(provider: Provider, installer: Installer) {
        this.provider = provider;
        this.installer = installer;
    }

    syncLocalExtensions(): Promise<void> {
        return Promise.all([
            this.provider.listAvailableExtensions(),
            this.provider.listInstalledExtensions()
        ]).then(([ availableExts, installedExts ]) => {
            const installedNames = installedExts.map(x => x.name);
            return availableExts.filter(x => installedNames.indexOf(x.name) == -1);
        }).then(this.installer.install);
    }
}