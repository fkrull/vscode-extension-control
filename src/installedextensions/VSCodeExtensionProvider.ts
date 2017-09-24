import { IExtensions } from '../vscodeapi';
import IInstalledExtension from './IInstalledExtension';
import IInstalledExtensionProvider from './IInstalledExtensionProvider';

export default class VSCodeExtensionProvider implements IInstalledExtensionProvider {
    private readonly appRoot: string;
    private readonly extensionAPI;

    constructor(
        appRoot: string,
        extensionAPI: IExtensions,
    ) {
        this.appRoot = appRoot;
        this.extensionAPI = extensionAPI;
    }

    public async getInstalledExtensions(): Promise<IInstalledExtension[]> {
        const userExtensions = this.extensionAPI.all
            .filter((ext) => !ext.extensionPath.startsWith(this.appRoot));
        return Promise.resolve(userExtensions);
    }

}
