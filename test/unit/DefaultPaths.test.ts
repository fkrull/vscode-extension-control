import * as assert from 'assert';
import * as os from 'os';
import * as path from 'path';

import DefaultPaths from '../../src/DefaultPaths';

suite('DefaultPaths.getUserDirectory', () => {

    const homeDir = os.homedir();

    test('should get the default VSCode user directory for Windows', () => {
        const paths = new DefaultPaths('win32');

        assert.strictEqual(paths.getUserDirectory(), path.join(homeDir, 'AppData', 'Roaming', 'Code', 'User'));
    });

    test('should get the default VSCode user directory for Linux', () => {
        const paths = new DefaultPaths('linux');

        assert.strictEqual(paths.getUserDirectory(), path.join(homeDir, '.config', 'Code', 'User'));
    });

    test('should get the default VSCode user directory for macOS', () => {
        const paths = new DefaultPaths('darwin');

        assert.strictEqual(
            paths.getUserDirectory(),
            path.join(homeDir, 'Library', 'Application Support', 'Code', 'User'));
    });

});

suite('DefaultPaths.getExtensionDirectory', () => {

    const homeDir = os.homedir();

    test('should get the default VSCode extension directory for Windows', () => {
        const paths = new DefaultPaths('win32');

        assert.strictEqual(paths.getExtensionDirectory(), path.join(homeDir, '.vscode', 'extensions'));
    });

    test('should get the default VSCode extension directory for Linux', () => {
        const paths = new DefaultPaths('linux');

        assert.strictEqual(paths.getExtensionDirectory(), path.join(homeDir, '.vscode', 'extensions'));
    });

    test('should get the default VSCode extension directory for macOS', () => {
        const paths = new DefaultPaths('darwin');

        assert.strictEqual(paths.getExtensionDirectory(), path.join(homeDir, '.vscode', 'extensions'));
    });

});
