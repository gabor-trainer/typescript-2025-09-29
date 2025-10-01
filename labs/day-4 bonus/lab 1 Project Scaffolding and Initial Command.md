### **Lab 1: Project Scaffolding and Initial Command**

**Objective:**
In this lab, you will perform the foundational steps of creating a Visual Studio Code extension. You will use the official scaffolding tool to generate a complete project, modify its manifest to define your first command, and implement the command's initial logic. By the end of this lab, you will have a running and debuggable extension that interacts with the active editor, solidifying your understanding of the core development loop.

**Project:** File Bookmarker
**Time to complete:** 20-25 minutes

---

#### **Step 1: Generate the Project Structure**

We will begin by creating a new, professional-grade extension project using the `yo code` generator. We will provide all necessary configuration options via the command line to ensure a consistent and repeatable setup.

**Instructions:**

1.  Open your system terminal (not the one inside VS Code).
2.  Navigate to the directory where you store your development projects (e.g., `~/projects` or `D:\dev`).
3.  Execute the following single-line command. This command will create a new folder named `file-bookmarker` and scaffold the project inside it.

    ```bash
    npx --package yo --package generator-code -- yo code file-bookmarker -t=ts --bundler=esbuild -q --pkgManager=npm
    ```

    *   **Analysis of this command:**
        *   `file-bookmarker`: This is the `destination` argument, specifying the folder name for our project.
        *   `-t=ts`: Sets the `--extensionType` to `TypeScript`.
        *   `--bundler=esbuild`: Selects `esbuild` as our bundler, the modern choice for performance.
        *   `-q`: Enables `--quick` mode, accepting defaults for non-essential prompts like description and Git initialization.
        *   `--pkgManager=npm`: Explicitly sets `npm` as our package manager.

4.  Once the command completes, navigate into the new directory and open it in VS Code:

    ```bash
    cd file-bookmarker
    code .
    ```

5.  When VS Code opens, it may prompt you to "Trust the authors of the files in this folder." Select **"Yes, I trust the authors"**. It might also recommend installing extensions suggested by the workspace (e.g., for `esbuild` problem matching). It is a good practice to install these.

6.  Finally, open the integrated terminal in your new VS Code window (Ctrl+` ) and run `npm install` to ensure all development dependencies are correctly installed.

You now have a clean, professionally scaffolded extension project ready for development.

---

#### **Step 2: Define the "Add Bookmark" Command Contribution**

Our next task is to modify the extension's manifest (`package.json`) to replace the default "Hello World" command with our primary "Add Bookmark" command. This is the declarative part of our feature.

**Instructions:**

1.  Open the `package.json` file in the root of your project.
2.  Locate the `contributes` section, and within it, the `commands` array.
3.  Replace the entire default command object with our new command definition.

**Full Source Code: `package.json` (partial)**

```json
{
    // ... other properties like name, displayName, etc. ...
    "contributes": {
        "commands": [
            {
                "command": "fileBookmarker.addBookmark",
                "title": "Bookmark: Add File",
                "category": "Bookmark"
            }
        ]
    }
    // ... other properties like scripts, devDependencies, etc. ...
}
```

**Explanation of Changes:**

*   `"command": "fileBookmarker.addBookmark"`: We have defined a new, unique Command ID. The `fileBookmarker.` prefix acts as a namespace, preventing collisions with other extensions. This ID is the critical link to our implementation code.
*   `"title": "Bookmark: Add File"`: This is the human-readable text that will appear in the Command Palette. The "Bookmark: " prefix serves as a category-like grouping for the user, making all of your extension's commands easy to find by typing "Bookmark".
*   `"category": "Bookmark"`: This property provides a formal grouping for the command in UI surfaces that use it, like the Keyboard Shortcuts editor.

Save the `package.json` file.

---

#### **Step 3: Implement the Command Handler**

Now we will write the imperative code—the "how"—that provides the logic for the command we just declared.

**Instructions:**

1.  Open the `src/extension.ts` file.
2.  Replace the entire content of the file with the following code.

**Full Source Code: `src/extension.ts`**

```typescript
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-bookmarker" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const addBookmarkCommand = vscode.commands.registerCommand('fileBookmarker.addBookmark', () => {
		// This is the implementation of our command.

		// Access the currently active text editor
		const activeEditor = vscode.window.activeTextEditor;

		// A professional extension should always handle the case where there is no active editor.
		if (!activeEditor) {
			vscode.window.showWarningMessage("Cannot add bookmark: No active file open.");
			return; // Exit the command handler
		}

		// Get the URI of the document in the active editor.
		const fileUri = activeEditor.document.uri;

		// Display an information message to the user, confirming the action.
		// We use `fileUri.fsPath` to get the platform-specific file system path for display.
		vscode.window.showInformationMessage(`Bookmarked: ${fileUri.fsPath}`);
	});

	// Add the disposable returned by registerCommand to the context's subscriptions.
	// This ensures that the command is properly cleaned up when the extension is deactivated.
	context.subscriptions.push(addBookmarkCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
```

**Explanation of the Code:**

*   **`import * as vscode from 'vscode';`**: This line imports the entire VS Code API and makes it accessible via the `vscode` alias.
*   **`activate(context: vscode.ExtensionContext)`**: This is the main entry point that VS Code calls when our extension is activated.
*   **`vscode.commands.registerCommand('fileBookmarker.addBookmark', ...)`**: This is the core API call. It registers our command handler (the arrow function) and associates it with the Command ID we defined in `package.json`. It returns a `Disposable` object.
*   **`const activeEditor = vscode.window.activeTextEditor;`**: We access the `window` namespace to get a reference to the currently active text editor. This property will be `undefined` if no editor has focus (e.g., if the user is focused on the Explorer sidebar).
*   **`if (!activeEditor)`**: This is a critical guard clause. A robust command must always handle edge cases gracefully. Here, we check if an editor is actually open and provide a helpful warning message if not.
*   **`const fileUri = activeEditor.document.uri;`**: Every open document has a URI. We retrieve this `vscode.Uri` object, which is the canonical way to represent a resource in VS Code.
*   **`fileUri.fsPath`**: The `.fsPath` property of a URI gives you the platform-specific file system string (e.g., `C:\Users\...\file.ts` on Windows or `/home/.../file.ts` on Linux/macOS). We use this for our display message.
*   **`context.subscriptions.push(addBookmarkCommand);`**: This is the professional pattern for resource management. We add the `Disposable` from our command registration to the context's subscriptions array, guaranteeing that VS Code will clean it up properly when the extension is deactivated.

---

#### **Step 4: Run and Verify**

You have now completed the first full implementation cycle. Let's verify that it works as specified.

**Instructions:**

1.  Press `F5` to launch the Extension Development Host.
2.  In the host window, open any file from your workspace.
3.  Open the Command Palette (Ctrl+Shift+P).
4.  Type "Bookmark" and select your command, **"Bookmark: Add File"**.
5.  **Verify:** A notification should appear in the bottom-right corner, displaying the full path of the file you have open.
6.  Now, close all open editor tabs.
7.  Run the **"Bookmark: Add File"** command again.
8.  **Verify:** A *warning* notification should appear with the message "Cannot add bookmark: No active file open."

You have successfully created an extension that is aware of the editor's context, handles edge cases, and provides clear user feedback. This forms the solid foundation upon which we will build in the next lab.