### **"File Bookmarker" Project: Detailed Task Specification**

### **Project Scaffolding and Initial Command**

**Objective:** To establish the project structure and create the primary "Add Bookmark" command, ensuring the core development and debugging loop is functional.

*   **Task 1.1: Generate Project Structure**
    *   **Specification:** Use `yo code` via `npx` to scaffold a new extension project.
    *   **Parameters:**
        *   Type: `New Extension (TypeScript)`
        *   Name: `File Bookmarker`
        *   Identifier: `file-bookmarker`
        *   Git Init: `Yes`
        *   Bundler: `esbuild`
        *   Package Manager: `npm`
    *   **Acceptance Criteria:** A `file-bookmarker` directory is created, `npm install` completes successfully, and the project opens in VS Code without errors.

*   **Task 1.2: Define the "Add Bookmark" Command Contribution**
    *   **Specification:** In `package.json`, modify the default "Hello World" command contribution to define the primary "Add Bookmark" action.
    *   **Details:**
        *   Locate the `contributes.commands` array.
        *   Change the command `title` to `"Bookmark: Add File"`.
        *   Change the command `command` (ID) to `"fileBookmarker.addBookmark"`.
        *   Add a `"category"` property with the value `"Bookmark"`.
    *   **Acceptance Criteria:** The `package.json` file is valid and reflects these changes.

*   **Task 1.3: Implement the Initial Command Handler**
    *   **Specification:** In `src/extension.ts`, update the `activate` function to register the handler for the new command ID and implement its initial logic.
    *   **Details:**
        *   Change the string in the `vscode.commands.registerCommand` call from the old "Hello World" ID to `"fileBookmarker.addBookmark"`.
        *   The command handler function should access the currently active text editor via `vscode.window.activeTextEditor`.
        *   If `activeTextEditor` is `undefined`, the command should do nothing.
        *   If an editor is active, retrieve the URI of its document using `activeEditor.document.uri`.
        *   Use `vscode.window.showInformationMessage` to display a message containing the `fsPath` of the retrieved URI (e.g., `Bookmarked: C:\path\to\your\file.ts`).
    *   **Acceptance Criteria:** Running the "Bookmark: Add File" command from the Command Palette while a file is open displays the correct notification.

---

### **State Management and Global Persistence**

**Objective:** To refactor the extension to persist bookmarks in `globalState` and retrieve them, introducing the concept of a data model.

*   **Task 2.1: Define the Bookmark Data Model**
    *   **Specification:** Create a simple `Bookmark` class or interface to represent the data for a single bookmark.
    *   **Details:** The model should contain at a minimum:
        *   `label`: `string` (for the filename).
        *   `fsPath`: `string` (for storing the absolute path).
    *   **Acceptance Criteria:** A `Bookmark` type is defined and can be instantiated.

*   **Task 2.2: Implement `addBookmark` Logic with `globalState`**
    *   **Specification:** Modify the `fileBookmarker.addBookmark` command handler to store bookmark data in the extension's `globalState`.
    *   **Details:**
        *   The handler should retrieve the current array of bookmarks from `context.globalState.get('bookmarks', [])`. The `defaultValue` of an empty array is critical.
        *   It should check if the file is already bookmarked to prevent duplicates.
        *   If not already present, it should create a new `Bookmark` instance and add it to the array.
        *   The updated array must be written back to storage using `context.globalState.update('bookmarks', updatedBookmarks)`. This call should be `await`-ed.
    *   **Acceptance Criteria:** Executing the command multiple times on the same file adds it only once. Restarting the Extension Development Host shows that the bookmarks persist.

*   **Task 2.3: Create a "List Bookmarks" Command**
    *   **Specification:** Implement a new command, `fileBookmarker.listBookmarks`, that displays the saved bookmarks to the user.
    *   **Details:**
        *   Declare the command in `package.json` (`command`: `"fileBookmarker.listBookmarks"`, `title`: `"Bookmark: Show All Bookmarks"`).
        *   Register the command handler in `extension.ts`.
        *   The handler should retrieve the bookmark array from `context.globalState.get('bookmarks', [])`.
        *   It should use `vscode.window.showQuickPick` to display the `label` of each bookmark.
        *   When a user selects a bookmark from the Quick Pick, the command handler should programmatically execute the built-in `vscode.open` command, passing it the `vscode.Uri.file(bookmark.fsPath)`.
    *   **Acceptance Criteria:** Running the command shows a list of saved bookmarks, and selecting one opens the correct file. **(This task uses the "guided" API call `vscode.open`).**

