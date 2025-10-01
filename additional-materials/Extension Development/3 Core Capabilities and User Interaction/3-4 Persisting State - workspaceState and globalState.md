### **3.4. Persisting State: `workspaceState` and `globalState`**

A stateless extension is limited. To build truly intelligent and user-friendly features, your extension must have a memory. It needs to remember user preferences, cache data, and maintain context across restarts of the editor. The VS Code API provides a simple, robust, and secure mechanism for this: the **Memento API**.

The `ExtensionContext` object, which is passed to your `activate` function, provides access to two distinct storage scopes, each designed for a different architectural purpose:

1.  **`context.workspaceState`**: For data that is relevant **only to the current workspace**.
2.  **`context.globalState`**: For data that should be available **across all workspaces** and editor windows.

Both of these properties are instances of the `Memento` interface, which is a simple key-value store. The values you store must be JSON-serializable (strings, numbers, booleans, arrays, or simple objects).

#### **The `Memento` API**

The `Memento` interface is straightforward, providing two primary methods:

*   `get<T>(key: string): T | undefined`: Retrieves a value from the store. It returns the stored value, or `undefined` if the key does not exist.
*   `get<T>(key: string, defaultValue: T): T`: An overload that provides a default value to return if the key is not found. This is often safer and leads to cleaner code than handling `undefined`.
*   `update(key: string, value: any): Thenable<void>`: Stores or updates a value in the store. The operation is asynchronous and returns a `Thenable`. You should `await` this call if you need to ensure the data is written before proceeding. Setting a key's value to `undefined` will remove it from the storage.

#### **Workspace State: `context.workspaceState`**

`workspaceState` is the correct choice for any data that is intrinsically tied to the project the user is currently working on. VS Code manages the underlying storage, ensuring that when a user re-opens a workspace, the same state is made available to your extension.

**Common Use Cases for `workspaceState`:**

*   Caching the results of a slow, project-specific analysis (e.g., a dependency tree).
*   Remembering a user's choice for a workspace-specific prompt (e.g., "Don't ask me again for this workspace").
*   Storing the last-used configuration for a workspace-specific task.

**Code Example: Remembering a User's Choice**

Let's build a command that asks the user to select a default linter for their project, and only asks once per workspace.

```typescript
import * as vscode from 'vscode';

// Define a key for our storage. Using a constant is a professional best practice
// to avoid typos and centralize the key name.
const LINTER_CHOICE_KEY = 'myExtension.linterChoice';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.configureLinter', async () => {
            // First, check if a choice has already been made for this workspace.
            const currentChoice = context.workspaceState.get<string>(LINTER_CHOICE_KEY);

            if (currentChoice) {
                vscode.window.showInformationMessage(`Current linter for this workspace is: ${currentChoice}`);
                return;
            }

            // If no choice has been made, prompt the user.
            const linter = await vscode.window.showQuickPick(['ESLint', 'JSHint', 'TSLint'], {
                placeHolder: 'Select a default linter for this workspace'
            });

            if (linter) {
                // The user made a choice. Store it in the workspace state.
                await context.workspaceState.update(LINTER_CHOICE_KEY, linter);
                vscode.window.showInformationMessage(`Set '${linter}' as the linter for this workspace.`);
            }
        })
    );

    // A command to clear the stored setting for demonstration purposes.
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.clearLinterChoice', async () => {
            // To remove a key, update it with `undefined`.
            await context.workspaceState.update(LINTER_CHOICE_KEY, undefined);
            vscode.window.showInformationMessage('Workspace linter choice has been cleared.');
        })
    );
}
```
If you run this code, the first time you execute the `myExtension.configureLinter` command in a workspace, it will prompt you. On all subsequent runs *in that same workspace*, it will simply show the stored value. If you open a different project folder, it will prompt you again, because the state is scoped to the workspace.

#### **Global State: `context.globalState`**

