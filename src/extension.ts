import './init-import-paths';

import axios from 'axios';
import * as path from 'path';
import * as vscode from 'vscode';

import FileExtensionConfig from 'config/FileExtensionConfig';
import IConfiguration from 'config/IConfiguration';
import VSCodeConfig from 'config/VSCodeConfig';
import ExtensionInstaller from 'control/ExtensionInstaller';
import ExtensionService from 'control/ExtensionService';
import DefaultPaths from 'DefaultPaths';
import ExtensionControl from 'ExtensionControl';
import VSCodeExtensionProvider from 'installedextensions/VSCodeExtensionProvider';
import LocalExtensionEntryParser from 'localexts/LocalExtensionEntryParser';
import LocalExtensionInstallStrategy from 'localexts/LocalExtensionInstallStrategy';
import MarketplaceDownloader from 'marketplace/MarketplaceDownloader';
import MarketplaceEntryParser from 'marketplace/MarketplaceEntryParser';
import MarketplaceInstallStrategy from 'marketplace/MarketplaceInstallStrategy';
import MarketplaceService from 'marketplace/MarketplaceService';
import VsixInstaller from 'marketplace/VsixInstaller';

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
                new MarketplaceEntryParser(),
            ],
        ),
        new ExtensionService(),
        new ExtensionInstaller(
            [
                new LocalExtensionInstallStrategy(
                    config,
                ),
                new MarketplaceInstallStrategy(
                    new MarketplaceService(
                        axios,
                    ),
                    new MarketplaceDownloader(
                        axios,
                    ),
                    new VsixInstaller(
                        config,
                    ),
                ),
            ],
        ),
    );

    registerCommand(context, 'extensionControl.installMissingExtensions', async () => {
        await extensionControl.installMissingExtensions();
        await vscode.window.showInformationMessage('Missing extensions installed');
    });
}

export function deactivate() {
    console.log('deactivate');
}

function registerCommand(context: vscode.ExtensionContext, command: string, callback: CommandCallback) {
    const disposable = vscode.commands.registerCommand(command, callback);
    context.subscriptions.push(disposable);
}
