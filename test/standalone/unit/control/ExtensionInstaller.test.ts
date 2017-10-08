import * as assert from 'assert';
import { It, Mock, Times } from 'typemoq';

import { fail } from '../../../helper';

import IConfiguredExtension from 'config/IConfiguredExtension';
import ExtensionInstaller from 'control/ExtensionInstaller';
import { IGenericInstallerStrategy } from 'control/IInstallerStrategy';

suite('ExtensionInstaller.installExtensions()', () => {

    const installerStrategy1 = Mock.ofType<IGenericInstallerStrategy>();
    const installerStrategy2 = Mock.ofType<IGenericInstallerStrategy>();
    const extInstaller = new ExtensionInstaller([
        installerStrategy1.object,
        installerStrategy2.object,
    ]);

    setup(() => {
        installerStrategy1.reset();
        installerStrategy1
            .setup((x) => x.isValid(It.isObjectWith<IConfiguredExtension>({ type: 'test1' })))
            .returns(() => true);

        installerStrategy2.reset();
        installerStrategy2
            .setup((x) => x.isValid(It.isObjectWith<IConfiguredExtension>({ type: 'test2' })))
            .returns(() => true);
    });

    test('should do nothing for empty argument list', async () => {
        await extInstaller.installExtensions([]);

        installerStrategy1.verify((x) => x.install(It.isAny()), Times.never());
        installerStrategy2.verify((x) => x.install(It.isAny()), Times.never());
    });

    test('should call appropriate installer for each element', async () => {
        await extInstaller.installExtensions([
            { id: 'ext1', type: 'test1' },
            { id: 'ext2', type: 'test2' },
            { id: 'ext3', type: 'test1' },
            { id: 'ext4', type: 'test2' },
        ]);

        installerStrategy1.verify((x) => x.install(It.isValue({ id: 'ext1', type: 'test1' })), Times.once());
        installerStrategy2.verify((x) => x.install(It.isValue({ id: 'ext2', type: 'test2' })), Times.once());
        installerStrategy1.verify((x) => x.install(It.isValue({ id: 'ext3', type: 'test1' })), Times.once());
        installerStrategy2.verify((x) => x.install(It.isValue({ id: 'ext4', type: 'test2' })), Times.once());
    });

    test('should throw an error for unknown types', async () => {
        try {
            await extInstaller.installExtensions([
                { id: 'ext1', type: 'test3' },
            ]);
        } catch (e) {
            // pass
            return;
        }
        fail('should throw error for unknown type');
    });

    test('should return array of successes and failures', async () => {
        installerStrategy1
            .setup((x) => x.install(It.isObjectWith<IConfiguredExtension>({ id: 'ok' })))
            .returns(() => Promise.resolve());
        installerStrategy1
            .setup((x) => x.install(It.isObjectWith<IConfiguredExtension>({ id: 'error' })))
            .returns(() => Promise.reject(new Error('error message')));

        const results = await extInstaller.installExtensions([
            { type: 'test1', id: 'ok' },
            { type: 'test1', id: 'error' },
        ]);

        assert.deepEqual(results, [
            { successful: true, ext: { id: 'ok', type: 'test1' } },
            { successful: false, ext: { id: 'error', type: 'test1' }, error: new Error('error message') },
        ]);
    });

});
