import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { VSCode } from '../vscodeapi';
import LocalExtension from './LocalExtension';

function promisify<R>(func): (...args: any[]) => Promise<R> {
    return (...args) => {
        return new Promise((resolve, reject) => {
            const fullArgs = args.concat((error, result) => {
                if (error !== null && error !== undefined) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
            func(...fullArgs);
        });
    };
}

const readFile: (path: string, encoding?: string) => Promise<Buffer> = promisify(fs.readFile);
const readdir: (path: string) => Promise<string[]> = promisify(fs.readdir);
const stat: (path: string) => Promise<fs.Stats> = promisify(fs.stat);
function access(filepath: string, mode: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.access(filepath, mode, (error) => {
            resolve(error === null || error === undefined);
        });
    });
}

async function isReadableFile(filepath: string): Promise<boolean> {
    try {
        const stats = await stat(filepath);
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
        const files = await readdir(this.availableExtensionPath);
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
                const localExtContent = await readFile(localExtFile, 'utf-8');
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
