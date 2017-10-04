import IConfiguration from 'config/IConfiguration';
import DefaultPaths from 'DefaultPaths';
import { IWorkspace, IWorkspaceConfiguration } from 'vscodeapi';

export default class VSCodeConfig implements IConfiguration {

    constructor(
        private readonly workspaceAPI: IWorkspace,
        private readonly defaultPaths: DefaultPaths,
    ) {}

    public get userDirectory(): string {
        return this.getConfigValue('userDirectory', this.defaultUserDirectory);
    }

    public get extensionDirectory(): string {
        return this.getConfigValue('extensionDirectory', this.defaultExtensionDirectory);
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

    private getConfigValue(name: string, defaultValue: string): string {
        const value: string | null = this.config.get(name);
        if (!value) {
            return defaultValue;
        } else {
            return value;
        }
    }

}
