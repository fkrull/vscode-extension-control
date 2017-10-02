import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';

import { assertFilesEqual } from '../../../helper';

import VsixInstaller from '../../../../src/marketplace/VsixInstaller';

suite('VsixInstaller.install', () => {

    let extensionsDir: tmp.SynchrounousResult;

    const dataDir = path.join(__dirname, '..', '..', '..', 'data');
    const testPackage = path.join(dataDir, 'helloworld-0.0.1.vsix');
    const testPackageDir = path.join(dataDir, 'helloworld-ext');
    const installer = new VsixInstaller();

    setup(() => {
        extensionsDir = tmp.dirSync({ unsafeCleanup: true });
    });

    teardown(() => {
        extensionsDir.removeCallback();
    });

    test('should unpack package into extensions folder', async () => {
        await installer.install(testPackage);

        const extDir = path.join(extensionsDir.name, 'fkrull.helloworld-0.0.1');
        assert(await fs.exists(extDir));
        ['extension.js', 'package.json'].forEach((name) => {
            assertFilesEqual(path.join(extDir, name), path.join(testPackageDir, name));
        });
    });

});
