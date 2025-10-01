### **3.3. Collecting User Input: `QuickPick` and `InputBox`**

While notifications are excellent for one-way communication *to* the user, a professional extension must often solicit input *from* the user. The VS Code API provides two primary, non-intrusive UI components for this purpose, both located in the `vscode.window` namespace: the **Quick Pick** and the **Input Box**.

These components are designed to integrate seamlessly into the editor's command-driven workflow. They appear at the top of the window, inheriting the look and feel of the Command Palette, and they do not block the UI in the same way a modal dialog does. Mastering these APIs is essential for creating sophisticated and user-friendly command flows.

#### **The Quick Pick: `showQuickPick`**

The Quick Pick is the ideal component for asking the user to select one or more items from a predefined list. Its power lies in its flexibility, supporting simple string arrays, complex objects, and robust filtering.

##### **Basic Usage: A List of Strings**

The most straightforward use of `showQuickPick` is to present a list of string options. The function returns a `Thenable<string | undefined>`, which resolves to the string the user selected, or `undefined` if they dismissed the Quick Pick (e.g., by pressing `Esc`).

```typescript
// in src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.selectFramework', async () => {
            const options = ['React', 'Angular', 'Vue', 'Svelte'];

            const selection = await vscode.window.showQuickPick(options, {
                placeHolder: 'Select your favorite front-end framework',
            });

            if (!selection) {
                vscode.window.showInformationMessage('No selection made.');
                return;
            }

            vscode.window.showInformationMessage(`You chose: ${selection}`);
        })
    );
}
```
In this example, the `placeHolder` option provides essential context to the user, explaining what they are expected to select. As with notifications, a robust command handler must always check for an `undefined` return value.

##### **Advanced Usage: `QuickPickItem`**

For a richer user experience, you should provide an array of `QuickPickItem` objects instead of simple strings. This interface allows you to define a `label`, `description`, `detail`, and even an `iconPath`, giving you granular control over the presentation of each item.

The `QuickPickItem` interface:
*   `label`: The main text for the item. Required.
*   `description`: A secondary, less prominent text that appears on the same line as the label. Excellent for showing a version number or a short status.
*   `detail`: A more detailed string that appears on a separate line below the label. Useful for providing extra context without cluttering the main line.
*   `iconPath`: A `vscode.Uri` or `ThemeIcon` to display an icon next to the item.

Let's refactor our framework selector to use `QuickPickItem`s.

```typescript
// in src/extension.ts
interface FrameworkPickItem extends vscode.QuickPickItem {
    id: string; // Add a machine-readable ID
    releaseYear: number;
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.selectFrameworkRich', async () => {
            const frameworkItems: FrameworkPickItem[] = [
                {
                    label: '$(flame) React', // Using a Codicon
                    description: 'From Meta',
                    detail: 'A popular library for building user interfaces with a component-based architecture.',
                    id: 'react',
                    releaseYear: 2013
                },
                {
                    label: '$(organization) Angular',
                    description: 'From Google',
                    detail: 'A comprehensive platform and framework for building single-page client applications.',
                    id: 'angular',
                    releaseYear: 2016
                },
                {
                    label: '$(package) Vue.js',
                    description: 'The Progressive Framework',
                    detail: 'An approachable, performant, and versatile framework for building web user interfaces.',
                    id: 'vue',
                    releaseYear: 2014
                }
            ];

            const selection = await vscode.window.showQuickPick<FrameworkPickItem>(frameworkItems, {
                title: 'Framework Selection',
                placeHolder: 'Search for a framework by name or creator',
                matchOnDescription: true, // Also filter based on the `description` field
                matchOnDetail: true,      // And the `detail` field
            });

            if (!selection) {
                return;
            }

            vscode.window.showInformationMessage(`You selected ${selection.label}, which was released in ${selection.releaseYear}.`);
        })
    );
}
```
**Professional Insights from this example:**
*   **Custom Interface:** We defined our own `FrameworkPickItem` extending `QuickPickItem`. This is a best practice. It allows us to attach our own application-specific data (like `id` and `releaseYear`) directly to the pick item. The `showQuickPick` function is generic, so it returns the exact object you pass in, preserving your custom properties.
*   **Codicons:** We used built-in VS Code icons (`$(flame)`, etc.) in the `label`. This is a simple way to make the UI richer and more visually scannable.
*   **Filtering:** The `matchOnDescription` and `matchOnDetail` options significantly improve usability, allowing the user to find items by searching for text that isn't just in the main label.
*   **Title:** The `title` option adds a persistent header to the Quick Pick, which is useful for establishing context, especially in multi-step flows.

