import IConfiguredExtension from 'config/IConfiguredExtension';
import { IExtensionInstaller, IInstallResult } from 'control/IExtensionInstaller';
import { IGenericInstallerStrategy } from 'control/IInstallerStrategy';

export default class ExtensionInstaller implements IExtensionInstaller {

    constructor(
        private readonly installerStrategies: IGenericInstallerStrategy[],
    ) {}

    public installExtensions(extensions: IConfiguredExtension[]): Promise<IInstallResult[]> {
        return Promise.all(extensions.map((ext) => this.installExtension(ext)));
    }

    private installExtension(ext: IConfiguredExtension): Promise<IInstallResult> {
        const installer = this.getInstallerStrategy(ext);
        if (installer !== undefined) {
            return this.performInstallation(ext, installer);
        } else {
            // This is a configuration/coding error, not an expected runtime failure.
            // Accordingly, it doesn't get the IInstallResult treatment.
            throw new Error(`no installer for type '${ext.type}'`);
        }
    }

    private getInstallerStrategy(ext: IConfiguredExtension): IGenericInstallerStrategy | undefined {
        for (const installer of this.installerStrategies) {
            if (installer.isValid(ext)) {
                return installer;
            }
        }
        return undefined;
    }

    private async performInstallation(
        ext: IConfiguredExtension,
        installer: IGenericInstallerStrategy,
    ): Promise<IInstallResult> {
        try {
            await installer.install(ext);
            return { successful: true, ext };
        } catch (error) {
            return { successful: false, ext, error };
        }
    }

}
