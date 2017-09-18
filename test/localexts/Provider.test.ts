import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
import LocalExtension from '../../src/localexts/LocalExtension';
import Provider from '../../src/localexts/Provider';

suite('Provider.listAvailableExtensions', () => {
    let tmpdir: tmp.SynchrounousResult;

    setup(() => {
        tmpdir = tmp.dirSync({ unsafeCleanup: true });
    });

    teardown(() => {
        tmpdir.removeCallback();
    });

    test('should list all extensions in extension dir', async () => {
        const expectedExts = [];
        for (const extName of ['ext4', 'ext2', 'ext1']) {
            const extdir = path.join(tmpdir.name, extName);
            fs.mkdirSync(extdir);
            const pkgjson = path.join(extdir, 'package.json');
            fs.writeFileSync(pkgjson, '{"version":"0.1.0"}');
            expectedExts.push({name: extName, path: extdir});
        }
        const provider = new Provider(tmpdir.name);

        const availableExts = await provider.listAvailableExtensions();

        availableExts.sort(compareLocalExtensions);
        expectedExts.sort(compareLocalExtensions);
        assert.deepEqual(availableExts, expectedExts);
    });

    test('should not list directories without package.json', async () => {
        fs.mkdirSync(path.join(tmpdir.name, 'ext'));
        const provider = new Provider(tmpdir.name);

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, []);
    });

    test('should not list directories where package.json is a directory', async () => {
        fs.mkdirSync(path.join(tmpdir.name, 'ext'));
        fs.mkdirSync(path.join(tmpdir.name, 'ext', 'package.json'));
        const provider = new Provider(tmpdir.name);

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, []);
    });

});

function compareLocalExtensions(a: LocalExtension, b: LocalExtension): number {
    return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
}
