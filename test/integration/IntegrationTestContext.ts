import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import { _setMockExtensionList } from '../../src/extension';
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
        _setMockExtensionList(this.getRealExtensions().concat(additionalExtensions));
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

    private getRealExtensions(): Array<IExtension<any>> {
        return vscode.extensions.all.filter((ext) => !ext.extensionPath.startsWith(this.extDir));
    }

}
