import IConfiguredExtension from 'config/IConfiguredExtension';

export interface IInstallSuccess {
    readonly successful: true;
    readonly ext: IConfiguredExtension;
}

export interface IInstallFailure {
    readonly successful: false;
    readonly ext: IConfiguredExtension;
    readonly error: any;
}

export type IInstallResult = IInstallSuccess | IInstallFailure;

export interface IExtensionInstaller {
    installExtensions(extensions: IConfiguredExtension[]): Promise<IInstallResult[]>;
}
