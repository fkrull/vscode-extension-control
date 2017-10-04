import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import { IExtension } from '../../../src/vscodeapi';

export class TestDirectoryContext {

    public readonly extDir: string;
    public readonly userDir: string;

    constructor(baseDir: string) {
        this.extDir = path.join(baseDir, '.integration', 'extensions');
        this.userDir = path.join(baseDir, '.integration', 'data', 'User');
    }

    public async setup() { /* pass */ }

    public async teardown() {
        await Promise.all([
            fs.emptyDir(this.extDir),
            fs.emptyDir(this.userDir),
        ]);
    }

}
