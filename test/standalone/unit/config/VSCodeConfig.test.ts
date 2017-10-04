import * as assert from 'assert';
import { Mock } from 'typemoq';

import VSCodeConfig from 'config/VSCodeConfig';
import DefaultPaths from 'DefaultPaths';
import { IWorkspace, IWorkspaceConfiguration } from 'vscodeapi';

suite('VSCodeConfig', () => {

    const workspaceMock = Mock.ofType<IWorkspace>();
    const configMock = Mock.ofType<IWorkspaceConfiguration>();
    const pathsMock = Mock.ofType<DefaultPaths>();
    const vsCodeConfig = new VSCodeConfig(workspaceMock.object, pathsMock.object);

    setup(() => {
        workspaceMock
            .setup((x) => x.getConfiguration('extensionControl'))
            .returns(() => configMock.object);
        configMock.reset();
        pathsMock.reset();
    });

    suite('userDirectory', () => {

        test('should return config value', () => {
            configMock
                .setup((x) => x.get('userDirectory'))
                .returns(() => 'returned userDirectory');

            const returnedPath = vsCodeConfig.userDirectory;

            assert.equal(returnedPath, 'returned userDirectory');
        });

        test('should return default value if config value is null', () => {
            configMock
                .setup((x) => x.get<string | null>('userDirectory'))
                .returns(() => null);
            pathsMock
                .setup((x) => x.getUserDirectory())
                .returns(() => 'defaultPath');

            const returnedPath = vsCodeConfig.userDirectory;

            assert.equal(returnedPath, 'defaultPath');
        });

        test('should return default value if config value is the empty string', () => {
            configMock
                .setup((x) => x.get<string | null>('userDirectory'))
                .returns(() => '');
            pathsMock
                .setup((x) => x.getUserDirectory())
                .returns(() => 'defaultPath');

            const returnedPath = vsCodeConfig.userDirectory;

            assert.equal(returnedPath, 'defaultPath');
        });

    });

    suite('extensionDirectory', () => {

        test('should return config value', () => {
            configMock
                .setup((x) => x.get('extensionDirectory'))
                .returns(() => 'returned extensionDirectory');

            const returnedPath = vsCodeConfig.extensionDirectory;

            assert.equal(returnedPath, 'returned extensionDirectory');
        });

        test('should return default value if config value is null', () => {
            configMock
                .setup((x) => x.get<string | null>('extensionDirectory'))
                .returns(() => null);
            pathsMock
                .setup((x) => x.getExtensionDirectory())
                .returns(() => 'defaultPath');

            const returnedPath = vsCodeConfig.extensionDirectory;

            assert.equal(returnedPath, 'defaultPath');
        });

        test('should return default value if config value is the empty string', () => {
            configMock
                .setup((x) => x.get<string | null>('extensionDirectorry'))
                .returns(() => '');
            pathsMock
                .setup((x) => x.getExtensionDirectory())
                .returns(() => 'defaultPath');

            const returnedPath = vsCodeConfig.extensionDirectory;

            assert.equal(returnedPath, 'defaultPath');
        });

    });

});
