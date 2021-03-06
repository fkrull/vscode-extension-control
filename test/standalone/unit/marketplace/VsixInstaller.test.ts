import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';
import { Mock } from 'typemoq';

import { assertFilesEqual } from '../../../helper';

import IConfiguration from 'config/IConfiguration';
import VsixInstaller from 'marketplace/VsixInstaller';

suite('VsixInstaller.install', () => {

    let extensionsDir: tmp.SynchrounousResult;

    const dataDir = path.join(__dirname, '..', '..', '..', '..', '..', 'test', 'data');
    const testPackage = path.join(dataDir, 'helloworld-0.0.1.vsix');
    const testPackageDir = path.join(dataDir, 'helloworld-ext');
    const configMock = Mock.ofType<IConfiguration>();
    const installer = new VsixInstaller(configMock.object);

    setup(() => {
        extensionsDir = tmp.dirSync({ unsafeCleanup: true });
        configMock
            .setup((x) => x.extensionDirectory)
            .returns(() => extensionsDir.name);
    });

    teardown(() => {
        extensionsDir.removeCallback();
    });

    suite('install()', () => {

        test('should unpack package into extensions folder', async () => {
            await installer.install(testPackage);

            const extDir = path.join(extensionsDir.name, 'fkrull.helloworld-0.0.1');
            assert(await fs.exists(extDir));
            ['package.json', path.join('out', 'extension.js')].forEach((name) => {
                assertFilesEqual(path.join(extDir, name), path.join(testPackageDir, name));
            });
        });

    });

});
