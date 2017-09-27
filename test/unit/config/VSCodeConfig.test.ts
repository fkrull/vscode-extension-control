import * as assert from 'assert';
import { Mock } from 'typemoq';

import VSCodeConfig from '../../../src/config/VSCodeConfig';
import DefaultPaths from '../../../src/DefaultPaths';
import { IWorkspace, IWorkspaceConfiguration } from '../../../src/vscodeapi';

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

    test('userDirectory should return value from config.get', () => {
        pathsMock
            .setup((x) => x.getUserDirectory())
            .returns(() => 'defaultPath');
        configMock
            .setup((x) => x.get('userDirectory', 'defaultPath'))
            .returns(() => 'returned userDirectory');

        const returnedPath = vsCodeConfig.userDirectory;

        assert.equal(returnedPath, 'returned userDirectory');
    });

    test('extensionDirectory should return value from config.get', () => {
        pathsMock
            .setup((x) => x.getExtensionDirectory())
            .returns(() => 'defaultPath');
        configMock
            .setup((x) => x.get('extensionDirectory', 'defaultPath'))
            .returns(() => 'returned extensionDirectory');

        const returnedPath = vsCodeConfig.extensionDirectory;

        assert.equal(returnedPath, 'returned extensionDirectory');
    });

});
