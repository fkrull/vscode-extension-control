import IConfiguredExtension from 'config/IConfiguredExtension';
import IExtensionService from 'control/IExtensionService';
import IInstalledExtension from 'installedextensions/IInstalledExtension';

export default class ExtensionService implements IExtensionService {

    public async selectExtensionsToInstall(
        configuredExtensions: IConfiguredExtension[],
        installedExtensions: IInstalledExtension[],
    ): Promise<IConfiguredExtension[]> {
        return configuredExtensions.filter((ext) => !this.extensionIsInstalled(ext, installedExtensions));
    }

    private extensionIsInstalled(ext: IConfiguredExtension, installedExtensions: IInstalledExtension[]): any {
        return installedExtensions.findIndex((installedExt) => ext.id === installedExt.id) !== -1;
    }

}
