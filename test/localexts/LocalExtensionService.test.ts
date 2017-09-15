import * as assert from 'assert';
import { mock, verify, when, instance, deepEqual } from 'ts-mockito';
import Provider from '../../src/localexts/Provider';
import LocalExtensionService from '../../src/localexts/LocalExtensionService';
import Installer from '../../src/localexts/Installer';
import LocalExtension from '../../src/localexts/LocalExtension';

suite("LocalExtensionService.syncLocalExtensions", () => {

    test("should install all available extensions if none are installed", () => {
        const availableExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
        ];
        const provider = givenExtensions(availableExts, []);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer)
        );

        return localExtensionService.syncLocalExtensions().then(() => {
            verify(installer.install(deepEqual(availableExts))).once();
            verify(installer.uninstall(deepEqual([]))).once();
        });
    });

    test("should install only missing extensions", () => {
        const availableExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
            { name: 'ext3', path: 'path3' },
        ];
        const installedExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext3', path: 'path3' },
        ]
        const delta = [{ name: 'ext2', path: 'path2' }]
        const provider = givenExtensions(availableExts, installedExts);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer)
        );

        return localExtensionService.syncLocalExtensions().then(() => {
            verify(installer.install(deepEqual(delta))).once();
            verify(installer.uninstall(deepEqual([]))).once();
        });
    });

    test("should uninstall all extensions if none are available", () => {
        const installedExts = [
            { name: 'ext1', path: 'path1' },
            { name: 'ext2', path: 'path2' },
        ];
        const provider = givenExtensions([], installedExts);
        const installer = mock(Installer);
        const localExtensionService = new LocalExtensionService(
            instance(provider),
            instance(installer)
        );

        return localExtensionService.syncLocalExtensions().then(() => {
            verify(installer.install(deepEqual([]))).once();
            verify(installer.uninstall(deepEqual(installedExts))).once();
        });
    });

});


function givenExtensions(available: LocalExtension[], installed: LocalExtension[]): Provider {
    const provider = mock(Provider);
    when(provider.listAvailableExtensions()).thenReturn(
        Promise.resolve(available)
    );
    when(provider.listInstalledExtensions()).thenReturn(
        Promise.resolve(installed)
    );
    return provider;
}
