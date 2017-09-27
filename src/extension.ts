import * as path from 'path';
import * as vscode from 'vscode';

import FileExtensionConfig from './config/FileExtensionConfig';
import IConfiguration from './config/IConfiguration';
import VSCodeConfig from './config/VSCodeConfig';
import ExtensionInstaller from './control/ExtensionInstaller';
import ExtensionService from './control/ExtensionService';
import DefaultPaths from './DefaultPaths';
import ExtensionControl from './ExtensionControl';
import VSCodeExtensionProvider from './installedextensions/VSCodeExtensionProvider';
import LocalExtensionEntryParser from './localexts/LocalExtensionEntryParser';
import LocalExtensionInstallStrategy from './localexts/LocalExtensionInstallStrategy';

type CommandCallback = (...args: any[]) => any;

export function activate(context: vscode.ExtensionContext) {
    const config: IConfiguration = new VSCodeConfig(
        vscode.workspace,
        new DefaultPaths(process.platform),
    );
    const extensionControl = new ExtensionControl(
        new VSCodeExtensionProvider(
            vscode.env.appRoot,
            vscode.extensions,
        ),
        new FileExtensionConfig(
            config,
            [
                new LocalExtensionEntryParser(),
            ],
        ),
        new ExtensionService(),
        new ExtensionInstaller(
            [
                new LocalExtensionInstallStrategy(
                    config,
                ),
            ],
        ),
    );

    registerCommand(context, 'extensionControl.installMissingExtensions', async () => {
        await extensionControl.installMissingExtensions();
    });
}

export function deactivate() {
    console.log('deactivate');
}

function registerCommand(context: vscode.ExtensionContext, command: string, callback: CommandCallback) {
    const disposable = vscode.commands.registerCommand(command, callback);
    context.subscriptions.push(disposable);
}
