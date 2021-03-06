import { ConfigurationContext } from './ConfigurationContext';
import { ExtensionListContext } from './ExtensionListContext';
import { TestDirectoryContext } from './TestDirectoryContext';

import { IExtension } from 'vscodeapi';

export class IntegrationTestContext {
    private readonly dirs: TestDirectoryContext;
    private readonly exts: ExtensionListContext;
    private readonly cfg: ConfigurationContext;

    constructor() {
        this.dirs = new TestDirectoryContext();
        this.exts = new ExtensionListContext();
        this.cfg = new ConfigurationContext();
    }

    public async setup() {
        await this.dirs.setup();
        await this.exts.setup(this.extDir);
        await this.cfg.setup();
        this.cfg.givenConfiguration(new Map([
            ['userDirectory', this.dirs.userDir],
            ['extensionDirectory', this.dirs.extDir],
        ]));
    }

    public async teardown() {
        await this.cfg.teardown();
        await this.exts.teardown();
        await this.dirs.teardown();
    }

    public get extDir() {
        return this.dirs.extDir;
    }

    public get userDir() {
        return this.dirs.userDir;
    }

    public givenAdditionalInstalledExtensions(...additionalExtensions: Array<IExtension<any>>) {
        this.exts.givenAdditionalInstalledExtensions(...additionalExtensions);
    }

}
