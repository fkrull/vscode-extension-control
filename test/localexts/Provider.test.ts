import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as tmp from 'tmp';
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
        let expectedExts = [];
        for (const extName of ['ext4', 'ext2', 'ext1']) {
            const extdir = path.join(tmpdir.name, extName);
            fs.mkdirSync(extdir);
            const pkgjson = path.join(extdir, 'package.json');
            fs.writeFileSync(pkgjson, '{"version":"0.1.0"}');
            expectedExts = expectedExts.concat({name: extName, path: extdir});
        }
        const provider = new Provider(tmpdir.name);

        const availableExts = await provider.listAvailableExtensions();

        assert.deepEqual(availableExts, expectedExts);
    });

});
