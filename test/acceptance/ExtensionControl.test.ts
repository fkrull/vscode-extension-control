import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import { _setMockExtensionList } from '../../src/extension';
import { IExtension } from '../../src/vscodeapi';

class TestContext {
    public readonly extDir: string;
    public readonly userDir: string;

    constructor(baseDir: string) {
        this.extDir = path.join(baseDir, '.integration', 'extensions');
        this.userDir = path.join(baseDir, '.integration', 'data', 'User');
    }

    public async setup() {
        await this.teardown();
        const config = vscode.workspace.getConfiguration('extensionControl');
        await Promise.all([
            config.update('extensionDirectory', this.extDir, vscode.ConfigurationTarget.Global),
            config.update('userDirectory', this.userDir, vscode.ConfigurationTarget.Global),
        ]);
    }

    public async teardown() {
        await Promise.all([
            fs.emptyDir(this.extDir),
            fs.emptyDir(this.userDir),
        ]);
    }

    public async givenExtensionList(exts: any[]) {
        await fs.writeJSON(
            path.join(this.userDir, 'extensions.json'),
            exts,
        );
    }

    public async givenLocalExtension(folder: string, json: any) {
        await fs.mkdirp(path.join(this.userDir, 'Extensions', folder));
        await fs.writeJSON(
            path.join(this.userDir, 'Extensions', folder, 'package.json'),
            json,
        );
    }
}

suite('extensionControl.installMissingExtensions', () => {

    const testctx = new TestContext(path.join(__dirname, '..', '..', '..'));

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
        await testctx.givenLocalExtension('not-installed', pkgJSON);
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

    const testctx = new TestContext(path.join(__dirname, '..', '..', '..'));

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
        await testctx.givenLocalExtension('already-installed', pkgJSON);
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

function assertIsSupersetOf(actual: object, expected: object) {
    Object.getOwnPropertyNames(expected).forEach((prop) => {
        assert.deepEqual(actual[prop], expected[prop]);
    });
}

function assertFilesEqual(a: string, b: string) {
    [a, b].map((filePath) => {
        try {
            return fs.readFileSync(filePath).toString();
        } catch (e) {
            assert.fail(undefined, undefined, `exception thrown: ${e}`);
        }
    }).reduce((s1, s2) => {
        if (s1 === undefined) {
            return s2;
        } else if (s2 === undefined) {
            return s1;
        }
        assert.equal(s1, s2);
        return s2;
    });
}
