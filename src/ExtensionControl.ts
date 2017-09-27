import IExtensionConfig from './config/IExtensionConfig';
import IExtensionInstaller from './control/IExtensionInstaller';
import IExtensionService from './control/IExtensionService';
import IInstalledExtensionProvider from './installedextensions/IInstalledExtensionProvider';

export default class ExtensionControl {

    constructor(
            private readonly installedExtensionProvider: IInstalledExtensionProvider,
            private readonly extensionConfig: IExtensionConfig,
            private readonly extensionService: IExtensionService,
            private readonly extensionInstaller: IExtensionInstaller,
        ) {}

    public async installMissingExtensions(): Promise<void> {
        const configuredExts = await this.extensionConfig.getConfiguredExtensions();
        if (configuredExts === undefined) {
            return;
        }

        const installedExts = await this.installedExtensionProvider.getInstalledExtensions();
        const extsToInstall = await this.extensionService.selectExtensionsToInstall(
            configuredExts,
            installedExts,
        );
        await this.extensionInstaller.installExtensions(extsToInstall);
    }
}
