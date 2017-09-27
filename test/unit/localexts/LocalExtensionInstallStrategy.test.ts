import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';
import { Mock } from 'typemoq';

import IConfiguration from '../../../src/config/IConfiguration';
import IConfiguredExtension from '../../../src/config/IConfiguredExtension';
import LocalExtension from '../../../src/localexts/LocalExtension';
import LocalExtensionInstallStrategy from '../../../src/localexts/LocalExtensionInstallStrategy';

suite('LocalExtensionInstallStrategy.isValid', () => {

    const configMock = Mock.ofType<IConfiguration>();
    const localExtStrategy = new LocalExtensionInstallStrategy(configMock.object);

    const valid: Array<[string, IConfiguredExtension]> = [
        ['a LocalExtension instance', new LocalExtension('ext.id', '/path')],
    ];
    const invalid: Array<[string, IConfiguredExtension]> = [
        ['an object with type !== \'local\'', {id: 'ext.id', type: 'not-local'}],
        ['an object with type === \'local\' that\'s not a LocalExtension instance', {id: 'ext.id', type: 'local'}],
    ];

    for (const [message, value] of valid) {
        test(`should accept '${message}'`, () => {
            assert(localExtStrategy.isValid(value));
        });
    }

    for (const [message, value] of invalid) {
        test(`should not accept '${message}'`, () => {
            assert(!localExtStrategy.isValid(value));
        });
    }

});

suite('LocalExtensionInstallStrategy.install', () => {

    let localExtsDir: tmp.SynchrounousResult;
    let extsDir: tmp.SynchrounousResult;
    const configMock = Mock.ofType<IConfiguration>();
    const localExtStrategy = new LocalExtensionInstallStrategy(configMock.object);

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

function assertFilesEqual(a: string, b: string) {
    [a, b].map((filePath) => {
        try {
            return fs.readFileSync(filePath).toString();
        } catch (e) {
            assert.fail(undefined, undefined, `exception thrown: ${e}`);
        }
    }).reduce((s1, s2) => {
        if (s1 === undefined) {
            return s2;
        } else if (s2 === undefined) {
            return s1;
        }
        assert.equal(s1, s2);
        return s2;
    });
}
