import * as fs from 'fs-extra';
import * as path from 'path';
import LocalExtension from './LocalExtension';

export default class Installer {
    private readonly extensionDir: string;

    constructor(extensionDir: string) {
        this.extensionDir = extensionDir;
    }

    public async install(localExts: LocalExtension[]): Promise<void> {
        for (const localExt of localExts) {
            const destPath = path.join(this.extensionDir, localExt.name);
            await fs.copy(localExt.path, destPath);
            const localExtFile = path.join(destPath, 'local-extension');
            await fs.writeFile(localExtFile, localExt.path);
        }
    }

    public uninstall(exts: LocalExtension[]): Promise<void> {
        return Promise.resolve();
    }
}
