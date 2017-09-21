import * as path from 'path';
import * as vscode from 'vscode';
import DefaultPaths from './DefaultPaths';
import Installer from './localexts/Installer';
import LocalExtensionService from './localexts/LocalExtensionService';
import Provider from './localexts/Provider';

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

    const disposable = vscode.commands.registerCommand('extensionControl.syncLocalExtensions', async () => {
        try {
            await localExtensionService.syncLocalExtensions();
            vscode.window.showInformationMessage('Local extensions synchronized.');
        } catch (error) {
            vscode.window.showErrorMessage('Failed: ' + error);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('deactivate');
}
