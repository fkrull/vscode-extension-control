import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import * as vscode from 'vscode';
import LocalExtension from '../../src/localexts/LocalExtension';
import Provider from '../../src/localexts/Provider';
import { VSCode } from '../../src/vscodeapi';

suite('Provider.listAvailableExtensions', () => {
    let tmpdir: tmp.SynchrounousResult;
    let vscodeapi: VSCode;

    setup(() => {
        tmpdir = tmp.dirSync({ unsafeCleanup: true });
        vscodeapi = vscode;
    });

    teardown(() => {
        tmpdir.removeCallback();
    });

    test('should list all extensions in extension dir', async () => {
        const expectedExts: LocalExtension[] = [];
        for (const extName of ['ext4', 'ext2', 'ext1']) {
            const extdir = path.join(tmpdir.name, extName);
            fs.mkdirSync(extdir);
            const pkgjson = path.join(extdir, 'package.json');
            fs.writeFileSync(pkgjson, '{"version":"0.1.0"}');
            expectedExts.push({name: extName, path: extdir});
        }
        const provider = new Provider(tmpdir.name, vscodeapi);

        const availableExts = await provider.listAvailableExtensions();

        availableExts.sort(compareLocalExtensions);
        expectedExts.sort(compareLocalExtensions);
        assert.deepEqual(availableExts, expectedExts);
    });

    test('should not list directories without package.json', async () => {
        fs.mkdirSync(path.join(tmpdir.name, 'ext'));
        const provider = new Provider(tmpdir.name, vscodeapi);

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, []);
    });

    test('should not list directories where package.json is a directory', async () => {
        fs.mkdirSync(path.join(tmpdir.name, 'ext'));
        fs.mkdirSync(path.join(tmpdir.name, 'ext', 'package.json'));
        const provider = new Provider(tmpdir.name, vscodeapi);

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, []);
    });

});

function compareLocalExtensions(a: LocalExtension, b: LocalExtension): number {
    return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
}
