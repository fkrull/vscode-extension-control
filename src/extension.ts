import * as path from 'path';
import * as vscode from 'vscode';
import DefaultPaths from './DefaultPaths';
import Installer from './localexts/Installer';
import LocalExtensionService from './localexts/LocalExtensionService';
import Provider from './localexts/Provider';

type CommandCallback = (...args: any[]) => any;

export function activate(context: vscode.ExtensionContext) {
    const defaultPaths = new DefaultPaths(process.platform);
    const localExtensionService = new LocalExtensionService(
        new Provider(
            path.join(defaultPaths.getUserDirectory(), 'Extensions'),
            defaultPaths.getExtensionDirectory(),
        ),
        new Installer(
            defaultPaths.getExtensionDirectory(),
        ),
    );

    registerCommand(context, 'extensionControl.syncLocalExtensions', async () => {
        try {
            await localExtensionService.syncLocalExtensions();
            vscode.window.showInformationMessage('Local extensions synchronized.');
        } catch (error) {
            vscode.window.showErrorMessage('Failed: ' + error);
        }
    });

    registerCommand(context, 'extensionControl.installMissingExtensions', async () => {
        console.log('installMissingExtensions');
    });
}

export function deactivate() {
    console.log('deactivate');
}

function registerCommand(context: vscode.ExtensionContext, command: string, callback: CommandCallback) {
    const disposable = vscode.commands.registerCommand(command, callback);
    context.subscriptions.push(disposable);
}
