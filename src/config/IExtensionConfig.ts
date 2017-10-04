import IConfiguredExtension from 'config/IConfiguredExtension';

export default interface IExtensionConfig {
    getConfiguredExtensions(): Promise<IConfiguredExtension[] | undefined>;
}
