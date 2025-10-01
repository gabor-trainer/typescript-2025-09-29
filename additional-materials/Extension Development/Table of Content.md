### VS Code Extensions Development - Bonus Material

### **Module 1: Introduction & Your First Extension**

*   **1.1. The Power of Extensibility**
    *   What's possible? A showcase of powerful extensions (GitLens, ESLint, etc.).
    *   Our philosophy: Building high-quality, efficient, and well-integrated extensions.
*   **1.2. Setting Up Your Development Environment**
    *   Prerequisites: Node.js, npm/yarn, Git.
    *   Installing the Yeoman extension generator (`yo` and `generator-code`).
*   **1.3. Scaffolding Your First Project with `yo code`**
    *   Running the generator.
    *   Explaining the template options (TypeScript vs. JavaScript, bundler choices).
    *   Walking through the generated file structure.
*   **1.4. Running 'Hello World'**
    *   Understanding the `F5` debug launch.
    *   Introducing the "Extension Development Host" window.
    *   Invoking the command from the Command Palette.
*   **1.5. The Core Development Loop**
    *   Making a simple code change in `extension.ts`.
    *   Reloading the Extension Development Host.
    *   Observing the change.
*   **1.6. Debugging Your Extension**
    *   Setting breakpoints in `extension.ts`.
    *   Inspecting variables in the Debug view.
    *   Using the Debug Console.
*   **1.7. Lab 1: Your First Modifications**
    *   Objective: Solidify the basic development loop.
    *   Task 1: Change the text of the "Hello World" notification.
    *   Task 2: Add a second command that displays a warning message.
    *   Task 3: Change the user-facing title of the "Hello World" command in `package.json`.

---

### **Module 2: The Extension Anatomy: `package.json` & Activation**

*   **2.1. The Extension Manifest: `package.json`**
    *   Its role as the "contract" between your extension and VS Code.
    *   Essential fields: `name`, `publisher`, `engines`, `main`, `browser`.
*   **2.2. Contribution Points vs. VS Code API: The "What" and the "How"**
    *   **Contribution Points (Declarative):** Telling VS Code *what* your extension offers (e.g., `contributes.commands`, `contributes.menus`).
    *   **VS Code API (Imperative):** Telling VS Code *how* to implement the functionality (e.g., `vscode.commands.registerCommand`).
*   **2.3. Activation Events: When to Wake Up Your Extension**
    *   The importance of lazy loading for performance.
    *   Deep dive into the `activationEvents` array.
    *   Common events: `onCommand`, `onLanguage`, `onView`.
    *   The `*` (startup) event and why you should almost never use it.
    *   Understanding implicit activation (VS Code >= 1.74).
*   **2.4. The Entry File: `activate` and `deactivate`**
    *   The `activate(context)` function: The entry point of your extension's code.
    *   Understanding the `ExtensionContext` parameter.
    *   The `context.subscriptions` pattern: The professional way to manage disposables.
    *   The `deactivate()` function: When and why to use it for cleanup.
*   **2.5. Lab 2: Declaring and Registering a New Command**
    *   Objective: Connect the concepts of contribution points, activation, and API registration.
    *   Task 1: Add a new command contribution in `package.json`.
    *   Task 2: (For older VS Code versions) Add a corresponding `onCommand` activation event.
    *   Task 3: Implement the command's functionality using `vscode.commands.registerCommand` in `extension.ts`.
    *   Task 4: Add the command's disposable to `context.subscriptions`.

---

### **Module 3: Core Capabilities & User Interaction**

*   **3.1. Mastering Commands**
    *   Review: `registerCommand` and the `contributes.commands` section.
    *   Executing commands programmatically with `vscode.commands.executeCommand`.
    *   Passing arguments to and from commands.
*   **3.2. Displaying Notifications and Messages**
    *   `showInformationMessage`, `showWarningMessage`, `showErrorMessage`.
    *   Adding action items (buttons) to notifications and handling the result.
    *   UX Guideline: When (and when not) to show a notification.
*   **3.3. Collecting User Input with Quick Picks**
    *   Showing a simple list of strings with `showQuickPick`.
    *   Using `QuickPickItem` for more complex items with descriptions and details.
    *   Handling single and multiple selections (`canPickMany`).
    *   A brief look at `showInputBox` for free-form text entry.
*   **3.4. Persisting State: `workspaceState` and `globalState`**
    *   Understanding the `Memento` API.
    *   `workspaceState`: Storing data for the current workspace only.
    *   `globalState`: Storing data globally, across all workspaces.
    *   Practical use cases: remembering user choices, storing settings.
*   **3.5. Lab 3: Building an Interactive Command**
    *   Objective: Combine commands, user input, and state management.
    *   Task 1: Create a command that presents a user with three choices via a Quick Pick.
    *   Task 2: Based on their choice, display a different information message.
    *   Task 3: Store the user's last choice in `globalState`.
    *   Task 4: On the next run, use the stored value to pre-select an item or show a "Last choice was..." message.

---

### **Module 4: Extending the Workbench UI**

*   **4.1. Overview of the Workbench UI**
    *   Visual map of the key UI areas: Activity Bar, Sidebar, Editor, Panel, Status Bar.
    *   The relationship between View Containers and Views.
*   **4.2. Contributing to the Activity Bar & View Containers**
    *   The `contributes.viewsContainers` point to create a new home for your views.
    *   Associating an icon and title with your View Container.
*   **4.3. Displaying Data with Tree Views**
    *   The `contributes.views` point to place a view inside a container.
    *   Implementing the `TreeDataProvider` interface: `getTreeItem` and `getChildren`.
    *   Understanding the `TreeItem` class and its key properties (`label`, `collapsibleState`, `command`, `iconPath`, `contextValue`).
    *   Registering the provider with `vscode.window.registerTreeDataProvider`.
*   **4.4. Making Views Interactive**
    *   Refreshing view content with the `onDidChangeTreeData` event.
    *   Adding View Actions (icons on the view title bar) via `contributes.menus` (`view/title`).
    *   Adding actions to individual `TreeItem`s (inline and context menus) via `contributes.menus` (`view/item/context`).
*   **4.5. Adding Information to the Status Bar**
    *   Creating a `StatusBarItem` with `vscode.window.createStatusBarItem`.
    *   Key properties: `alignment`, `priority`, `text`, `tooltip`, and `command`.
    *   Best Practices: When and what to show in the Status Bar.
*   **4.6. Lab 4: Building a Custom View**
    *   Objective: Create a fully functional UI component in the Sidebar.
    *   Task 1: Contribute a new View Container to the Activity Bar.
    *   Task 2: Implement a simple `TreeDataProvider` to show a list of items in a new View.
    *   Task 3: Add a "Refresh" action to the view's title bar that updates the tree data.
    *   Task 4: Make each `TreeItem` execute a command when clicked.

***

This plan gives us a solid, logical progression for the first half of the training. We'll make sure each lab builds on the last, reinforcing the concepts in a practical way. Next, we can work on the content for each of these subchapters.