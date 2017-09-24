import * as path from 'path';
import * as vscode from 'vscode';
import DefaultPaths from './DefaultPaths';

type CommandCallback = (...args: any[]) => any;

export function activate(context: vscode.ExtensionContext) {
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
