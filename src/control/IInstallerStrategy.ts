import IConfiguredExtension from 'config/IConfiguredExtension';

export default interface IInstallerStrategy<T extends IConfiguredExtension> {
    isValid(ext: IConfiguredExtension): boolean;
    install(ext: T): Promise<void>;
}
