import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';
import { Mock } from 'typemoq';

import { assertFilesEqual, testMany } from '../../../helper';

import IConfiguration from '../../../../src/config/IConfiguration';
import IConfiguredExtension from '../../../../src/config/IConfiguredExtension';
import LocalExtension from '../../../../src/localexts/LocalExtension';
import LocalExtensionInstallStrategy from '../../../../src/localexts/LocalExtensionInstallStrategy';

suite('LocalExtensionInstallStrategy', () => {

    const configMock = Mock.ofType<IConfiguration>();
    const localExtStrategy = new LocalExtensionInstallStrategy(configMock.object);

    suite('isValid()', () => {

        testMany(
            'should accept',
            (value) => localExtStrategy.isValid(value),
            [
                ['a LocalExtension instance', new LocalExtension('ext.id', '/path')],
            ],
        );

        testMany(
            'should not accept',
            (value) => !localExtStrategy.isValid(value),
            [
                ['an object with type !== \'local\'', {id: 'ext.id', type: 'not-local'}],
                [
                    'an object with type === \'local\' that\'s not a LocalExtension instance',
                    {id: 'ext.id', type: 'local'},
                ],
            ],
        );

    });

    suite('install()', () => {

        let localExtsDir: tmp.SynchrounousResult;
        let extsDir: tmp.SynchrounousResult;

        setup(() => {
            localExtsDir = tmp.dirSync({ unsafeCleanup: true });
            extsDir = tmp.dirSync({ unsafeCleanup: true });

            configMock.reset();
            configMock
                .setup((x) => x.extensionDirectory)
                .returns(() => extsDir.name);
        });

        teardown(() => {
            localExtsDir.removeCallback();
            extsDir.removeCallback();
        });

        test('should copy extension to extension directory', async () => {
            const extDir = path.join(localExtsDir.name, 'testext');
            await fs.mkdirp(extDir);
            await fs.writeFile(
                path.join(extDir, 'package.json'),
                JSON.stringify({
                    name: 'ext',
                    publisher: 'local',
                    version: '1.0.0',
                }),
            );
            await fs.writeFile(
                path.join(extDir, 'extension.js'),
                'console.log("Hello world");',
            );
            const ext = new LocalExtension('local.ext', extDir);

            await localExtStrategy.install(ext);

            const targetExtDir = path.join(extsDir.name, 'local.ext');
            assertFilesEqual(path.join(extDir, 'package.json'), path.join(targetExtDir, 'package.json'));
            assertFilesEqual(path.join(extDir, 'extension.js'), path.join(targetExtDir, 'extension.js'));
        });

    });

});
