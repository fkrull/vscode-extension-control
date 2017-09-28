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

    setup(() => {
        return testctx.setup();
    });

    teardown(() => {
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
