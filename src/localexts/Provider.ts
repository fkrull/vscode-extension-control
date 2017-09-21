import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import { VSCode } from '../vscodeapi';
import LocalExtension from './LocalExtension';

function access(filepath: string, mode: number): Promise<boolean> {
    return fs.access(filepath, mode)
        .then(() => true)
        .catch(() => false);
}

async function isReadableFile(filepath: string): Promise<boolean> {
    try {
        const stats = await fs.stat(filepath);
        const readable = await access(filepath, fs.constants.R_OK);
        return stats.isFile() && readable;
    } catch {
        return false;
    }
}

export default class Provider {
    private readonly availableExtensionPath: string;
    private readonly installedExtensionPath: string;

    constructor(availableExtensionPath: string, installedExtensionPath: string) {
        this.availableExtensionPath = availableExtensionPath;
        this.installedExtensionPath = installedExtensionPath;
    }

    public async listAvailableExtensions(): Promise<LocalExtension[]> {
        const availableExts: LocalExtension[] = [];
        const files = await this.maybeListDirectory(this.availableExtensionPath);
        for (const fname of files) {
            const pkgjson = path.join(this.availableExtensionPath, fname, 'package.json');
            const readable = await isReadableFile(pkgjson);
            if (readable) {
                availableExts.push({
                    name: fname,
                    path: path.join(this.availableExtensionPath, fname),
                });
            }
        }
        return availableExts;
    }

    public async listInstalledExtensions(): Promise<LocalExtension[]> {
        const installedExts: LocalExtension[] = [];
        const files = await this.maybeListDirectory(this.installedExtensionPath);
        for (const fname of files) {
            const localExtFile = path.join(this.installedExtensionPath, fname, 'local-extension');
            try {
                const localExtContent = await fs.readFile(localExtFile, 'utf-8');
                installedExts.push({
                    name: fname,
                    path: localExtContent.toString().trim(),
                });
            } catch {
                continue;
            }
        }
        return installedExts;
    }

    private async maybeListDirectory(dirPath: string): Promise<string[]> {
        try {
            return await fs.readdir(dirPath);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
}
