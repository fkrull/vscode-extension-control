import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import { assertFilesEqual, assertIsSupersetOf, IntegrationTestContext } from '../helper';

import { _setMockExtensionList } from '../../src/extension';
import { IExtension } from '../../src/vscodeapi';

suite('extensionControl.installMissingExtensions', () => {

    const testctx = new IntegrationTestContext(path.join(__dirname, '..', '..', '..'));

    setup(async () => {
        await testctx.setup();
        _setMockExtensionList(
            vscode.extensions.all.filter((ext) => !ext.extensionPath.startsWith(testctx.extDir)),
        );
    });

    teardown(async () => {
        await testctx.teardown();
    });

    test('should install missing local extension in extension list', async () => {
        const pkgJSON = {
            engines: {
                vscode: '^1.16.0',
            },
            name: 'installed',
            publisher: 'not',
            version: '0.0.1',
        };
        await testctx.givenSimpleLocalExtension('not-installed', pkgJSON);
        await testctx.givenExtensionList([
            {
                id: 'not.installed',
                path: 'Extensions/not-installed',
                type: 'local',
            },
        ]);

        await vscode.commands.executeCommand('extensionControl.installMissingExtensions');

        const extSrcDir = path.join(testctx.userDir, 'Extensions', 'not-installed');
        const extDir = path.join(testctx.extDir, 'not.installed');
        assertFilesEqual(path.join(extDir, 'package.json'), path.join(extSrcDir, 'package.json'));
    });

    test('should install extension from Marketplace', async () => {
        await testctx.givenExtensionList([
            'ms-vscode.wordcount',
        ]);

        await vscode.commands.executeCommand('extensionControl.installMissingExtensions');

        const dirs = (await fs.readdir(testctx.extDir)).filter((elem) => elem.startsWith('ms-vscode.wordcount-'));
        for (const subdir of dirs) {
            const pkgJSON = await fs.readJSON(path.join(testctx.extDir, subdir, 'package.json'));
            assertIsSupersetOf(pkgJSON, {
                name: 'wordcount',
                displayName: 'Word Count',
                publisher: 'ms-vscode',
                repository: {
                    type: 'git',
                    url: 'https://github.com/Microsoft/vscode-wordcount.git',
                },
            });
            assert.equal(subdir, `ms-vscode.wordcount-${pkgJSON.version}`);
            const mainFile = (pkgJSON.main as string).split('/');
            assert(
                await fs.exists(path.join(testctx.extDir, subdir, ...mainFile)),
                'extension main file should exist',
            );
            return;
        }
        assert.fail(undefined, undefined, 'extension should be installed');
    });

});

suite('extensionControl.installMissingExtensions', () => {

    const testctx = new IntegrationTestContext(path.join(__dirname, '..', '..', '..'));

    setup(async () => {
        await testctx.setup();
        const coreExts: Array<IExtension<any>> = vscode.extensions.all.filter(
            (ext) => !ext.extensionPath.startsWith(testctx.extDir));
        _setMockExtensionList(
            coreExts.concat({
                extensionPath: path.join(testctx.extDir, 'already.installed'),
                id: 'already.installed',
            }),
        );
    });

    teardown(async () => {
        await testctx.teardown();
    });

    test('should not install extension that is already installed', async () => {
        const pkgJSON = {
            engines: {
                vscode: '^1.16.0',
            },
            name: 'installed',
            publisher: 'already',
            version: '0.0.1',
        };
        await testctx.givenSimpleLocalExtension('already-installed', pkgJSON);
        await testctx.givenExtensionList([
            {
                id: 'already.installed',
                path: 'Extensions/already-installed',
                type: 'local',
            },
        ]);

        await vscode.commands.executeCommand('extensionControl.installMissingExtensions');

        assert.deepEqual(await fs.readdir(testctx.extDir), []);
    });
});
