import IInstalledExtension from './IInstalledExtension';

export default interface IInstalledExtensionProvider {
    getInstalledExtensions(): Promise<IInstalledExtension[]>;
}
