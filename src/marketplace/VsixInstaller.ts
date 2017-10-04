import * as fs from 'fs-extra';
import * as path from 'path';
import * as yauzl from 'yauzl';

import IConfiguration from 'config/IConfiguration';
import IVsixInstaller from 'marketplace/IVsixInstaller';

const EXTENSION_PREFIX = 'extension/';
const PACKAGE_JSON_PATH = 'extension/package.json';

function yauzlOpen(zipPath: string, options?: yauzl.IOptions): Promise<yauzl.ZipFile> {
    return new Promise((resolve, reject) => {
        yauzl.open(zipPath, options, (err, zipfile) => {
            if (!err) {
                resolve(zipfile);
            } else {
                reject(err);
            }
        });
    });
}

function getEntries(zipfile: yauzl.ZipFile): Promise<yauzl.Entry[]> {
    const entries: yauzl.Entry[] = [];
    return new Promise((resolve, reject) => {
        zipfile.on('entry', (entry: yauzl.Entry) => {
            entries.push(entry);
            zipfile.readEntry();
        });
        zipfile.on('end', () => {
            resolve(entries);
        });
        zipfile.readEntry();
    });
}

function readStream(stream: NodeJS.ReadableStream, encoding: string): Promise<string> {
    stream.setEncoding(encoding);
    const chunks: string[] = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk: string) => chunks.push(chunk));
        stream.on('end', () => resolve(''.concat(...chunks)));
    });
}

function readPackageManifest(zipfile: yauzl.ZipFile, entries: yauzl.Entry[]): Promise<any> {
    return new Promise((resolve, reject) => {
        const entry = entries.find((e) => e.fileName === PACKAGE_JSON_PATH);
        if (entry !== undefined) {
            zipfile.openReadStream(entry, (err, stream) => {
                if (stream !== undefined) {
                    resolve(readStream(stream, 'utf-8').then((data) => JSON.parse(data)));
                }
            });
        }
    });
}

function extractFile(zipfile: yauzl.ZipFile, entry: yauzl.Entry, targetPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        zipfile.openReadStream(entry, (err, stream) => {
            if (stream) {
                stream.on('end', () => resolve());
                const targetStream = fs.createWriteStream(targetPath);
                stream.pipe(targetStream);
            }
        });
    });
}

async function extractPackage(
    zipfile: yauzl.ZipFile,
    entries: yauzl.Entry[],
    prefix: string,
    targetDir: string,
): Promise<void> {
    await Promise.all(entries
        .filter((entry) => entry.fileName.startsWith(prefix))
        .map(async (entry) => {
            const parts = entry.fileName.slice(prefix.length).split('/');
            const targetPath = path.join(targetDir, ...parts);
            await fs.mkdirp(path.dirname(targetPath));
            await extractFile(zipfile, entry, targetPath);
        }));
}

export default class VsixInstaller implements IVsixInstaller {

    constructor(
        private readonly config: IConfiguration,
    ) {}

    public async install(vsixPath: string): Promise<void> {
        const zipfile = await yauzlOpen(vsixPath, { lazyEntries: true, autoClose: false });
        const entries = await getEntries(zipfile);
        const manifest = await readPackageManifest(zipfile, entries);

        const id = `${manifest.publisher}.${manifest.name}`;
        const version: string = manifest.version;
        const extensionDir = path.join(this.config.extensionDirectory, `${id}-${version}`);

        await fs.mkdirp(extensionDir);
        await extractPackage(zipfile, entries, EXTENSION_PREFIX, extensionDir);
    }

}
