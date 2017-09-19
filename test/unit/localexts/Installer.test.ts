import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
import Installer from '../../../src/localexts/Installer';
import LocalExtension from '../../../src/localexts/LocalExtension';

suite('Installer.install', () => {
    let srcdir: tmp.SynchrounousResult;
    let dstdir: tmp.SynchrounousResult;

    setup(() => {
        srcdir = tmp.dirSync({ unsafeCleanup: true });
        dstdir = tmp.dirSync({ unsafeCleanup: true });
    });

    teardown(() => {
        srcdir.removeCallback();
        dstdir.removeCallback();
    });

    test('should copy specified folders and create local-extension file', async () => {
        const localExts: LocalExtension[] = [];
        for (const extName of ['ext2', 'ext1']) {
            const srcPath = path.join(srcdir.name, extName);
            fs.mkdirSync(srcPath);
            const testFile = path.join(srcPath, `test-${extName}-file.js`);
            fs.writeFileSync(testFile, `test-${extName}`);
            localExts.push({ name: extName, path: srcPath });
        }
        fs.mkdirSync(path.join(srcdir.name, 'ext3'));
        const installer = new Installer(dstdir.name);

        await installer.install(localExts);

        const dstNames = fs.readdirSync(dstdir.name);
        dstNames.sort();
        assert.deepEqual(dstNames, ['ext1', 'ext2']);
        for (const localExt of localExts) {
            const dstPath = path.join(dstdir.name, localExt.name);
            const names = fs.readdirSync(dstPath);
            names.sort();
            assert.deepEqual(names, ['local-extension', `test-${localExt.name}-file.js`]);
            const testFile = fs.readFileSync(path.join(dstPath, `test-${localExt.name}-file.js`));
            assert.equal(testFile.toString(), `test-${localExt.name}`);
            const localExtFile = fs.readFileSync(path.join(dstPath, 'local-extension'));
            assert.equal(localExtFile.toString(), localExt.path);
        }
    });

});

suite('Installer.uninstall', () => {
    let extdir: tmp.SynchrounousResult;

    setup(() => {
        extdir = tmp.dirSync({ unsafeCleanup: true });
    });

    teardown(() => {
        extdir.removeCallback();
    });

    test('should delete specified folders', async () => {
        const localExts: LocalExtension[] = [];
        for (const extName of ['ext2', 'ext1']) {
            const extPath = path.join(extdir.name, extName);
            fs.mkdirSync(extPath);
            const localExtFile = path.join(extPath, 'local-extension');
            fs.writeFileSync(localExtFile, '/some/path');
            localExts.push({ name: extName, path: extPath });
        }
        fs.mkdirSync(path.join(extdir.name, 'ext3'));
        const installer = new Installer(extdir.name);

        await installer.uninstall(localExts);

        const remainingNames = fs.readdirSync(extdir.name);
        assert.deepEqual(remainingNames, ['ext3']);
    });

});
