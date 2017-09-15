import Installer from './Installer';
import LocalExtension from './LocalExtension';
import Provider from './Provider';

export default class LocalExtensionService {

    private provider: Provider;
    private installer: Installer;

    constructor(provider: Provider, installer: Installer) {
        this.provider = provider;
        this.installer = installer;
    }

    public async syncLocalExtensions(): Promise<void> {
        const [availableExts, installedExts] = await Promise.all([
            this.provider.listAvailableExtensions(),
            this.provider.listInstalledExtensions(),
        ]);
        const notInstalledExts = this.setSubtract(availableExts, installedExts);
        const unavailableExts = this.setSubtract(installedExts, availableExts);
        await Promise.all([
            this.installer.install(notInstalledExts),
            this.installer.uninstall(unavailableExts),
        ]);
    }

    private setSubtract(set1: LocalExtension[], set2: LocalExtension[]): LocalExtension[] {
        return set1.filter((x) => this.notInSet(x, set2));
    }

    private notInSet(x: LocalExtension, set: LocalExtension[]): boolean {
        return set.findIndex((y) => x.name === y.name) === -1;
    }

}
