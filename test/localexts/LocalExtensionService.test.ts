import * as assert from 'assert';
import { mock, verify, when } from 'ts-mockito';
import Provider from '../../src/localexts/Provider';
import LocalExtensionService from '../../src/localexts/LocalExtensionService';
import Installer from '../../src/localexts/Installer';

suite("LocalExtensionService.syncLocalExtensions", () => {

    test("should install missing extensions", () => {
        const availableExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' }
        ];

        const provider = mock(Provider);
        when(provider.listAvailableExtensions()).thenReturn(
            Promise.resolve(availableExts)
        );
        when(provider.listInstalledExtensions()).thenReturn(
            Promise.resolve([])
        );
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            provider,
            installer
        );

        return localExtensionService.syncLocalExtensions().then(() => {
            verify(installer.install(availableExts)).once();
        });
    });
});
