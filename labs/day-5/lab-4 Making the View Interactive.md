### **Lab 4: Making the View Interactive**

**Objective:**
In this lab, you will transform your static "File Bookmarker" `TreeView` into a fully interactive and dynamic component. You will implement the refresh mechanism that allows the view to update when the underlying data changes. You will also add contextual actions to both the view's title bar and individual tree items, allowing the user to add, refresh, and remove bookmarks directly from the UI. This lab will solidify your understanding of event-driven UI updates and declarative menu contributions.

**Project:** File Bookmarker (continuing from Lab 3)
**Time to complete:** 30-40 minutes

---

#### **Step 1: Implement the Refresh Mechanism**

A professional UI must reflect the current state of its data model. Our `TreeView` currently only loads data when it is first created. We need to implement a mechanism to tell VS Code to refresh the view whenever our list of bookmarks changes. This is achieved using the `onDidChangeTreeData` event.

**Instructions:**

1.  Open `src/BookmarksDataProvider.ts`.
2.  We will add the event emitter pattern to the class. This involves creating a private `EventEmitter`, exposing its public `event`, and creating a `refresh` method to trigger it.

**Full Source Code: `src/BookmarksDataProvider.ts` (with refresh logic)**

```typescript
import * as vscode from 'vscode';
import { Bookmark } from './Bookmark';

const BOOKMARKS_STATE_KEY = 'fileBookmarker.bookmarks';

export class BookmarksDataProvider implements vscode.TreeDataProvider<Bookmark> {

    // --- Add the event emitter and the event ---
    private _onDidChangeTreeData: vscode.EventEmitter<Bookmark | undefined | null | void> = new vscode.EventEmitter<Bookmark | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Bookmark | undefined | null | void> = this._onDidChangeTreeData.event;
    // -----------------------------------------

    private _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    // --- Add a public refresh method ---
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    // ---------------------------------

    getTreeItem(element: Bookmark): vscode.TreeItem {
        // ... (This method remains unchanged from Lab 3)
        const treeItem = new vscode.TreeItem(element.label);
        treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;
        treeItem.command = {
            command: 'vscode.open',
            title: 'Open Bookmarked File',
            arguments: [element.uri],
        };
        treeItem.tooltip = `Open ${element.description}/${element.label}`;
        treeItem.resourceUri = element.uri;
        
        // We will add the contextValue here in preparation for Step 3
        treeItem.contextValue = 'bookmarkItem';

        return treeItem;
    }

    getChildren(element?: Bookmark): vscode.ProviderResult<Bookmark[]> {
        // ... (This method remains unchanged from Lab 3)
        if (element) {
            return [];
        }

        const bookmarkData: { uri: string }[] = this._context.globalState.get(BOOKMARKS_STATE_KEY, []);
        const bookmarkObjects = bookmarkData.map(b => new Bookmark(vscode.Uri.parse(b.uri)));
        
        return bookmarkObjects;
    }
}
```

**Explanation of the Changes:**

*   `_onDidChangeTreeData`: A private `EventEmitter`. The generic type `Bookmark | undefined | null | void` allows us to signal changes for the root (by passing `undefined`) or for a specific item (by passing a `Bookmark` object).
*   `onDidChangeTreeData`: The public `Event` property that VS Code's `TreeView` will subscribe to. This is the official contract of the `TreeDataProvider` interface.
*   `refresh()`: Our public method that fires the event. Calling this method is the signal to VS Code: "My data has changed, please re-render."

Now our provider has the *capability* to be refreshed, but nothing is calling the `refresh()` method yet.

---

#### **Step 2: Add View Actions to the Title Bar**

We will now add discoverable action buttons to the top of our "Bookmarks" view. These actions will allow the user to add a new bookmark and manually refresh the view. This is done declaratively in `package.json`.

**Instructions:**

1.  Open the `package.json` file.
2.  We need to define the commands that our actions will trigger. Then, we will add the `menus` contribution to place them in the UI. Replace your entire `contributes` section with the following complete block.

