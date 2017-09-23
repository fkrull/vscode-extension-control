import { IVSCodeAPI } from '../vscodeapi';
import IInstalledExtension from './IInstalledExtension';
import IInstalledExtensionProvider from './IInstalledExtensionProvider';

export default class VSCodeExtensionProvider implements IInstalledExtensionProvider {
    private readonly vscodeAPI: IVSCodeAPI;

    constructor(vscodeAPI: IVSCodeAPI) {
        this.vscodeAPI = vscodeAPI;
    }

    public async getInstalledExtensions(): Promise<IInstalledExtension[]> {
        const userExtensions = this.vscodeAPI.extensions.all
            .filter((ext) => !ext.extensionPath.startsWith(this.vscodeAPI.env.appRoot));
        return Promise.resolve(userExtensions);
    }

}
