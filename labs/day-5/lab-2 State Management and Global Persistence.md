### **Lab 2: State Management and Global Persistence**

**Objective:**
In this lab, you will refactor the "File Bookmarker" extension to make it stateful. You will learn how to use the VS Code `globalState` API to persistently store the bookmarks, ensuring they are available across editor sessions and workspaces. You will also create a new command to retrieve and interact with this stored data, which will involve programmatically executing a built-in VS Code command to open a file.

**Project:** File Bookmarker (continuing from Lab 1)
**Time to complete:** 25-30 minutes

---

#### **Step 1: Define the Bookmark Data Model**

Before we can store complex data, we must first define its structure. A professional practice is to create a dedicated class or interface for your data model. This provides type safety and makes your code more readable and maintainable. For our bookmarks, we need to store more than just a path; we need a user-friendly label and a structured `Uri`.

**Instructions:**

1.  In your `file-bookmarker` project, create a new file at `src/Bookmark.ts`.
2.  Add the following class definition to the new file.

**Full Source Code: `src/Bookmark.ts`**

```typescript
import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Represents a single bookmark entry.
 * This class encapsulates the data and behavior of a bookmark.
 */
export class Bookmark {
    public readonly uri: vscode.Uri;
    public readonly label: string;

    /**
     * @param uri The URI of the bookmarked file.
     */
    constructor(uri: vscode.Uri) {
        this.uri = uri;
        // The label is the basename of the file's path.
        this.label = path.basename(uri.fsPath);
    }

    /**
     * A getter for the description, which will be the file's directory path.
     * This is useful for display in QuickPick items or TreeItems.
     */
    get description(): string {
        return path.dirname(this.uri.fsPath);
    }
}
```

**Explanation of the Code:**
*   **`export class Bookmark`**: We create an exported class so it can be imported and used elsewhere in our extension.
*   **`constructor(uri: vscode.Uri)`**: The constructor takes a `vscode.Uri` object. Using the `Uri` type directly is architecturally superior to storing a simple `fsPath` string, as `Uri` objects can represent resources beyond the local file system (a key concept for remote development).
*   **`this.label = path.basename(uri.fsPath)`**: We automatically derive the user-friendly label (the filename) from the URI. This keeps our model clean. We use the Node.js `path` module for reliable path manipulation.
*   **`get description(): string`**: A getter for the description provides the directory path. This is a clean way to provide secondary information for UI components without cluttering the main data model.

---

#### **Step 2: Implement `addBookmark` with `globalState`**

Now, we will refactor the `addBookmark` command to use our new `Bookmark` model and persist the data in `globalState`. `globalState` is a `Memento` object that stores data globally for the user, making it accessible across all workspaces.

**Instructions:**

1.  Open the `src/extension.ts` file.
2.  Import our new `Bookmark` class at the top of the file.
3.  Replace the existing `activate` function with the following updated version.

**Full Source Code: `src/extension.ts`**

```typescript
import * as vscode from 'vscode';
import { Bookmark } from './Bookmark'; // Import our new Bookmark class

const BOOKMARKS_STATE_KEY = 'fileBookmarker.bookmarks'; // A unique key for our data

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-bookmarker" is now active!');

	const addBookmarkCommand = vscode.commands.registerCommand('fileBookmarker.addBookmark', async () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showWarningMessage("Cannot add bookmark: No active file open.");
			return;
		}
		const fileUri = activeEditor.document.uri;

		// --- State Management Logic ---

		// 1. Retrieve the current list of bookmarks from globalState.
		// The second argument is the default value if the key doesn't exist yet.
		// We get the raw data (URIs) and will convert them to Bookmark objects.
		const bookmarks: { uri: string }[] = context.globalState.get(BOOKMARKS_STATE_KEY, []);

		// 2. Check for duplicates.
		const alreadyBookmarked = bookmarks.some(bookmark => bookmark.uri === fileUri.toString());
		if (alreadyBookmarked) {
			vscode.window.showInformationMessage(`File already bookmarked: ${path.basename(fileUri.fsPath)}`);
			return;
		}

		// 3. Add the new bookmark to the array.
		// We store a simple object that is JSON-serializable.
		bookmarks.push({ uri: fileUri.toString() });

		// 4. Update the globalState with the new array. This is an async operation.
		await context.globalState.update(BOOKMARKS_STATE_KEY, bookmarks);

		vscode.window.showInformationMessage(`Bookmarked: ${path.basename(fileUri.fsPath)}`);
	});

	context.subscriptions.push(addBookmarkCommand);
}

export function deactivate() {}
```

**Explanation of the Refactoring:**
*   **`BOOKMARKS_STATE_KEY`**: We define a constant for our storage key. This is a professional best practice that prevents typos and centralizes the key's definition.
*   **`context.globalState.get(..., [])`**: We retrieve the current list of bookmarks. Crucially, we provide an empty array `[]` as the default value. This ensures that our code works correctly the very first time it runs when no data is in storage, preventing `undefined` errors.
*   **Storing JSON-Serializable Data:** The `Memento` API can only store data that can be serialized to JSON. A `vscode.Uri` object has methods and is not directly serializable. Therefore, we store its string representation (`fileUri.toString()`) and will reconstruct the `Uri` object when we read it back. We store an array of objects `{ uri: string }`.
*   **Duplicate Check:** We now have the logic to prevent adding the same file multiple times, a key feature for a robust utility.
*   **`await context.globalState.update(...)`**: We use `await` to ensure that the state is successfully written before we proceed. While not strictly necessary for this simple notification, it's a good habit for more complex workflows where subsequent logic might depend on the data being saved.

