import * as assert from 'assert';

import IConfiguredExtension from '../../../../src/config/IConfiguredExtension';
import ExtensionService from '../../../../src/control/ExtensionService';
import IInstalledExtension from '../../../../src/installedextensions/IInstalledExtension';

suite('ExtensionService.selectExtensionsToInstall()', () => {

    const extService = new ExtensionService();

    test('should return empty list if no configured extensions', async () => {
        const configuredExts: IConfiguredExtension[] = [];
        const installedExts = [
            {id: 'ext1', extensionPath: 'ext1Path'},
        ];

        const extsToInstall = await extService.selectExtensionsToInstall(configuredExts, installedExts);

        assert.deepEqual(extsToInstall, configuredExts);
    });

    test('should return all configured extensions if there are no installed extensions', async () => {
        const configuredExts = [
            {id: 'ext1', type: 'test'},
        ];
        const installedExts: IInstalledExtension[] = [];

        const extsToInstall = await extService.selectExtensionsToInstall(configuredExts, installedExts);

        assert.deepEqual(extsToInstall, configuredExts);
    });

    test('should return configured extensions that are not the list of installed extensions', async () => {
        const configuredExts = [
            {id: 'ext1', type: 'test'},
            {id: 'ext2', type: 'test'},
        ];
        const installedExts = [
            {id: 'ext1', extensionPath: 'ext1Path'},
            {id: 'ext3', extensionPath: 'ext3Path'},
        ];

        const extsToInstall = await extService.selectExtensionsToInstall(configuredExts, installedExts);

        assert.deepEqual(extsToInstall, [
            {id: 'ext2', type: 'test'},
        ]);
    });

});
