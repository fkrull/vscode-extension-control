import * as assert from 'assert';
import * as typemoq from 'typemoq';

import VSCodeExtensionProvider from '../../../src/installedextensions/VSCodeExtensionProvider';
import { IEnv, IExtensions } from '../../../src/vscodeapi';

suite('VSCodeExtensionProvider.getInstalledExtensions()', () => {

    const appRoot = 'appRoot';
    const extsMock = typemoq.Mock.ofType<IExtensions>();
    const vscodeExtensionProvider = new VSCodeExtensionProvider(
        appRoot,
        extsMock.object,
    );

    setup(() => {
        extsMock.reset();
    });

    test('should return all extensions from API', async () => {
        const apiExts = [
            { id: 'ext.1', extensionPath: 'extPath1' },
            { id: 'ext.2', extensionPath: 'extPath2' },
        ];
        extsMock
            .setup((x) => x.all)
            .returns(() => apiExts);

        const installedExts = await vscodeExtensionProvider.getInstalledExtensions();

        assert.deepEqual(installedExts, [
            { id: 'ext.1', extensionPath: 'extPath1' },
            { id: 'ext.2', extensionPath: 'extPath2' },
        ]);
    });

    test('should exclude bundled extensions', async () => {
        const apiExts = [
            { id: 'ext.1', extensionPath: 'userexts/ext1' },
            { id: 'ext.2', extensionPath: 'appRoot/ext2' },
        ];
        extsMock
            .setup((x) => x.all)
            .returns(() => apiExts);

        const installedExts = await vscodeExtensionProvider.getInstalledExtensions();

        assert.deepEqual(installedExts, [
            { id: 'ext.1', extensionPath: 'userexts/ext1' },
        ]);
    });

});
