import IConfiguration from 'config/IConfiguration';
import DefaultPaths from 'DefaultPaths';
import { IWorkspace, IWorkspaceConfiguration } from 'vscodeapi';

export default class VSCodeConfig implements IConfiguration {

    constructor(
        private readonly workspaceAPI: IWorkspace,
        private readonly defaultPaths: DefaultPaths,
    ) {}

    public get userDirectory(): string {
        return this.config.get('userDirectory', this.defaultUserDirectory);
    }

    public get extensionDirectory(): string {
        return this.config.get('extensionDirectory', this.defaultExtensionDirectory);
    }

    private get config(): IWorkspaceConfiguration {
        return this.workspaceAPI.getConfiguration('extensionControl');
    }

    private get defaultUserDirectory(): string {
        return this.defaultPaths.getUserDirectory();
    }

    private get defaultExtensionDirectory(): string {
        return this.defaultPaths.getExtensionDirectory();
    }

}
