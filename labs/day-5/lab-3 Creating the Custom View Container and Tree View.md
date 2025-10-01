### **Lab 3: Creating the Custom View Container and Tree View**

**Objective:**
In this lab, you will create the dedicated user interface for the "File Bookmarker" extension. You will learn how to contribute a new View Container, which adds an icon to the Activity Bar and a home for your UI in the Sidebar. You will then implement a `TreeDataProvider` to read your persisted bookmarks from `globalState` and display them in a `TreeView`. By the end of this lab, your extension will have a professional, integrated UI that displays the bookmarks and allows users to open them with a single click.

**Project:** File Bookmarker (continuing from Lab 2)
**Time to complete:** 30-35 minutes

---

#### **Step 1: Declare the View Container and View**

Our first task is purely declarative. We must inform VS Code about the new UI components we intend to create by adding contributions to our `package.json` manifest. This step will create the "shell" for our UI—the Activity Bar icon and the view panel itself.

**Instructions:**

1.  Open the `package.json` file in your `file-bookmarker` project.
2.  Add two new top-level entries to the `contributes` object: `"viewsContainers"` and `"views"`.
3.  Populate these new sections as shown in the code below. You can place them right after the `"commands"` section.

**Full Source Code: `package.json` (partial)**

```json
{
    // ... name, displayName, etc. ...
    "main": "./dist/extension.js",
    "contributes": {
        "commands": [
            // ... your commands from Lab 2 ...
        ],

        // --- NEW SECTION: viewsContainers ---
        "viewsContainers": {
            "activitybar": [
                {
                    "id": "fileBookmarker.viewContainer",
                    "title": "File Bookmarker",
                    "icon": "media/bookmark-icon.svg"
                }
            ]
        },

        // --- NEW SECTION: views ---
        "views": {
            "fileBookmarker.viewContainer": [
                {
                    "id": "fileBookmarker.bookmarksView",
                    "name": "Bookmarks",
                    "type": "tree"
                }
            ]
        }
    },
    // ... scripts, devDependencies, etc. ...
}
```

**Explanation of the New Contributions:**

*   **`viewsContainers`**: This object declares new containers for views.
    *   `"activitybar"`: We are targeting the Activity Bar as the location for our container's entry point.
    *   `"id": "fileBookmarker.viewContainer"`: A unique ID for our container. This is the link between the Activity Bar icon and the Sidebar panel.
    *   `"title": "File Bookmarker"`: The human-readable name used for tooltips and the Sidebar title.
    *   `"icon": "media/bookmark-icon.svg"`: The path to the icon for the Activity Bar. We will create this file next.

*   **`views`**: This object places views into containers.
    *   `"fileBookmarker.viewContainer"`: This key **must match the `id`** of the container we just defined. It tells VS Code to place the following array of views inside that specific container.
    *   `"id": "fileBookmarker.bookmarksView"`: The unique ID for our `TreeView`. We will use this ID in our code to register the data provider.
    *   `"name": "Bookmarks"`: The title that will appear at the top of our view panel within the Sidebar.
    *   `"type": "tree"`: Explicitly declares that this view will be a `TreeView`.

**Create the Icon File:**

1.  Create a new folder named `media` in the root of your project.
2.  Inside the `media` folder, create a new file named `bookmark-icon.svg`.
3.  Paste the following SVG code into the file. This is a simple bookmark icon that uses a CSS variable to ensure it respects the user's current theme.

**Full Source Code: `media/bookmark-icon.svg`**
```xml
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17 18.5V5.5C17 4.11929 15.8807 3 14.5 3H7.5C6.11929 3 5 4.11929 5 5.5V18.5L11 15.5L17 18.5ZM6 5.5C6 4.67157 6.67157 4 7.5 4H14.5C15.3284 4 16 4.67157 16 5.5V17.5L11 14.5L6 17.5V5.5Z" fill="var(--vscode-activityBar-foreground)"/>
</svg>
```

At this point, if you were to restart the Extension Development Host (`F5`), you would see the new bookmark icon in the Activity Bar. Clicking it would open an empty "Bookmarks" view. Our next step is to provide the data.

---

#### **Step 2: Implement the `TreeDataProvider`**

The `TreeDataProvider` is the class that provides the content for our view. It will read the list of bookmarks from `globalState` and transform them into `TreeItem` objects that VS Code can render.

**Instructions:**

1.  Create a new file at `src/BookmarksDataProvider.ts`.
2.  Add the following complete class implementation to this new file.

**Full Source Code: `src/BookmarksDataProvider.ts`**

