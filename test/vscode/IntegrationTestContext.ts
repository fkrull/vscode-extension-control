import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import { IExtension } from '../../src/vscodeapi';

export default class IntegrationTestContext {

    public readonly extDir: string;
    public readonly userDir: string;

    constructor(baseDir: string) {
        this.extDir = path.join(baseDir, '.integration', 'extensions');
        this.userDir = path.join(baseDir, '.integration', 'data', 'User');
    }

    public async setup() {
        await this.teardown();
        const config = vscode.workspace.getConfiguration('extensionControl');
        await Promise.all([
            config.update('extensionDirectory', this.extDir, vscode.ConfigurationTarget.Global),
            config.update('userDirectory', this.userDir, vscode.ConfigurationTarget.Global),
        ]);
    }

    public async teardown() {
        await Promise.all([
            fs.emptyDir(this.extDir),
            fs.emptyDir(this.userDir),
        ]);
    }

    public givenAdditionalInstalledExtensions(...additionalExtensions: Array<IExtension<any>>) {
        const exts = this.getFullExtensionList(additionalExtensions);
        (vscode as any).extensions = new Proxy(vscode.extensions, {
            get(target, property, receiver) {
                if (property === 'all') {
                    return exts;
                } else {
                    return target[property];
                }
            },
        });
    }

    public async givenExtensionList(exts: any[]) {
        await fs.writeJSON(
            path.join(this.userDir, 'extensions.json'),
            exts,
        );
    }

    public async givenSimpleLocalExtension(folder: string, json: any) {
        await fs.mkdirp(path.join(this.userDir, 'Extensions', folder));
        await fs.writeJSON(
            path.join(this.userDir, 'Extensions', folder, 'package.json'),
            json,
        );
    }

    private getFullExtensionList(additionalExtensions: Array<IExtension<any>>): Array<vscode.Extension<any>> {
        return this.getRealExtensions().concat(additionalExtensions.map((ext) => {
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

    private getRealExtensions(): Array<vscode.Extension<any>> {
        return vscode.extensions.all.filter((ext) => !ext.extensionPath.startsWith(this.extDir));
    }

}