---

### **Creating the Custom View Container and Tree View**

**Objective:** To create the dedicated UI for the extension in the Activity Bar and Sidebar, and to display the bookmarks in a `TreeView`.

*   **Task 3.1: Declare the View Container and View**
    *   **Specification:** In `package.json`, add the necessary contributions to create the Activity Bar entry and the view itself.
    *   **Details:**
        *   Add a `viewsContainers.activitybar` entry with `id: "fileBookmarker.viewContainer"`, `title: "File Bookmarker"`, and an `icon` path (a placeholder SVG will be provided).
        *   Add a `views.fileBookmarker.viewContainer` entry with `id: "fileBookmarker.bookmarksView"` and `name: "Bookmarks"`.
    *   **Acceptance Criteria:** Upon launching the extension, a new icon appears in the Activity Bar, and clicking it opens an empty "Bookmarks" view in the Sidebar.

*   **Task 3.2: Implement the `TreeDataProvider`**
    *   **Specification:** Create a `BookmarksDataProvider` class that implements `vscode.TreeDataProvider<Bookmark>`.
    *   **Details:**
        *   The `getChildren` method, when called for the root, should retrieve the bookmark array from `context.globalState.get('bookmarks', [])`.
        *   The `getTreeItem` method should take a `Bookmark` object and return a `vscode.TreeItem`.
            *   Set the `TreeItem.label` to the bookmark's label.
            *   Set the `TreeItem.collapsibleState` to `vscode.TreeItemCollapsibleState.None`.
            *   Set the `TreeItem.command` to execute `vscode.open` with the bookmark's URI, just like in Lab 2.
            *   **(Guided Step)** Set the `TreeItem.resourceUri` to the bookmark's `vscode.Uri` to enable native file icons.
    *   **Acceptance Criteria:** The Tree View now populates with the list of saved bookmarks.

*   **Task 3.3: Register the `TreeDataProvider`**
    *   **Specification:** In `extension.ts`, instantiate and register the new data provider.
    *   **Details:** Use `vscode.window.registerTreeDataProvider('fileBookmarker.bookmarksView', myDataProvider)`.
    *   **Acceptance Criteria:** The extension loads and the custom view is populated with the bookmarks from `globalState`. Clicking a bookmark opens the file.

---

### **Making the View Interactive**

**Objective:** To make the view dynamic by adding refresh and delete functionality, fully integrating the UI with the underlying data model.

*   **Task 4.1: Implement the Refresh Mechanism**
    *   **Specification:** Add a refresh mechanism to the `BookmarksDataProvider`.
    *   **Details:**
        *   Add the `onDidChangeTreeData` event emitter pattern to the provider class.
        *   Create a public `refresh()` method that calls `this._onDidChangeTreeData.fire()`.
        *   Modify the `addBookmark` logic (and any future data-modifying methods) to call `this.refresh()` after updating the `globalState`.
    *   **Acceptance Criteria:** Adding a new bookmark via the command should now cause the Tree View to update automatically.

*   **Task 4.2: Add a "Refresh" View Action**
    *   **Specification:** Add a refresh icon to the view's title bar.
    *   **Details:**
        *   Create a new command, `fileBookmarker.refreshView`, that simply calls the provider's `refresh()` method.
        *   In `package.json`, contribute this command to the `view/title` menu, with `when: "view == fileBookmarker.bookmarksView"` and an `icon: "$(refresh)"`.
    *   **Acceptance Criteria:** A refresh icon is visible on the "Bookmarks" view, and clicking it re-renders the tree.

*   **Task 4.3: Add an Item-Specific "Remove" Action**
    *   **Specification:** Implement the ability to remove a bookmark by right-clicking it in the view.
    *   **Details:**
        *   In the `getTreeItem` method of the provider, set `treeItem.contextValue = 'bookmarkItem'`.
        *   Create a new command `fileBookmarker.removeBookmark`. The handler will receive the `Bookmark` object as an argument. It should update `globalState` to remove this bookmark.
        *   In `package.json`, contribute this command to the `view/item/context` menu. The `when` clause must be `"view == fileBookmarker.bookmarksView && viewItem == bookmarkItem"`.
    *   **Acceptance Criteria:** Right-clicking a bookmark shows a "Remove Bookmark" action. Executing it removes the item from the list and from persistent storage.