##### **Multiple Selections**

To allow the user to select multiple items, set the `canPickMany` option to `true`. In this mode, the function's return signature changes to `Thenable<T[] | undefined>`.

```typescript
// in src/extension.ts
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.selectDependencies', async () => {
            const dependencies = ['eslint', 'prettier', 'jest', 'webpack'];

            const selections = await vscode.window.showQuickPick(dependencies, {
                canPickMany: true,
                placeHolder: 'Select dependencies to install'
            });

            if (!selections || selections.length === 0) {
                vscode.window.showInformationMessage('No dependencies selected.');
                return;
            }

            vscode.window.showInformationMessage(`Installing: ${selections.join(', ')}`);
        })
    );
}
```

#### **The Input Box: `showInputBox`**

When you need to collect free-form text from the user, the `showInputBox` function is the correct tool. It provides a simple input field and returns the string the user entered, or `undefined` if dismissed.

**Basic Usage:**

```typescript
// in src/extension.ts
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.createFile', async () => {
            const filename = await vscode.window.showInputBox({
                prompt: 'Enter the name of the new file',
                placeHolder: 'e.g., my-new-component.ts',
                value: 'default-name.ts', // A pre-filled value
                valueSelection: [0, 12] // Selects 'default-name' in the pre-filled value
            });

            if (filename) {
                vscode.window.showInformationMessage(`Creating file: ${filename}`);
                // In a real extension, you would now use the workspace API to create the file.
            }
        })
    );
}
```

##### **Input Validation**

One of the most critical features of `showInputBox` is the ability to provide real-time validation. This is achieved through the `validateInput` option, a function that is called every time the user types.

*   If the input is valid, the function should return `null` or `undefined`.
*   If the input is invalid, the function should return a string containing the error message to display.

```typescript
// in src/extension.s
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.createClass', async () => {
            const className = await vscode.window.showInputBox({
                prompt: 'Enter a valid class name',
                validateInput: (text: string): string | undefined => {
                    if (!text) {
                        return 'Class name cannot be empty.';
                    }
                    if (/\s/.test(text)) {
                        return 'Class name cannot contain whitespace.';
                    }
                    if (!/^[A-Z]/.test(text)) {
                        return 'Class name must start with a capital letter.';
                    }
                    // Input is valid
                    return undefined;
                }
            });

            if (className) {
                vscode.window.showInformationMessage(`Creating class ${className}...`);
            }
        })
    );
}
```
This immediate feedback prevents user errors and ensures that your command only receives valid data, a core principle of robust application design.

#### **Creating Multi-Step Input Flows**

A common architectural question is how to handle a sequence of user inputs, like a wizard. While the API provides lower-level building blocks (`createQuickPick`, `createInputBox`), a simple and effective pattern for sequential input is to chain `async/await` calls to `showQuickPick` and `showInputBox`.

```typescript
// in src/extension.ts
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.scaffoldComponent', async () => {
            // Step 1: Get component type
            const componentType = await vscode.window.showQuickPick(['Class Component', 'Function Component'], {
                title: 'Component Scaffolder (1/2)',
                placeHolder: 'Select component type'
            });
            if (!componentType) { return; } // User cancelled

            // Step 2: Get component name
            const componentName = await vscode.window.showInputBox({
                title: 'Component Scaffolder (2/2)',
                prompt: 'Enter the component name',
                validateInput: text => text ? undefined : 'Name cannot be empty'
            });
            if (!componentName) { return; } // User cancelled

            vscode.window.showInformationMessage(`Scaffolding ${componentType}: ${componentName}`);
        })
    );
}
```
This pattern is clean, readable, and handles cancellation at each step gracefully. For more complex, non-linear, or stateful wizards, the lower-level `createQuickPick` API offers more control, but for most use cases, this chained approach is the professional standard.