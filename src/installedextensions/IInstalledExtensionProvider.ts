import IInstalledExtension from 'installedextensions/IInstalledExtension';

export default interface IInstalledExtensionProvider {
    getInstalledExtensions(): Promise<IInstalledExtension[]>;
}
