import IConfiguredExtension from '../config/IConfiguredExtension';
import IExtensionInstaller from './IExtensionInstaller';
import IInstallerStrategy from './IInstallerStrategy';

export default class ExtensionInstaller implements IExtensionInstaller {
    private readonly installerStrategies: Array<IInstallerStrategy<any>>;

    constructor(installerStrategies: Array<IInstallerStrategy<any>>) {
        this.installerStrategies = installerStrategies;
    }

    public async installExtensions(extensions: IConfiguredExtension[]): Promise<void> {
        const promises = extensions.map((ext) => {
            for (const installer of this.installerStrategies) {
                if (installer.isValid(ext)) {
                    return installer.install(ext);
                }
            }
            throw new Error(`no installer for type '${ext.type}'`);
        });
        await Promise.all(promises);
    }

}