**Full Source Code: `package.json` (`contributes` block)**

```json
"contributes": {
    "commands": [
        {
            "command": "fileBookmarker.addBookmark",
            "title": "Bookmark: Add File",
            "category": "Bookmark",
            "icon": "$(bookmark)"
        },
        {
            "command": "fileBookmarker.removeBookmark",
            "title": "Remove Bookmark",
            "category": "Bookmark",
            "icon": "$(trash)"
        },
        {
            "command": "fileBookmarker.refreshView",
            "title": "Refresh Bookmarks",
            "category": "Bookmark",
            "icon": "$(refresh)"
        }
    ],
    "viewsContainers": {
        "activitybar": [
            {
                "id": "file-bookmarker-container",
                "title": "File Bookmarker",
                "icon": "media/bookmark-icon.svg"
            }
        ]
    },
    "views": {
        "file-bookmarker-container": [
            {
                "id": "fileBookmarker.bookmarksView",
                "name": "Bookmarks",
                "type": "tree",
                "icon": "media/bookmark-icon.svg"
            }
        ]
    },
    "menus": {
        "view/title": [
            {
                "command": "fileBookmarker.addBookmark",
                "when": "view == fileBookmarker.bookmarksView",
                "group": "navigation@1"
            },
            {
                "command": "fileBookmarker.refreshView",
                "when": "view == fileBookmarker.bookmarksView",
                "group": "navigation@2"
            }
        ]
    }
}
```

**Explanation of the `menus` Contribution:**

*   `"view/title"`: We are targeting the title bar of a view.
*   `"command"`: The ID of the command to execute when the icon is clicked.
*   `"when": "view == fileBookmarker.bookmarksView"`: This crucial `when` clause scopes these actions to *our view only*.
*   `"group": "navigation@1"`: The `navigation` group places the icon directly in the title bar (not in the `...` menu), and the `@1` suffix controls its order.

**Implement the New Command Handlers:**

Now, we must implement the new `refreshView` command in our `extension.ts` file and modify `addBookmark` to trigger the refresh automatically.

**Full Source Code: `src/extension.ts` (updated `activate` function)**

```typescript
import * as vscode from 'vscode';
import * as path from 'path';
import { Bookmark } from './Bookmark';
import { BookmarksDataProvider } from './BookmarksDataProvider';

const BOOKMARKS_STATE_KEY = 'fileBookmarker.bookmarks';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-bookmarker" is now active!');

    const bookmarksDataProvider = new BookmarksDataProvider(context);
    vscode.window.registerTreeDataProvider(
        'fileBookmarker.bookmarksView',
        bookmarksDataProvider
    );

	const addBookmarkCommand = vscode.commands.registerCommand('fileBookmarker.addBookmark', async () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showWarningMessage("Cannot add bookmark: No active file open.");
			return;
		}
		const fileUri = activeEditor.document.uri;

		const bookmarks: { uri: string }[] = context.globalState.get(BOOKMARKS_STATE_KEY, []);
		const alreadyBookmarked = bookmarks.some(bookmark => bookmark.uri === fileUri.toString());
		if (alreadyBookmarked) {
			vscode.window.showInformationMessage(`File already bookmarked: ${path.basename(fileUri.fsPath)}`);
			return;
		}

		bookmarks.push({ uri: fileUri.toString() });
		await context.globalState.update(BOOKMARKS_STATE_KEY, bookmarks);

        // --- NEW: Trigger a refresh after adding ---
        bookmarksDataProvider.refresh();

		vscode.window.showInformationMessage(`Bookmarked: ${path.basename(fileUri.fsPath)}`);
	});

    // --- NEW: Implement the refresh command ---
    const refreshCommand = vscode.commands.registerCommand('fileBookmarker.refreshView', () => {
        bookmarksDataProvider.refresh();
    });

	context.subscriptions.push(addBookmarkCommand, refreshCommand);
}

export function deactivate() {}
```
With these changes, adding a bookmark will now cause the `TreeView` to update instantly, providing immediate feedback to the user.

