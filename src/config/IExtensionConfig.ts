import IConfiguredExtension from './IConfiguredExtension';

export default interface IExtensionConfig {
    getConfiguredExtensions(): Promise<IConfiguredExtension[] | undefined>;
}
