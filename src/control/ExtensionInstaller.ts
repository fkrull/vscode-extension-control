import IConfiguredExtension from 'config/IConfiguredExtension';
import IExtensionInstaller from 'control/IExtensionInstaller';
import IInstallerStrategy from 'control/IInstallerStrategy';

export default class ExtensionInstaller implements IExtensionInstaller {

    constructor(
        private readonly installerStrategies: Array<IInstallerStrategy<any>>,
    ) {}

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