```typescript
import * as vscode from 'vscode';
import { Bookmark } from './Bookmark'; // Assumes Bookmark.ts from Lab 2 is in the same directory

const BOOKMARKS_STATE_KEY = 'fileBookmarker.bookmarks';

export class BookmarksDataProvider implements vscode.TreeDataProvider<Bookmark> {

    private _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    /**
     * Returns the UI representation (TreeItem) of the element.
     */
    getTreeItem(element: Bookmark): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.label);

        // A TreeItem can be a file or a folder.
        // Bookmarks are always files, so they are not collapsible.
        treeItem.collapsibleState = vscode.TreeItemCollapsibleState.None;

        // The command property defines the action that is taken when the tree item is clicked.
        // We want to open the file, so we use the built-in 'vscode.open' command.
        treeItem.command = {
            command: 'vscode.open',
            title: 'Open Bookmarked File',
            arguments: [element.uri],
        };

        // A tooltip provides more information on hover.
        treeItem.tooltip = `Open ${element.description}/${element.label}`;

        // The resourceUri is the key to getting the correct file icon.
        // VS Code will use this URI to determine the icon based on the user's
        // currently active file icon theme.
        treeItem.resourceUri = element.uri;

        return treeItem;
    }

    /**
     * Returns the children for the given element or root if no element is passed.
     */
    getChildren(element?: Bookmark): vscode.ProviderResult<Bookmark[]> {
        // If an element is passed, it means we are fetching children for a node.
        // Since our bookmarks are a flat list of files, a bookmark item will never have children.
        if (element) {
            return [];
        }

        // If no element is passed, we are at the root of the tree.
        // We need to read from globalState and convert the raw data into Bookmark objects.
        const bookmarkData: { uri: string }[] = this._context.globalState.get(BOOKMARKS_STATE_KEY, []);
        
        // Deserialize the plain objects into instances of our Bookmark class.
        const bookmarkObjects = bookmarkData.map(b => new Bookmark(vscode.Uri.parse(b.uri)));
        
        return bookmarkObjects;
    }
}
```

**Explanation of the Implementation:**

*   **Constructor:** We now pass the `ExtensionContext` to our provider's constructor. This is a clean dependency injection pattern that gives our provider access to `globalState` without making it a global variable.
*   **`getTreeItem`:** This method is the core of the UI mapping. We create a `TreeItem` and configure it:
    *   `collapsibleState` is `None` because our bookmarks are leaf nodes.
    *   `command` is set to `vscode.open`. This is a critical best practice that ensures our view behaves just like the native File Explorer.
    *   `resourceUri` is set to the bookmark's `Uri`. This is the "guided" step we identified. This single line is what enables VS Code to automatically apply the correct, theme-aware icon for the file type (`.ts`, `.json`, `.md`, etc.) and any source control decorations.
*   **`getChildren`:** This method handles the data loading. It checks if it's being asked for the root (`element` is `undefined`). If so, it reads the raw data from `globalState`, deserializes the string URIs back into `vscode.Uri` objects, creates `Bookmark` instances, and returns them.

---

#### **Step 3: Register the `TreeDataProvider`**

The final step is to wire everything together in our main `extension.ts` file. We need to instantiate our new provider and register it with the view ID we declared in `package.json`.

**Instructions:**

1.  Open `src/extension.ts`.
2.  Replace the entire content of the file with the following code, which now includes the provider registration.

**Full Source Code: `src/extension.ts`**

```typescript
import * as vscode from 'vscode';
import * as path from 'path';
import { Bookmark } from './Bookmark';
import { BookmarksDataProvider } from './BookmarksDataProvider'; // Import our new provider

const BOOKMARKS_STATE_KEY = 'fileBookmarker.bookmarks';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-bookmarker" is now active!');

    // --- Instantiate and Register the Tree Data Provider ---
    // The provider needs access to the extension's context to read globalState.
    const bookmarksDataProvider = new BookmarksDataProvider(context);

    // The view ID 'fileBookmarker.bookmarksView' must match the ID in package.json.
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

		vscode.window.showInformationMessage(`Bookmarked: ${path.basename(fileUri.fsPath)}`);
	});

    // We no longer need the listBookmarks command, as the TreeView replaces it.
    // So it has been removed.

	context.subscriptions.push(addBookmarkCommand);
}

export function deactivate() {}
```

**Explanation of Changes:**
*   We now instantiate `BookmarksDataProvider`, passing it the `context`.
*   We call `vscode.window.registerTreeDataProvider`, linking our view ID (`'fileBookmarker.bookmarksView'`) to our provider instance.
*   We have removed the old `fileBookmarker.listBookmarks` command, as its functionality is now superseded by our superior `TreeView` interface.

---

#### **Step 4: Run and Verify**

You have now completed the integration of the data model with the UI.

**Instructions:**

1.  Press `F5` to launch the Extension Development Host.
2.  If you have bookmarks saved from Lab 2, a new bookmark icon should appear in the Activity Bar. Click it.
3.  **Verify:** The "Bookmarks" view should appear in the Sidebar, populated with your saved bookmarks. Each item should have the correct filename and the appropriate file icon from your current theme.
4.  If you don't have any bookmarks, open a file and run the **"Bookmark: Add File"** command. **Note:** The view will *not* update automatically yet. We will implement that in the next lab. You will need to reload the window (Ctrl+R) to see the new bookmark.
5.  Click on any bookmark in the tree.
6.  **Verify:** The corresponding file should open in the editor.
7.  Hover over a bookmark in the tree.
8.  **Verify:** A tooltip should appear showing the full file path.

You have successfully created a custom UI view that is populated with persistent data and provides core functionality. The next and final lab for this module will focus on making this view fully dynamic and interactive.