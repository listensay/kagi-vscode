const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    console.log("Kagi Assistant extension is now active!");

    const provider = new AIViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("KagiAssistantView", provider, {
            webviewOptions: { retainContextWhenHidden: true },
        })
    );

    console.log("Webview View Provider registered!");
}

class AIViewProvider {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }

    resolveWebviewView(webviewView) {
        console.log("resolveWebviewView called!");
        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    }

    getHtmlForWebview(webview) {
        // 获取 HTML 文件路径
        const htmlPath = path.join(this.extensionUri.fsPath, '/src/webview.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // 替换 CSS 和 JS 文件的路径
        htmlContent = htmlContent.replace(
            /href="styles\.css"/g,
            `href="${webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, '/src/styles.css'))}"`
        );

        return htmlContent;
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
