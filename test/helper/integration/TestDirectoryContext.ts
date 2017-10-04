import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';
import * as vscode from 'vscode';

import { IExtension } from '../../../src/vscodeapi';

interface ITempDir {
    readonly name: string;
    readonly cleanup: () => void;
}

function tmpDir(options?: tmp.Options): Promise<ITempDir> {
    return new Promise((resolve, reject) => {
        tmp.dir(options || {}, (err, dirPath, cleanup) => {
            if (!err) {
                resolve({ name: dirPath, cleanup });
            } else {
                reject(err);
            }
        });
    });
}

export class TestDirectoryContext {

    private tmpDir: ITempDir;

    public async setup() {
        this.tmpDir = await tmpDir({ unsafeCleanup: true });
        await Promise.all([
            fs.mkdirp(this.extDir),
            fs.mkdirp(this.userDir),
        ]);
    }

    public async teardown() {
        this.tmpDir.cleanup();
    }

    public get extDir(): string {
        return path.join(this.tmpDir.name, 'extensions');
    }

    public get userDir(): string {
        return path.join(this.tmpDir.name, 'user');
    }

}
