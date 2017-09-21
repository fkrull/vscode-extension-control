import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import * as vscode from 'vscode';
import LocalExtension from '../../../src/localexts/LocalExtension';
import Provider from '../../../src/localexts/Provider';

suite('Provider.listAvailableExtensions', () => {
    let tmpdir: tmp.SynchrounousResult;

    setup(() => {
        tmpdir = tmp.dirSync({ unsafeCleanup: true });
    });

    teardown(() => {
        tmpdir.removeCallback();
    });

    test('should list all extensions in extension dir', async () => {
        const expectedExts: LocalExtension[] = [];
        for (const extName of ['ext4', 'ext2', 'ext1']) {
            const extdir = path.join(tmpdir.name, extName);
            const pkgjson = path.join(extdir, 'package.json');
            fs.mkdirSync(extdir);
            fs.writeFileSync(pkgjson, '{"version":"0.1.0"}');
            expectedExts.push({name: extName, path: extdir});
        }
        const provider = new Provider(tmpdir.name, '');

        const availableExts = await provider.listAvailableExtensions();

        availableExts.sort(compareLocalExtensions);
        expectedExts.sort(compareLocalExtensions);
        assert.deepEqual(availableExts, expectedExts);
    });

    test('should not list directories without package.json', async () => {
        fs.mkdirSync(path.join(tmpdir.name, 'ext'));
        const provider = new Provider(tmpdir.name, '');

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, []);
    });

    test('should not list directories where package.json is a directory', async () => {
        fs.mkdirSync(path.join(tmpdir.name, 'ext'));
        fs.mkdirSync(path.join(tmpdir.name, 'ext', 'package.json'));
        const provider = new Provider(tmpdir.name, '');

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, []);
    });

    test('should not fail if available extension directory doesn\'t exist', async () => {
        const provider = new Provider(path.join(tmpdir.name, 'subdir', 'that', 'doesnt-exist'), '');

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, []);
    });

});

suite('Provider.listInstalledExtensions', () => {
    let tmpdir: tmp.SynchrounousResult;

    setup(() => {
        tmpdir = tmp.dirSync({ unsafeCleanup: true });
    });

    teardown(() => {
        tmpdir.removeCallback();
    });

    test('should not fail if installed extension directory doesn\'t exist', async () => {
        const provider = new Provider('', path.join(tmpdir.name, 'subdir', 'that', 'doesnt-exist'));

        const installedExts = await provider.listInstalledExtensions();

        assert.deepEqual(installedExts, []);
    });

    test('should list all extensions containing a signal file', async () => {
        const expectedExts: LocalExtension[] = [];
        for (const extName of ['ext4', 'ext2', 'ext1']) {
            const extdir = path.join(tmpdir.name, extName);
            fs.mkdirSync(extdir);
            const localExtFile = path.join(extdir, 'local-extension');
            const localExtPath = `local-extension/${extName}`;
            fs.writeFileSync(localExtFile, localExtPath);
            expectedExts.push({name: extName, path: localExtPath});
        }
        for (const extName of ['ext3', 'ext5']) {
            const extdir = path.join(tmpdir.name, extName);
            fs.mkdirSync(extdir);
        }
        const provider = new Provider('', tmpdir.name);

        const installedExts = await provider.listInstalledExtensions();

        installedExts.sort(compareLocalExtensions);
        expectedExts.sort(compareLocalExtensions);
        assert.deepEqual(installedExts, expectedExts);
    });

});

function compareLocalExtensions(a: LocalExtension, b: LocalExtension): number {
    return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
}
