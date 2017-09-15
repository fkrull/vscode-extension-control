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
        ])
        .then(([ availableExts, installedExts ]) => {
            const notInstalledExts = this.setSubtract(availableExts, installedExts);
            const unavailableExts = this.setSubtract(installedExts, availableExts);
            return Promise.all([
                this.installer.install(notInstalledExts),
                this.installer.uninstall(unavailableExts)
            ])
        })
        .then(() => {});
    }

    private setSubtract(set1: Array<LocalExtension>, set2: Array<LocalExtension>): Array<LocalExtension> {
        return set1.filter(x => this.notInSet(x, set2));
    }

    private notInSet(x: LocalExtension, set: Array<LocalExtension>): boolean {
        return set.findIndex(y => x.name == y.name) == -1;
    }


}