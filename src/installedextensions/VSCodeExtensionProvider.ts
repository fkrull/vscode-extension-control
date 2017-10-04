import IInstalledExtension from 'installedextensions/IInstalledExtension';
import IInstalledExtensionProvider from 'installedextensions/IInstalledExtensionProvider';
import { IExtensions } from 'vscodeapi';

export default class VSCodeExtensionProvider implements IInstalledExtensionProvider {

    constructor(
        private readonly appRoot: string,
        private readonly extensionAPI: IExtensions,
    ) {}

    public async getInstalledExtensions(): Promise<IInstalledExtension[]> {
        const userExtensions = this.extensionAPI.all
            .filter((ext) => !ext.extensionPath.startsWith(this.appRoot));
        return Promise.resolve(userExtensions);
    }

}
