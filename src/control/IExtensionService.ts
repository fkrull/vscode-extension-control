import IConfiguredExtension from 'config/IConfiguredExtension';
import IInstalledExtension from 'installedextensions/IInstalledExtension';

export default interface IExtensionService {
    selectExtensionsToInstall(
        configuredExtensions: IConfiguredExtension[],
        installedExtensions: IInstalledExtension[],
    ): Promise<IConfiguredExtension[]>;
}
