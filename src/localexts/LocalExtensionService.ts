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
            return this.setDifference(availableExts, installedExts);
        }).then(this.installer.install);
    }


    private notInSet(x: LocalExtension, set: Array<LocalExtension>): boolean {
        return set.findIndex(y => x.name == y.name) == -1;
    }

    private setDifference(set1: Array<LocalExtension>, set2: Array<LocalExtension>): Array<LocalExtension> {
        return set1.filter(x => this.notInSet(x, set2));
    }

}