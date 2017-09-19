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
    private availableExtensionPath: string;
    private vscodeapi: VSCode;

    constructor(availableExtensionPath: string, vscodeapi: VSCode) {
        this.availableExtensionPath = availableExtensionPath;
        this.vscodeapi = vscodeapi;
    }

    public async listAvailableExtensions(): Promise<LocalExtension[]> {
        const availableExts: LocalExtension[] = [];
        const files = await fs.readdir(this.availableExtensionPath);
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
        const localExts: LocalExtension[] = [];
        for (const ext of this.vscodeapi.extensions.all) {
            const localExtFile = path.join(ext.extensionPath, 'local-extension');
            try {
                const localExtContent = await fs.readFile(localExtFile, 'utf-8');
                localExts.push({
                    name: ext.id,
                    path: localExtContent.toString().trim(),
                });
            } catch {
                continue;
            }
        }
        return localExts;
    }
}
