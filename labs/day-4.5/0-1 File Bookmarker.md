### **"File Bookmarker"**

*   **Vision:** To empower developers to create their own persistent, cross-project collection of important files, providing instant navigation to key code locations regardless of which workspace is currently open.

*   **Description:** An extension that allows users to "bookmark" any file with a single command. Bookmarked files are displayed in a dedicated "Bookmarks" view in the Activity Bar, providing one-click access. This acts as a personalized, global "favorites" list for your entire file system.

*   **Skills:**
    *   **Core APIs:** `commands`, `window.activeTextEditor`, `globalState`, `TreeDataProvider`, `menus`.
    *   **Learning Arc:** Begins with a command to capture the active file's path. Progresses to storing this list in `globalState` (a key distinction from `workspaceState`). Finally, it builds a `TreeDataProvider` to render the bookmarks, correctly utilizing `TreeItem.resourceUri` to get native file icons and behavior.
    *   **Minimal "Uncovered" API:** The command to open a bookmarked file uses `vscode.commands.executeCommand('vscode.open', uri)`. This is a perfect example of a minimal, guided step. It teaches the powerful concept of executing built-in VS Code commands programmatically, which is covered in Module 3. It feels like a natural extension of the curriculum, not a significant leap.


### **User Experience (UX) Vision for the "File Bookmarker" Extension**

The core vision is to provide a seamless and intuitive way for a developer to curate and access a personal collection of important files, directly within the VS Code workbench.

#### **1. The Entry Point: A Dedicated Home in the Activity Bar**

When the user first installs the extension, a new icon will appear in the Activity Bar. For our project, we will use a **bookmark icon**. This is the extension's permanent, discoverable home in the UI.

*   **User Action:** The user sees the new bookmark icon.
*   **User Thought:** "Ah, this is where my bookmarks live."

Clicking this icon will open the **"File Bookmarker" View Container** in the Sidebar.



#### **2. The Main UI: The Bookmarks View**

When the View Container is open, the user will see a single view titled **"Bookmarked Files"**.

*   **Initial State (Empty View):** The first time a user opens this view, it will be empty. Instead of a blank space, it will display "Welcome" content. This is a crucial onboarding step. It will provide a concise message like, "No bookmarked files yet," and offer a clear, actionable button: **"Bookmark Active File"**. This immediately teaches the user the primary way to add a bookmark.

    

*   **Populated State:** As the user adds bookmarks, this view will display them as a flat list. Each item in the list will represent one bookmarked file.
    *   **Label:** The filename (e.g., `package.json`).
    *   **Description:** The path to the file, relative to its workspace folder, providing context (e.g., `my-project/src/api`).
    *   **Icon:** The item will have the *exact same icon* as the file has in the native File Explorer, instantly communicating its file type and respecting the user's chosen file icon theme.

    

#### **3. The Core User Workflows**

This is how a user will interact with the extension in their day-to-day work.

*   **Adding a Bookmark:**
    1.  The user is working in a file they want to save for later, for example, `database-connection.ts`.
    2.  They open the Command Palette (Ctrl+Shift+P) and type "Bookmark". They find and execute the command **"Bookmark: Add Bookmark"**.
    3.  A subtle notification might appear saying, "'database-connection.ts' bookmarked," but even better, the "Bookmarked Files" view in the sidebar will instantly update to show the new entry. The feedback is immediate and contextual.
    4.  Alternatively, they can click the **"Bookmark Current File"** icon (+) in the view's title bar.

*   **Accessing a Bookmark:**
    1.  The user is working on a task and needs to quickly jump to `database-connection.ts`.
    2.  Instead of searching or navigating the File Explorer, they click on the Bookmark icon in the Activity Bar.
    3.  They see `database-connection.ts` in the list.
    4.  A **single click** on the item in the tree instantly opens that file in the editor, ready for work. The interaction is fast, direct, and requires minimal cognitive load.

*   **Managing Bookmarks:**
    1.  To remove a bookmark they no longer need, the user simply **right-clicks** on the item in the "Bookmarked Files" view.
    2.  A context menu appears with a "Remove Bookmark" action, accompanied by a trash can icon.
    3.  Clicking this action removes the item from the list.
    4.  For quick, on-hover actions, a trash can icon will also appear inline next to the bookmark, allowing for even faster removal.

    

#### **Summary of the User Journey**

The planned UX is designed to be intuitive and to integrate with established VS Code patterns:

*   **Discoverability:** A clear icon in the Activity Bar and well-named commands in the Command Palette.
*   **Interaction:** Simple, single-click actions for the most common task (opening a file) and standard context menus for management tasks (removing a file).
*   **Feedback:** The `TreeView` acts as the primary source of truth, updating instantly as bookmarks are added or removed.
*   **Consistency:** The view looks and feels like a native VS Code component, using familiar icons, tooltips, and interaction models.

The end result is an extension that doesn't feel like a separate tool, but rather a natural enhancement to the core VS Code experience for managing and navigating important files.


