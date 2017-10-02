var vscode = require('vscode');

function activate(context) {
    var disposable = vscode.commands.registerCommand('helloworld.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
