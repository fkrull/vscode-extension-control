import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import {
    assertDirectoryContents,
    assertFileExists,
    assertFilesEqual,
    assertIsSupersetOf,
} from '../helper';
import { IntegrationTestContext } from '../helper/integration';

async function givenExtensionList(userDir: string, exts: any[]) {
    await fs.writeJSON(
        path.join(userDir, 'extensions.json'),
        exts,
    );
}

async function givenSimpleLocalExtension(userDir: string, folder: string, json: any) {
    await fs.mkdirp(path.join(userDir, 'Extensions', folder));
    await fs.writeJSON(
        path.join(userDir, 'Extensions', folder, 'package.json'),
        json,
    );
}

suite('command: \'installMissingExtensions\'', function() {

    this.timeout(10000);
    this.slow(1500);

    const testctx = new IntegrationTestContext(path.join(__dirname, '..', '..', '..'));

    setup(async () => {
        await testctx.setup();
        testctx.givenAdditionalInstalledExtensions(
            {
                id: 'already.installed',
                extensionPath: path.join(testctx.extDir, 'already.installed'),
            },
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
        await givenSimpleLocalExtension(testctx.userDir, 'not-installed', pkgJSON);
        await givenExtensionList(testctx.userDir, [
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

    test('should not install extension that is already installed', async () => {
        const pkgJSON = {
            name: 'installed',
            publisher: 'already',
            version: '0.0.1',
        };
        await givenSimpleLocalExtension(testctx.userDir, 'already-installed', pkgJSON);
        await givenExtensionList(testctx.userDir, [
            {
                id: 'already.installed',
                path: 'Extensions/already-installed',
                type: 'local',
            },
        ]);

        await vscode.commands.executeCommand('extensionControl.installMissingExtensions');

        assertDirectoryContents(testctx.extDir, []);
    });

    test('should install extension from Marketplace', async () => {
        await givenExtensionList(testctx.userDir, [
            'ms-vscode.wordcount',
        ]);

        await vscode.commands.executeCommand('extensionControl.installMissingExtensions');

        const dirs = (await fs.readdir(testctx.extDir)).filter((elem) => elem.startsWith('ms-vscode.wordcount-'));
        assert.equal(dirs.length, 1);
        const subdir = dirs[0];
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
        const mainFilePath = `${path.join(testctx.extDir, subdir, ...mainFile)}.js`;
        assertFileExists(mainFilePath);
    });

});
