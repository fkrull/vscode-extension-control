import * as fs from 'fs-extra';
import * as path from 'path';

import IConfiguration from '../config/IConfiguration';
import IConfiguredExtension from '../config/IConfiguredExtension';
import IInstallerStrategy from '../control/IInstallerStrategy';
import LocalExtension from './LocalExtension';

export default class LocalExtensionInstallStrategy implements IInstallerStrategy<LocalExtension> {
    private readonly config: IConfiguration;

    constructor(config: IConfiguration) {
        this.config = config;
    }

    public isValid(ext: IConfiguredExtension): boolean {
        return ext instanceof LocalExtension;
    }
    public async install(ext: LocalExtension): Promise<void> {
        const extInstallDir = path.join(this.config.extensionDirectory, ext.id);
        await fs.copy(
            ext.extensionPath,
            extInstallDir,
        );
    }

}