---

#### **Step 3: Create and Implement the "List Bookmarks" Command**

With our bookmarks being saved, we now need a way for the user to access them. We will create a new command, `fileBookmarker.listBookmarks`, that presents the bookmarks in a `QuickPick` and opens the selected file.

**Instructions:**

1.  First, add the new command's declaration to your `package.json`.

**Full Source Code: `package.json` (partial)**
```json
// in package.json
"contributes": {
    "commands": [
        {
            "command": "fileBookmarker.addBookmark",
            "title": "Bookmark: Add File",
            "category": "Bookmark"
        },
        {
            "command": "fileBookmarker.listBookmarks",
            "title": "Bookmark: Show All Bookmarks",
            "category": "Bookmark"
        }
    ]
}
```

2.  Next, add the implementation for this new command inside the `activate` function in `src/extension.ts`.

**Full Source Code: `src/extension.ts` (updated `activate` function)**

```typescript
import * as vscode from 'vscode';
import * as path from 'path';
import { Bookmark } from './Bookmark';

const BOOKMARKS_STATE_KEY = 'fileBookmarker.bookmarks';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-bookmarker" is now active!');

    // The entire callback function for registerCommand MUST be marked as 'async'
	const addBookmarkCommand = vscode.commands.registerCommand('fileBookmarker.addBookmark', async () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			// This part should work if the async structure is correct.
			// If it's not showing, it's a strong sign of a silent promise rejection.
			vscode.window.showWarningMessage("Cannot add bookmark: No active file open.");
			return;
		}
		const fileUri = activeEditor.document.uri;

		// The get() method is synchronous, so no 'await' is needed here.
		const bookmarks: { uri: string }[] = context.globalState.get(BOOKMARKS_STATE_KEY, []);

		const alreadyBookmarked = bookmarks.some(bookmark => bookmark.uri === fileUri.toString());
		if (alreadyBookmarked) {
			vscode.window.showInformationMessage(`File already bookmarked: ${path.basename(fileUri.fsPath)}`);
			return;
		}

		bookmarks.push({ uri: fileUri.toString() });

		try {
            // The update() method returns a Thenable (Promise). It MUST be awaited.
			await context.globalState.update(BOOKMARKS_STATE_KEY, bookmarks);
            
            // This line will only be reached if the update is successful.
			vscode.window.showInformationMessage(`Bookmarked: ${path.basename(fileUri.fsPath)}`);

		} catch (error) {
            // A professional extension should always handle potential errors.
            // If the state update fails, we must inform the user.
            vscode.window.showErrorMessage(`Failed to save bookmark: ${error}`);
            console.error("Failed to update globalState", error);
        }
	});

    // The listBookmarks command is also async because it uses await for showQuickPick
    const listBookmarksCommand = vscode.commands.registerCommand('fileBookmarker.listBookmarks', async () => {
        const bookmarkData: { uri: string }[] = context.globalState.get(BOOKMARKS_STATE_KEY, []);
        if (bookmarkData.length === 0) {
            vscode.window.showInformationMessage('No files have been bookmarked yet.');
            return;
        }

        const bookmarkObjects = bookmarkData.map(b => new Bookmark(vscode.Uri.parse(b.uri)));
        const quickPickItems = bookmarkObjects.map(b => ({
            label: b.label,
            description: b.description,
            bookmark: b 
        }));

        const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
            title: "Your Bookmarked Files",
            placeHolder: "Select a bookmark to open"
        });

        if (selectedItem) {
            await vscode.commands.executeCommand('vscode.open', selectedItem.bookmark.uri);
        }
    });

	context.subscriptions.push(addBookmarkCommand, listBookmarksCommand);
}

export function deactivate() {}
```

**Explanation of the New Command:**

*   **Data Deserialization:** We retrieve the raw data from `globalState` and then map it into an array of our `Bookmark` class instances using `new Bookmark(vscode.Uri.parse(b.uri))`. This deserialization step is crucial for working with typed objects in our code.
*   **Creating `QuickPickItem`s:** We then create an array of objects that conform to the `QuickPickItem` interface. We map our `Bookmark`'s `label` and `description` to the corresponding `QuickPickItem` properties for a rich UI.
*   **Attaching Metadata:** Crucially, we attach the original `Bookmark` object to our `quickPickItem` (`bookmark: b`). When the user makes a selection, `showQuickPick` returns this *entire object*, giving us easy access to the `Uri` we need to open.
*   **Programmatic Command Execution:** The line `vscode.commands.executeCommand('vscode.open', ...)` is a key takeaway. Instead of trying to find an API like `vscode.window.openFile(...)`, we execute the same command that VS Code itself uses. This is a powerful and common pattern for interacting with core editor functionality.

---

#### **Step 4: Run and Verify**

You have now implemented a complete, stateful workflow.

**Instructions:**

1.  Press `F5` to launch the Extension Development Host.
2.  Open a few different files and run the **"Bookmark: Add File"** command for each one.
3.  Restart the Extension Development Host (Stop and press `F5` again) to simulate closing and reopening VS Code.
4.  Run the **"Bookmark: Show All Bookmarks"** command.
5.  **Verify:** A Quick Pick should appear, listing all the files you bookmarked. The labels and descriptions should be displayed correctly.
6.  Select one of the files from the Quick Pick.
7.  **Verify:** The selected file should open in a new editor tab.

You have successfully built an extension that can save, retrieve, and act upon persistent global data, providing a complete and useful feature to the user. This forms the data layer that we will now use to build a more sophisticated UI in the next lab.