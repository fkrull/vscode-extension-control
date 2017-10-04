import { It, Mock } from 'typemoq';
import * as vscode from 'vscode';

export class ConfigurationContext {
    private readonly originalGetConfiguration = vscode.workspace.getConfiguration;
    private settings: Map<string, any> = new Map();

    public async setup() {
        vscode.workspace.getConfiguration = (section, resource) => this.getConfigMock();
    }

    public async teardown() {
        vscode.workspace.getConfiguration = this.originalGetConfiguration;
    }

    public givenConfiguration(settings: Map<string, any>) {
        this.settings = settings;
    }

    private getConfigMock(): vscode.WorkspaceConfiguration {
        const mock = Mock.ofType<vscode.WorkspaceConfiguration>();
        mock
            .setup((x) => x.get(It.isAny()))
            .returns((name) => {
                if (this.settings.has(name)) {
                    return this.settings.get(name);
                } else {
                    return undefined;
                }
            });
        return mock.object;
    }

}
