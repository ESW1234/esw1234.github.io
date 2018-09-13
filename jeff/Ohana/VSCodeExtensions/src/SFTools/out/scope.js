"use strict";
// Originally from https://github.com/amos402/vscode-scope-bar
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const assert = require("assert");
const ScopeSymbolKind = [
    vscode_1.SymbolKind.Method,
    vscode_1.SymbolKind.Function,
    vscode_1.SymbolKind.Class,
    vscode_1.SymbolKind.Namespace,
    vscode_1.SymbolKind.Module,
    vscode_1.SymbolKind.Constructor
];
class SymbolNode {
    constructor(symbolinfo) {
        this.symbolInfo = symbolinfo;
        this.children = [];
    }
    static createSymbolTree(symbols) {
        let root = new SymbolNode(null);
        let lastNode = root;
        // Some language servers provide a symbol.location.range that covers only the symbol
        // _name_, not the _body_ of the corresponding class/function/etc. Such ranges are not
        // "proper" and are useless for our purpose of checking symbol nesting.
        // If we don't have proper ranges:
        // - we fallback to heuristics in containsNode()
        // - we compute approximate ranges in computeChildrenRange()
        //
        // We detect such cases by checking whether all symbols cover just a single line.
        let properRanges = symbols.find(sym => sym.location.range.start.line != sym.location.range.end.line) != null;
        // XXX they should be sorted by symbol provider, usually
        symbols.forEach(sym => {
            let node = new SymbolNode(sym);
            let curNode = lastNode;
            while (curNode) {
                if (curNode.containsNode(properRanges, node)) {
                    curNode.addNode(node);
                    break;
                }
                curNode = curNode.parent;
            }
            lastNode = node;
        });
        if (!properRanges) {
            root._range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(1e10, 0)); // whole file
            root.computeChildRanges();
        }
        return root;
    }
    computeChildRanges() {
        // Approximate ranges if we don't have real ones.
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            // start: at the first character of the symbol's line (keywords typically appear before a function name)
            let start = new vscode.Position(child.symbolInfo.location.range.start.line, 0);
            // end: either at the start of the node's next sibling (if any), or at the end of the node's parent
            let end;
            if (i + 1 < this.children.length) {
                end = this.children[i + 1].symbolInfo.location.range.start;
            }
            else {
                end = this._range.end;
            }
            child._range = new vscode.Range(start, end);
            child.computeChildRanges();
        }
    }
    get isRoot() {
        return !this.symbolInfo;
    }
    get kind() {
        return this.symbolInfo ? this.symbolInfo.kind : vscode_1.SymbolKind.Null;
    }
    get range() {
        return this._range || this.symbolInfo.location.range;
    }
    addNode(node) {
        this.children.push(node);
        node.parent = this;
    }
    containsNode(properRanges, node) {
        if (this.isRoot) {
            return true;
        }
        else if (properRanges) {
            return this.range.contains(node.symbolInfo.location.range.end);
        }
        else {
            // No proper ranges, fallback to heuristics.
            // Assume no nested namespaces/classes/functions.
            switch (this.kind) {
                case vscode_1.SymbolKind.Namespace:
                    return node.kind != vscode_1.SymbolKind.Namespace;
                case vscode_1.SymbolKind.Class:
                case vscode_1.SymbolKind.Module:
                    return node.kind == vscode_1.SymbolKind.Function ||
                        node.kind == vscode_1.SymbolKind.Method ||
                        node.kind == vscode_1.SymbolKind.Constructor;
                default: // Method | Function | Constructor
                    return false;
            }
        }
    }
    containsPos(pos) {
        if (this.isRoot) {
            return true;
        }
        return this.range.contains(pos);
    }
    getFullName() {
        if (this.isRoot) {
            return 'Global Scope';
        }
        let node = this;
        let nameList = [];
        do {
            nameList.push(node.symbolInfo.name);
            node = node.parent;
        } while (node && !node.isRoot);
        return nameList.reverse().join('.');
    }
    *iterNodes() {
        if (!this.isRoot) {
            yield this;
        }
        for (let child of this.children) {
            yield* child.iterNodes();
        }
    }
    *iterNodesRevers() {
        const len = this.children.length;
        for (let index = len - 1; index >= 0; index--) {
            yield* this.children[index].iterNodesRevers();
        }
        yield this;
    }
}
class CancelUpdateError {
    constructor(message) {
        this.message = message;
        this.name = 'CancelUpdateError';
    }
}
class ScopeFinder {
    constructor(_doc) {
        this._doc = _doc;
        this._updated = true;
    }
    get dummyNode() {
        return ScopeFinder._dummyNode;
    }
    get document() {
        return this._doc;
    }
    getSymbols() {
        assert.equal(vscode.window.activeTextEditor.document, this._doc);
        var res01;
        var promise01 = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', this._doc.uri);
        promise01.then((res) => {
            res01 = res;
        });
        return vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', this._doc.uri);
    }
    getScopeSymbols() {
        return __awaiter(this, void 0, void 0, function* () {
            let symbols = yield this.getSymbols();
            let scopeSymbols = symbols.filter(sym => ScopeSymbolKind.indexOf(sym.kind) != -1);
            return scopeSymbols;
        });
    }
    update() {
        this._updated = true;
    }
    updateNode() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._updated) {
                return;
            }
            if (this._cancelToken) {
                this._cancelToken.cancel();
            }
            this._cancelToken = new vscode.CancellationTokenSource();
            let token = this._cancelToken.token;
            // FIXME: need update flag and CancellationToken both same time?
            this._updated = false;
            let symbols = yield this.getScopeSymbols();
            if (token.isCancellationRequested) {
                throw new CancelUpdateError("CancellationRequested");
            }
            if (symbols.length == 0) {
                this._updated = true;
            }
            this._symbolRoot = SymbolNode.createSymbolTree(symbols);
        });
    }
    getScopeNode(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateNode();
            if (!this._symbolRoot) {
                return null;
            }
            let target = null;
            for (let node of this._symbolRoot.iterNodesRevers()) {
                if (node.containsPos(pos)) {
                    target = node;
                    break;
                }
            }
            return target;
        });
    }
}
ScopeFinder._dummyNode = new SymbolNode(null);
exports.ScopeFinder = ScopeFinder;
class ScopeSymbolProvider {
    constructor(context) {
        this._status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this._status.tooltip = 'Symbol Navigation';
        this.refreshNavigateCommand();
        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('scopebar.Navigate')) {
                this.refreshNavigateCommand();
            }
        }));
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            this._scopeFinder = new ScopeFinder(editor.document);
            this.updateStatus(editor.selection.start);
        }
        vscode.window.onDidChangeTextEditorSelection((e) => __awaiter(this, void 0, void 0, function* () {
            if (e.selections.length < 1) {
                return;
            }
            let selection = e.selections[0];
            this.updateStatus(selection.start);
        }));
        vscode.window.onDidChangeActiveTextEditor(e => {
            if (!e) {
                this.updateStatus();
                return;
            }
            this._lastPos = null;
            this._scopeFinder = new ScopeFinder(e.document);
            this.updateStatus(e.selection.start);
        });
        vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.isDirty) {
                return;
            }
            if (this._scopeFinder && e.document === this._scopeFinder.document) {
                this._scopeFinder.update();
                return;
            }
            this._scopeFinder = new ScopeFinder(e.document);
        });
        vscode.commands.registerCommand(this._status.command, () => __awaiter(this, void 0, void 0, function* () {
            let selection = vscode.window.activeTextEditor.selection;
            let node = yield this._scopeFinder.getScopeNode(selection.start);
            this.showScopeSymbols(node);
        }));
    }
    refreshNavigateCommand() {
        const config = vscode.workspace.getConfiguration('scopebar');
        let command;
        switch (config['Navigate']) {
            case 'FileSymbol':
                command = 'workbench.action.gotoSymbol';
                break;
            default:
                command = 'scopebar.ShowScopeSymbols';
                break;
        }
        this._status.command = command;
    }
    updateStatus(pos, delay) {
        if (this._cancelToken) {
            this._cancelToken.cancel();
        }
        this._cancelToken = new vscode.CancellationTokenSource();
        setTimeout((token) => __awaiter(this, void 0, void 0, function* () {
            if (token.isCancellationRequested) {
                return;
            }
            if (!pos) {
                this._status.hide();
                return;
            }
            if (this._lastPos == pos) {
                return;
            }
            let node;
            try {
                node = yield this._scopeFinder.getScopeNode(pos);
            }
            catch (err) {
                if (err.name == 'CancelUpdateError') {
                    return;
                }
                throw err;
            }
            if (!node) {
                // The updateNode call may reject by timeout, use an empyty node for now
                // and refresh the status next time
                node = this._scopeFinder.dummyNode;
                this.updateStatus(pos, 1000);
            }
            this._status.text = node.getFullName();
            this._status.show();
        }), delay ? delay : 32, this._cancelToken.token);
    }
    onSelectNavigationItem(item) {
        if (!item) {
            return;
        }
        let node = item.node;
        vscode.window.activeTextEditor.revealRange(node.range, vscode.TextEditorRevealType.Default);
        let pos = node.range.start;
        let newSelection = new vscode.Selection(pos, pos);
        vscode.window.activeTextEditor.selection = newSelection;
    }
    findScopeParent(node) {
        const ShowType = [
            vscode_1.SymbolKind.Class,
            vscode_1.SymbolKind.Namespace,
            vscode_1.SymbolKind.Module
        ];
        if (!node) {
            return null;
        }
        if (!node.symbolInfo || ShowType.indexOf(node.symbolInfo.kind) != -1) {
            return node;
        }
        return this.findScopeParent(node.parent);
    }
    showScopeSymbols(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!node) {
                return;
            }
            let parent = this.findScopeParent(node);
            if (!parent) {
                return;
            }
            let parentName = parent.getFullName();
            let items = parent.children.map(subNode => {
                assert(subNode.symbolInfo);
                // TODO: find a way for showing custom icon
                let item = {
                    label: '$(tag)  ' + subNode.symbolInfo.name,
                    description: parentName,
                    node: subNode
                };
                return item;
            });
            let oldRanges = vscode.window.activeTextEditor.visibleRanges;
            let oldSelections = vscode.window.activeTextEditor.selections;
            let target = yield vscode.window.showQuickPick(items, {
                placeHolder: parent.getFullName(),
                canPickMany: false,
                onDidSelectItem: this.onSelectNavigationItem.bind(this)
            });
            if (!target) {
                // Didn't select any one, recover the position
                vscode.window.activeTextEditor.revealRange(oldRanges[0]);
                vscode.window.activeTextEditor.selections = oldSelections;
                return;
            }
            this.onSelectNavigationItem(target);
        });
    }
}
exports.ScopeSymbolProvider = ScopeSymbolProvider;
//# sourceMappingURL=scope.js.map