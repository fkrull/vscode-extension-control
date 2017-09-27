import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

class TestContext {
    public readonly extDir: string;
    public readonly userDir: string;

    constructor(baseDir: string) {
        this.extDir = path.join(baseDir, '.integration', 'extensions');
        this.userDir = path.join(baseDir, '.integration', 'data', 'User');
    }

    public async setup() {
        await this.teardown();
        await fs.writeFile(
            path.join(this.userDir, 'settings.json'),
            JSON.stringify({
                'extensionControl.extensionDirectory': this.extDir,
                'extensionControl.userDirectory': this.userDir,
            }),
        );
    }

    public async teardown() {
        await Promise.all([
            fs.emptyDir(this.extDir),
            fs.emptyDir(this.userDir),
        ]);
    }

    public givenExtensionList(exts: any[]) {
        return fs.writeFile(
            path.join(this.userDir, 'extensions.json'),
            JSON.stringify(exts),
        );
    }

    public async givenLocalExtension(folder: string, json: any) {
        await fs.mkdirp(path.join(this.userDir, 'Extensions', folder));
        await fs.writeFile(
            path.join(this.userDir, 'Extensions', folder, 'package.json'),
            JSON.stringify(json),
        );
    }
}

suite('extensionControl.installMissingExtensions', () => {

    const testctx = new TestContext(path.join(__dirname, '..', '..', '..'));

    suiteSetup(() => {
        return testctx.setup();
    });

    suiteTeardown(() => {
        return testctx.teardown();
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
        await testctx.givenExtensionList([
            {
                id: 'not.installed',
                path: 'Extensions/not-installed',
                type: 'local',
            },
        ]);
        testctx.givenLocalExtension('not-installed', pkgJSON);

        await vscode.commands.executeCommand('extensionControl.installMissingExtensions');

        const exts = vscode.extensions.all.filter((ext) => ext.extensionPath.startsWith(testctx.extDir));
        assert.equal(exts.length, 1);
        const testext = exts[0];
        assert.equal(testext.id, 'not.installed');
        assert.equal(testext.extensionPath, path.join(testctx.extDir, 'not.installed'));
        assertIsSupersetOf(testext.packageJSON, pkgJSON);
    });

});

function assertIsSupersetOf(actual: object, expected: object) {
    Object.getOwnPropertyNames(expected).forEach((prop) => {
        assert.deepEqual(actual[prop], expected[prop]);
    });
}