---

#### **Step 3: Add an Item-Specific "Remove" Action**

The final piece of interactivity is to allow users to remove a bookmark. The correct UX for this is a contextual action on the item itself. We will add an inline action (visible on hover) and an entry in the right-click context menu.

**Instructions:**

1.  First, add the logic for removing a bookmark to your `BookmarksDataProvider`.

**Full Source Code: `src/BookmarksDataProvider.ts` (with `removeBookmark` method)**
```typescript
// Add this new method to your BookmarksDataProvider class
public async removeBookmark(bookmarkToRemove: Bookmark): Promise<void> {
    const allBookmarks: { uri: string }[] = this._context.globalState.get(BOOKMARKS_STATE_KEY, []);
    
    // Filter out the bookmark to be removed
    const updatedBookmarks = allBookmarks.filter(b => b.uri !== bookmarkToRemove.uri.toString());

    // Update the globalState
    await this._context.globalState.update(BOOKMARKS_STATE_KEY, updatedBookmarks);

    // Trigger a refresh of the view
    this.refresh();
}
```

2.  Next, register the command in `extension.ts` that will call this new provider method.

**Full Source Code: `src/extension.ts` (add `removeBookmark` command)**
```typescript
// Add this inside the activate function
const removeBookmarkCommand = vscode.commands.registerCommand('fileBookmarker.removeBookmark', (bookmark: Bookmark) => {
    // A key concept: When a command is executed from a menu on a tree item,
    // VS Code automatically passes the underlying data element of that TreeItem
    // as the first argument. This is how our command knows which bookmark to remove.
    if (bookmark) {
        bookmarksDataProvider.removeBookmark(bookmark);
    }
});

// Don't forget to add the new disposable to the subscriptions array!
context.subscriptions.push(addBookmarkCommand, refreshCommand, removeBookmarkCommand);
```

3.  Finally, declare the menu contribution in `package.json`. We have already added the command declaration in Step 2. We now add the `view/item/context` menu entry.

**Full Source Code: `package.json` (`menus` block)**
```json
"menus": {
    "view/title": [
        // ... (title actions from before) ...
    ],
    "view/item/context": [
        {
            "command": "fileBookmarker.removeBookmark",
            "when": "view == fileBookmarker.bookmarksView && viewItem == bookmarkItem",
            "group": "inline"
        }
    ]
}
```
**Explanation of the `view/item/context` Contribution:**
*   `"when": "... && viewItem == bookmarkItem"`: This is the crucial part. It ensures this action only appears for items in our view that have the `contextValue` of `'bookmarkItem'`, which we set in our `getTreeItem` method.
*   `"group": "inline"`: This special group makes the action appear as an icon on the tree item on hover, providing a very quick and professional-feeling way to perform the primary item action (in this case, removal). It will also appear in the standard right-click context menu.

---

#### **Step 4: Run and Verify**

You have now implemented a fully interactive `TreeView`.

**Instructions:**

1.  Press `F5` to launch the Extension Development Host.
2.  Click on the "File Bookmarker" icon in the Activity Bar.
3.  **Verify:** You should see the `$(bookmark)` and `$(refresh)` icons in the view's title bar.
4.  Open a file and click the `$(bookmark)` icon.
5.  **Verify:** The file immediately appears in your "Bookmarks" view.
6.  Hover over an item in your "Bookmarks" view.
7.  **Verify:** A `$(trash)` icon should appear. Clicking it should remove the bookmark from the view and from storage.
8.  Right-click on an item.
9.  **Verify:** The "Remove Bookmark" action appears in the context menu and functions correctly.

You have successfully built a dynamic and interactive UI component that is fully integrated into the VS Code workbench, using professional patterns for data management and UI contributions.