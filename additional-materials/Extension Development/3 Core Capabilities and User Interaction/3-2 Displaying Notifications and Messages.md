### **3.2. Displaying Notifications and Messages**

While commands provide the entry points for your extension's logic, notifications are the primary channel for communicating information back to the user. The VS Code API provides a simple yet powerful set of functions for displaying non-modal messages that appear in the bottom-right corner of the workbench.

From an architectural standpoint, notifications should be used judiciously. They are an interruption of the user's workflow and should be reserved for information that is either a direct result of a user action or is of significant importance. Overusing notifications is a common anti-pattern that leads to a "noisy" and frustrating user experience.

The core API for notifications resides in the `vscode.window` namespace. There are three levels of severity, each with a distinct visual appearance and semantic purpose.

#### **Information Messages: `showInformationMessage`**

This is the most common type of notification, used for providing general, non-critical feedback to the user. It is the appropriate choice for confirming that a long-running command has completed successfully or for displaying a piece of requested information.

**Basic Usage:**

The simplest form takes a single string argument.

```typescript
// in src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.showInfo', () => {
            vscode.window.showInformationMessage('Operation completed successfully.');
        })
    );
}
```
When the `myExtension.showInfo` command is executed, a blue-hued "toast" notification will appear.

**Adding Action Items (Buttons)**

Notifications can be made interactive by providing additional string arguments. Each string will be rendered as a button within the notification. The `showInformationMessage` function returns a `Thenable<string | undefined>`, which resolves to the string of the button the user clicked, or `undefined` if the notification was dismissed (e.g., by clicking the 'X' or pressing `Esc`).

This pattern is essential for creating workflows where you need a simple, quick confirmation or choice from the user.

```typescript
// in src/extension.ts
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.askAQuestion', async () => {
            const answer = await vscode.window.showInformationMessage(
                'How are you feeling today?', 
                'Good', 
                'Bad'
            );

            if (answer === 'Good') {
                vscode.window.showInformationMessage('Glad to hear it!');
            } else if (answer === 'Bad') {
                vscode.window.showInformationMessage('Sorry to hear that. I hope your day gets better!');
            } else {
                // User dismissed the notification
                console.log('User did not respond.');
            }
        })
    );
}
```
**An important point of professional practice:** You must always handle the `undefined` case. A user is never obligated to interact with your notification. Your code must be robust enough to handle the user simply ignoring the message. The `async/await` syntax makes this pattern clean and highly readable.

#### **Warning and Error Messages**

For situations that require more user attention, the API provides `showWarningMessage` and `showErrorMessage`. They function identically to `showInformationMessage` but have distinct colors (yellow/orange for warnings, red for errors) and are semantically different.

*   `vscode.window.showWarningMessage`: Use this to inform the user about a potential problem that is not a critical failure. For example, a linter might use this if a configuration file is found but contains a deprecated property.

*   `vscode.window.showErrorMessage`: Reserve this for actual failures. For example, if a command that relies on a network request fails, an error message is the appropriate way to communicate that failure.

```typescript
// in src/extension.ts
async function deployApp() {
    try {
        // ... some deployment logic that might fail
        const result = await someAsyncDeploymentFunction();

        if (result.hasWarnings) {
            vscode.window.showWarningMessage('Deployment succeeded, but with warnings. Check the output for details.');
        } else {
            vscode.window.showInformationMessage('Deployment successful!');
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Deployment failed: ${error.message}`);
    }
}
```

#### **Advanced Control with `MessageItem` and `MessageOptions`**

For more advanced scenarios, the notification functions have overloads that accept `MessageItem` objects and a `MessageOptions` object.

A `MessageItem` is an object with a `title` property. This allows you to differentiate between the button title the user sees and the value your code receives, which can be useful for localization or more complex logic.

```typescript
// in src/extension.ts
interface MyMessageItem extends vscode.MessageItem {
    id: 'reload' | 'cancel'; // Add custom metadata
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.updateAvailable', async () => {
            const response = await vscode.window.showInformationMessage<MyMessageItem>(
                'An update is available for this extension.',
                { title: 'Reload Window', id: 'reload' },
                { title: 'Later', id: 'cancel', isCloseAffordance: true } // isCloseAffordance maps 'Esc' to this item
            );

            if (response?.id === 'reload') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        })
    );
}
```
In this example, we use a custom interface extending `MessageItem` to add a machine-readable `id`. Our code then checks this `id` instead of the `title` string, which is a more robust pattern, especially if you plan to localize the button titles. The `isCloseAffordance` property is a nice UX touch, mapping the `Esc` key to a "cancel"-like action.

The `MessageOptions` object allows you to create a **modal** notification.

```typescript
// in src/extension.ts
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.performDestructiveAction', async () => {
            const confirmation = await vscode.window.showWarningMessage(
                'Are you sure you want to delete all temporary files? This cannot be undone.',
                { modal: true }, // This makes the dialog modal
                'Yes, delete them'
            );

            if (confirmation === 'Yes, delete them') {
                // ... proceed with deletion
            }
        })
    );
}
```
**Architectural Guidance on Modality:** A modal dialog freezes the entire UI until the user interacts with it. This is a highly disruptive user experience. **You should avoid modal dialogs unless absolutely necessary.** They are only appropriate for critical questions that must be answered before the user can proceed, such as confirming a destructive, un-doable action. For almost all other cases, a non-modal notification with action items is the superior, more professional choice.

#### **Progress Notifications**

For long-running operations, you can use `window.withProgress` to show progress in a standardized way. This API is highly flexible and can render progress in different locations. The most common is the notification area.

```typescript
// in src/extension.ts
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('myExtension.longRunningOperation', () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Processing your files...",
                cancellable: true
            }, async (progress, token) => {

                token.onCancellationRequested(() => {
                    console.log("User canceled the long running operation");
                });

                progress.report({ increment: 0, message: "Initializing..." });

                await new Promise(resolve => setTimeout(resolve, 1000));
                
                progress.report({ increment: 20, message: "Loading data..." });

                // Simulate work
                await new Promise(resolve => setTimeout(resolve, 2000));

                progress.report({ increment: 50, message: "Analyzing dependencies..." });

                // Simulate more work
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                progress.report({ increment: 30, message: "Finalizing..." });

                return "Operation Finished!";
            });
        })
    );
}
```
This API provides a structured way to handle progress reporting, including increments, messages, and cancellation. This is the correct, professional way to handle any task that might take more than a second or two to complete, as it provides crucial feedback to the user and prevents them from thinking the editor has frozen.