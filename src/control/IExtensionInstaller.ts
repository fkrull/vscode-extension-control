import IConfiguredExtension from '../config/IConfiguredExtension';

export default interface IExtensionInstaller {
    installExtensions(extensions: IConfiguredExtension[]): Promise<void>;
}
