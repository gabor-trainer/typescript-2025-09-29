### **A: "Workspace Notes"**

*   **Vision:** To provide developers with a frictionless, in-editor scratchpad for every workspace, allowing them to capture tasks, code snippets, and reminders without ever leaving VS Code or creating temporary files.

*   **Description:** An extension that adds a "Notes" panel to the Explorer. Users can quickly add, view, and delete short, text-based notes that are automatically saved and associated with the current workspace. It's a simple, persistent to-do list and idea board integrated directly into the development environment.

*   **Skills:**
    *   **Core APIs:** `commands`, `showInputBox`, `showQuickPick`, `workspaceState`, `TreeDataProvider`, `menus`.
    *   **Learning Arc:** Starts with simple commands to add notes via input boxes. Evolves to list notes in a Quick Pick. Culminates in a custom Tree View that displays all notes. State management is a core concept, handled cleanly by `workspaceState`.
    *   **Minimal "Uncovered" API:** The only potential step beyond the core modules would be a command to open a note's content in a new, untitled editor tab. This is a single, simple call to `vscode.workspace.openTextDocument({ content: '...' })` which can be provided as a one-line, "black box" helper function for the lab.

---

### **B: "File Bookmarker"**

*   **Vision:** To empower developers to create their own persistent, cross-project collection of important files, providing instant navigation to key code locations regardless of which workspace is currently open.

*   **Description:** An extension that allows users to "bookmark" any file with a single command. Bookmarked files are displayed in a dedicated "Bookmarks" view in the Activity Bar, providing one-click access. This acts as a personalized, global "favorites" list for your entire file system.

*   **Skills:**
    *   **Core APIs:** `commands`, `window.activeTextEditor`, `globalState`, `TreeDataProvider`, `menus`.
    *   **Learning Arc:** Begins with a command to capture the active file's path. Progresses to storing this list in `globalState` (a key distinction from `workspaceState`). Finally, it builds a `TreeDataProvider` to render the bookmarks, correctly utilizing `TreeItem.resourceUri` to get native file icons and behavior.
    *   **Minimal "Uncovered" API:** The command to open a bookmarked file uses `vscode.commands.executeCommand('vscode.open', uri)`. This is a perfect example of a minimal, guided step. It teaches the powerful concept of executing built-in VS Code commands programmatically, which is covered in Module 3. It feels like a natural extension of the curriculum, not a significant leap.

---

### **C: "JSON Key Viewer"**

*   **Vision:** To offer developers a structured, read-only tree view of any JSON file, enabling quick navigation and understanding of its key-value structure without having to manually parse the raw text.

*   **Description:** An extension that adds a command, "Show JSON Key Structure," which opens a new view in the Sidebar. This view displays the top-level keys of the active JSON file as a tree. Nested objects can be expanded to explore the hierarchy. It's a simple, powerful tool for inspecting configuration files like `package.json` or `tsconfig.json`.

*   **Skills:**
    *   **Core APIs:** `commands`, `window.activeTextEditor`, `JSON.parse`, `TreeDataProvider`, `menus`.
    *   **Learning Arc:** Starts with a command that reads the content of the active editor. Evolves to parse the text as JSON and log the top-level keys. Culminates in a `TreeDataProvider` that represents the JSON object as an interactive tree, where each `TreeItem` is a key, and expanding an item shows its nested keys.
    *   **Minimal "Uncovered" API:** This concept is the most self-contained and requires virtually **no uncovered APIs**. The file reading (`document.getText()`) and JSON parsing (`JSON.parse()`) are standard JavaScript/TypeScript functionalities. The entire lab can be completed using only the APIs explicitly taught in Modules 1-4.

---

