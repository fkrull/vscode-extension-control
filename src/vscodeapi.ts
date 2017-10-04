import * as vscode from 'vscode';

export interface IExtension<T> {
    readonly id: string;
    readonly extensionPath: string;
}

export interface IExtensions {
    readonly all: Array<IExtension<any>>;
}

export interface IEnv {
    readonly appRoot: string;
}

export interface IWorkspaceConfiguration {
    get<T>(section: string, defaultValue: T): T;
}

export interface IWorkspace {
    getConfiguration(section?: string, resource?: vscode.Uri): IWorkspaceConfiguration;
}

export interface IVSCodeAPI {
    readonly extensions: IExtensions;
    readonly env: IEnv;
    readonly workspace: IWorkspace;
}
