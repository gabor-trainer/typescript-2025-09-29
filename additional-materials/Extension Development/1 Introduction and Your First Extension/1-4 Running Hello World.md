#### **1.4. Running 'Hello World'**

The project scaffolded by `generator-code` is not merely a template; it is a fully operational, debuggable Visual Studio Code extension. The primary mechanism for executing and testing an extension during development is the **Extension Development Host**. This is a separate, sandboxed instance of VS Code that is launched with your developing extension loaded and activated. This architecture is crucial as it ensures your primary development environment remains stable and unaffected by the code you are testing.

The generator pre-configures everything needed to launch this host.

##### **Demonstration: Launching the Extension Development Host**

We will now execute the extension for the first time. This process involves invoking a pre-defined launch configuration that handles the compilation and execution sequence.

**Instructions:**

1.  With the `HelloWorld` project open in your main VS Code window, ensure no files have unsaved changes.
2.  Initiate the debugging session by pressing the `F5` key.
    *   **Alternative Method:** You can also open the **Run and Debug** view from the Activity Bar (the icon with a play button and a bug, or Ctrl+Shift+D). The "Run Extension" configuration will be selected by default in the dropdown at the top. Click the green play button next to it.

3.  **Observe the Process:** Several actions will occur automatically:
    *   The status bar at the bottom will turn orange, indicating a debug session is active.
    *   A debug toolbar will appear at the top of the window.
    *   VS Code will invoke the `preLaunchTask` defined in `.vscode/launch.json`, which in our `esbuild` project, triggers the `npm: watch-web:esbuild` and `npm: watch-web:tsc` tasks defined in `.vscode/tasks.json`. You may see a terminal pane appear briefly as these tasks run. This step compiles your TypeScript source code into a JavaScript bundle in the `dist` directory.
    *   A new VS Code window will open. This is the **Extension Development Host**. Its title bar will clearly label it as such (e.g., `[Extension Development Host] - HelloWorld`).

    ![Extension Development Host Window](https://code.visualstudio.com/assets/api/get-started/your-first-extension-host-window.png)

4.  **Confirm the Extension is Loaded:** In the Extension Development Host window, open the Extensions view (Ctrl+Shift+X). In the "INSTALLED" section, you will see your "HelloWorld" extension listed, indicating it has been successfully loaded into this instance of VS Code.

##### **Demonstration: Invoking the Extension's Command**

Our extension contributes a single command to VS Code. The primary user interface for discovering and executing commands is the Command Palette.

**Instructions:**

1.  Within the **Extension Development Host** window, open the Command Palette using the keybinding Ctrl+Shift+P (or Cmd+Shift+P on macOS).

2.  Begin typing the title of the command as defined in `package.json`: `Hello World`. You will see the command appear in the list of available commands.

    ![Hello World command in Command Palette](https://code.visualstudio.com/assets/api/get-started/your-first-extension-command-palette.png)

3.  Press **Enter** to select and execute the command.

4.  **Observe the Result:** An information notification will appear in the bottom-right corner of the window with the message "Hello World from HelloWorld!".

    ![Hello World notification](https://code.visualstudio.com/assets/api/get-started/your-first-extension-information-message.png)

This sequence confirms that all components are working as expected:
*   The `F5` launch process correctly compiled the extension.
*   The Extension Development Host loaded the extension.
*   The command contribution in `package.json` successfully registered the "Hello World" command in the Command Palette.
*   Invoking the command triggered the `activate` function in `extension.ts`, which in turn registered the command's implementation.
*   The implementation, using the `vscode.window.showInformationMessage` API call, executed successfully.

##### **Troubleshooting Common Launch Issues**

If the command does not appear in the Command Palette, several common issues should be investigated:

1.  **Version Mismatch:** This is the most frequent cause. The `engines.vscode` property in `package.json` specifies the minimum version of the VS Code API your extension is compatible with (e.g., `"^1.82.0"`). If the version of VS Code you are using for development is *older* than this specified version, the extension will fail to load in the Extension Development Host.
    *   **Solution:** Either update your VS Code to the required version or adjust the `engines.vscode` value to match your VS Code version (though this may cause API incompatibility issues later).

2.  **Compilation Errors:** Check the "Problems" tab or the terminal output in your main development window. If the TypeScript compilation failed, no `dist/extension.js` bundle would be created, and the extension would have no code to load.

3.  **Incorrect `main` or `browser` path in `package.json`:** Ensure that the `main` (for desktop) or `browser` (for web) property in your `package.json` correctly points to the output file generated by your bundler. For our `esbuild` setup, this should be `./dist/extension.js` or similar.

Successfully running and invoking this command is the first major milestone. We now have a repeatable process for testing our code within a live VS Code environment. We will now build upon this with the core development loop.