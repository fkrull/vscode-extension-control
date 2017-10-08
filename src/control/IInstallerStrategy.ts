import IConfiguredExtension from 'config/IConfiguredExtension';

export interface IInstallerStrategy<T extends IConfiguredExtension> {
    isValid(ext: IConfiguredExtension): boolean;
    install(ext: T): Promise<void>;
}

export type IGenericInstallerStrategy = IInstallerStrategy<IConfiguredExtension>;
