import { It, Mock } from 'typemoq';
import * as vscode from 'vscode';

import { IExtension } from 'vscodeapi';

export class ExtensionListContext {
    public extDir: string;
    private readonly originalExtensionsAPI = vscode.extensions;
    private extensionList: Array<vscode.Extension<any>> = [];

    public givenAdditionalInstalledExtensions(...additionalExtensions: Array<IExtension<any>>) {
        this.extensionList = this.getCombinedExtensionList(additionalExtensions);
    }

    public async setup(extDir: string) {
        this.extDir = extDir;
        (vscode as any).extensions = this.getExtensionsMock();
    }

    public async teardown() {
        (vscode as any).extensions = this.originalExtensionsAPI;
    }

    private getSystemExtensions(): Array<vscode.Extension<any>> {
        return vscode.extensions.all.filter((ext) => !ext.extensionPath.startsWith(this.extDir));
    }

    private getCombinedExtensionList(additionalExtensions: Array<IExtension<any>>): Array<vscode.Extension<any>> {
        return this.getSystemExtensions().concat(additionalExtensions.map((ext) => {
            return {
                id: ext.id,
                extensionPath: ext.extensionPath,
                isActive: false,
                packageJSON: null,
                exports: null,
                activate: () => Promise.resolve(),
            };
        }));
    }

    private getExtensionsMock(): typeof vscode.extensions {
        const mock = Mock.ofType<typeof vscode.extensions>();
        mock
            .setup((x) => x.all)
            .returns(() => this.extensionList);
        return mock.object;
    }

}
