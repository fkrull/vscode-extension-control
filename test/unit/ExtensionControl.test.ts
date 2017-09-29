import * as typemoq from 'typemoq';

import IConfiguredExtension from '../../src/config/IConfiguredExtension';
import IExtensionConfig from '../../src/config/IExtensionConfig';
import IExtensionInstaller from '../../src/control/IExtensionInstaller';
import IExtensionService from '../../src/control/IExtensionService';
import ExtensionControl from '../../src/ExtensionControl';
import IInstalledExtension from '../../src/installedextensions/IInstalledExtension';
import IInstalledExtensionProvider from '../../src/installedextensions/IInstalledExtensionProvider';

suite('ExtensionControl.installMissingExtensions()', () => {

    const installedExtProviderMock = typemoq.Mock.ofType<IInstalledExtensionProvider>();
    const extConfigMock = typemoq.Mock.ofType<IExtensionConfig>();
    const extServiceMock = typemoq.Mock.ofType<IExtensionService>();
    const extInstallerMock = typemoq.Mock.ofType<IExtensionInstaller>();
    const extensionControl = new ExtensionControl(
        installedExtProviderMock.object,
        extConfigMock.object,
        extServiceMock.object,
        extInstallerMock.object,
    );

    setup(() => {
        installedExtProviderMock.reset();
        extConfigMock.reset();
        extInstallerMock.reset();
        extServiceMock.reset();
    });

    test('should install missing extensions', async () => {
        const installedExts: IInstalledExtension[] = [ {id: 'ext.2', extensionPath: 'path'} ];
        const configuredExts: IConfiguredExtension[] = [
            {id: 'ext.1', type: 'test'},
            {id: 'ext.2', type: 'test'},
        ];
        const expectedExts: IConfiguredExtension[] = [
            {id: 'ext.1', type: 'test'},
        ];
        installedExtProviderMock
            .setup((x) => x.getInstalledExtensions())
            .returns(() => Promise.resolve(installedExts));
        extConfigMock
            .setup((x) => x.getConfiguredExtensions())
            .returns(() => Promise.resolve(configuredExts));
        extServiceMock
            .setup((x) => x.selectExtensionsToInstall(configuredExts, installedExts))
            .returns(() => Promise.resolve(expectedExts));
        extInstallerMock
            .setup((x) => x.installExtensions(expectedExts))
            .verifiable(typemoq.Times.exactly(1));

        await extensionControl.installMissingExtensions();

        extInstallerMock.verifyAll();
    });

});