`globalState` is the correct choice for data that applies to the user's installation of VS Code as a whole, independent of the project they are working on.

**A critical point of understanding:** "Global" does not mean it's shared between users. It is global *to the user*, but across all their projects and editor windows.

**Common Use Cases for `globalState`:**

*   Storing a global user preference that isn't important enough to be a formal setting (e.g., the last position of a UI element).
*   Tracking whether a "What's New" notification has been shown for the current extension version.
*   Caching data that is not project-specific, like a downloaded list of available templates.

**Code Example: Showing a "What's New" Message Once**

This is a classic and professional use case for `globalState`. You want to inform users about a new feature, but only the first time they use the new version of your extension.

```typescript
import * as vscode from 'vscode';

const LAST_SHOWN_VERSION_KEY = 'myExtension.lastShownVersion';

export function activate(context: vscode.ExtensionContext) {
    // Get the current version of our extension from package.json.
    const currentVersion = context.extension.packageJSON.version as string;
    
    // Get the last version for which we showed the "What's New" message.
    // We use a default value of '0.0.0' to handle the very first run.
    const lastShownVersion = context.globalState.get<string>(LAST_SHOWN_VERSION_KEY, '0.0.0');

    // A simple version comparison (in a real extension, use a robust library like 'semver').
    if (isNewerVersion(currentVersion, lastShownVersion)) {
        vscode.window.showInformationMessage(
            `Welcome to version ${currentVersion} of My Extension! Check out the new 'Awesome' feature.`,
            'Learn More'
        ).then(selection => {
            if (selection === 'Learn More') {
                // Open a URL to your release notes.
                vscode.env.openExternal(vscode.Uri.parse('https://...'));
            }
        });

        // IMPORTANT: Update the global state with the current version.
        context.globalState.update(LAST_SHOWN_VERSION_KEY, currentVersion);
    }
}

// A simplified version comparison function for demonstration.
function isNewerVersion(current: string, previous: string): boolean {
    // In a real extension, use the `semver` npm package for robust comparison.
    // e.g., return semver.gt(current, previous);
    return current !== previous;
}
```
This pattern ensures that the "Welcome" message is a one-time event per update, providing a professional and non-intrusive onboarding experience for new features.

#### **The `setKeysForSync` Method**

A powerful feature of `globalState` is its integration with **Settings Sync**. By default, state stored in `globalState` is local to a single machine. However, you can explicitly designate certain keys whose values should be roamed across all of a user's machines where they are logged into Settings Sync.

This is architecturally significant. It allows you to provide a consistent user experience across their different development environments.

**Code Example: Syncing the "What's New" flag**

Let's modify our previous example. If a user sees the "What's New" message on their work desktop, they shouldn't see it again on their personal laptop.

```typescript
import * as vscode from 'vscode';

const LAST_SHOWN_VERSION_KEY = 'myExtension.lastShownVersion';

export function activate(context: vscode.ExtensionContext) {
    // Tell Settings Sync that this key should be roamed.
    // This should be done once, at activation.
    context.globalState.setKeysForSync([LAST_SHOWN_VERSION_KEY]);
    
    const currentVersion = context.extension.packageJSON.version as string;
    const lastShownVersion = context.globalState.get<string>(LAST_SHOWN_VERSION_KEY, '0.0.0');

    if (isNewerVersion(currentVersion, lastShownVersion)) {
        // ... (showInformationMessage logic as before) ...

        context.globalState.update(LAST_SHOWN_VERSION_KEY, currentVersion);
    }
}

// ... (isNewerVersion function)
```
With this one additional line, `context.globalState.setKeysForSync`, the value associated with `myExtension.lastShownVersion` will now be part of the user's synced settings payload. This small change dramatically improves the user experience for those working across multiple machines.

Choosing the correct storage scope—`workspaceState` for project-specific data and `globalState` for user-specific data—is a fundamental architectural decision that directly impacts the robustness and usability of your extension.