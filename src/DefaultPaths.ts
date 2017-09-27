import * as os from 'os';
import * as path from 'path';

export default class DefaultPaths {

    constructor(
        private readonly platform: NodeJS.Platform,
    ) {}

    public getUserDirectory(): string {
        return path.join(this.getBaseConfigDir(), 'Code', 'User');
    }

    public getExtensionDirectory(): string {
        return path.join(os.homedir(), '.vscode', 'extensions');
    }

    private getBaseConfigDir(): string {
        switch (this.platform) {
            case 'win32':
            return path.join(os.homedir(), 'AppData', 'Roaming');
            case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support');
            default:
            return path.join(os.homedir(), '.config');
        }
    }
}
