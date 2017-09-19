import * as assert from 'assert';
import { deepEqual, instance, mock, verify, when } from 'ts-mockito';
import Installer from '../../../src/localexts/Installer';
import LocalExtension from '../../../src/localexts/LocalExtension';
import LocalExtensionService from '../../../src/localexts/LocalExtensionService';
import Provider from '../../../src/localexts/Provider';

suite('LocalExtensionService.syncLocalExtensions', () => {

    test('should install all available extensions if none are installed', async () => {
        const availableExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
        ];
        const provider = givenExtensions(availableExts, []);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer),
        );

        await localExtensionService.syncLocalExtensions();
        verify(installer.install(deepEqual(availableExts))).once();
        verify(installer.uninstall(deepEqual([]))).once();
    });

    test('should install only missing extensions', async () => {
        const availableExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
            { name: 'ext3', path: 'path3' },
        ];
        const installedExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext3', path: 'path3' },
        ];
        const delta = [{ name: 'ext2', path: 'path2' }];
        const provider = givenExtensions(availableExts, installedExts);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer),
        );

        await localExtensionService.syncLocalExtensions();
        verify(installer.install(deepEqual(delta))).once();
        verify(installer.uninstall(deepEqual([]))).once();
    });

    test('should uninstall all extensions if none are available', async () => {
        const installedExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
        ];
        const provider = givenExtensions([], installedExts);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer),
        );

        await localExtensionService.syncLocalExtensions();
        verify(installer.install(deepEqual([]))).once();
        verify(installer.uninstall(deepEqual(installedExts))).once();
    });

    test('should uninstall only unavailable extensions', async () => {
        const availableExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext3', path: 'path3' },
        ];
        const installedExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
            { name: 'ext3', path: 'path3' },
        ];
        const delta = [{ name: 'ext2', path: 'path2' }];
        const provider = givenExtensions(availableExts, installedExts);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer),
        );

        await localExtensionService.syncLocalExtensions();
        verify(installer.install(deepEqual([]))).once();
        verify(installer.uninstall(deepEqual(delta))).once();
    });

    test('should install and uninstall extensions', async () => {
        const availableExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext3', path: 'path3' },
        ];
        const installedExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
        ];
        const provider = givenExtensions(availableExts, installedExts);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer),
        );

        await localExtensionService.syncLocalExtensions();
        verify(installer.install(deepEqual([{ name: 'ext3', path: 'path3' }]))).once();
        verify(installer.uninstall(deepEqual([{ name: 'ext2', path: 'path2' }]))).once();
    });

});

function givenExtensions(available: LocalExtension[], installed: LocalExtension[]): Provider {
    const provider = mock(Provider);
    when(provider.listAvailableExtensions()).thenReturn(
        Promise.resolve(available),
    );
    when(provider.listInstalledExtensions()).thenReturn(
        Promise.resolve(installed),
    );
    return provider;
}
