### **1.4. Running 'Hello World'**

The project scaffolded by `generator-code` is not merely a template; it is a fully operational, debuggable Visual Studio Code extension. The primary mechanism for executing and testing an extension during development is the **Extension Development Host**. This is a separate, sandboxed instance of VS Code that is launched with your developing extension loaded. This architecture is crucial as it ensures your primary development environment remains stable and unaffected by the code you are testing. The generator pre-configures everything needed to launch this host.

##### **Demonstration: Launching the Extension Development Host**

We will now execute the extension. This process involves invoking a pre-defined launch configuration that handles compilation and execution. Ensure your `launch.json` is configured for an isolated session, as this is a critical best practice.

**Pre-flight Check:** Verify that your `.vscode/launch.json` for the `"Run Extension"` configuration includes the `--disable-extensions` flag. This prevents other installed extensions from interfering with your development session.

```json
"args": [
    "--disable-extensions",
    "--extensionDevelopmentPath=${workspaceFolder}"
],
```

**Instructions:**

1.  With the `HelloWorldNew` project open in your main VS Code window, initiate the debugging session by pressing `F5`.
2.  VS Code will execute the `preLaunchTask`, compiling your TypeScript code and creating the `dist/extension.js` bundle.
3.  A new VS Code window will open. This is the **Extension Development Host**. Its title bar will clearly label it as such.

##### **Demonstration: Verifying Extension State Before Activation**

Our `HelloWorldNew` extension is configured to activate only when its command is invoked (`onCommand`). Therefore, immediately after the Extension Development Host launches, the extension is *known* to VS Code but is not yet *active*. Its code has not been executed. We can verify this state.

**Instructions:**

1.  In the **Extension Development Host** window, open the Command Palette (Ctrl+Shift+P).
2.  Run the command **Developer: Show Running Extensions**.
3.  An "Running Extensions" editor will open. This view provides the ground truth of what is currently executing.
4.  **Observe the Output:** You will see a list of extensions that are active by default (core VS Code services, for example). **Crucially, you will NOT see your "HelloWorldNew" extension in this list.** This is the correct and expected behavior. It confirms that VS Code is honoring our lazy activation model, which is essential for performance. The extension is dormant, consuming no resources.

##### **Demonstration: Activating the Extension and Observing its Effect**

Now, we will perform the action that triggers our extension's activation event.

**Instructions:**

1.  In the **Extension Development Host** window, open the Command Palette (Ctrl+Shift+P).
2.  Type the title of our command: `Hello World`. You will see it appear in the list. This confirms that VS Code has correctly parsed our `package.json` manifest and knows about the command our extension *contributes*, even though the extension itself isn't active yet.

    ![Hello World command in Command Palette](https://code.visualstudio.com/assets/api/get-started/your-first-extension-command-palette.png)

3.  Press **Enter** to execute the command.
4.  **Observe Two Simultaneous Effects:**
    *   **Activation:** The `onCommand:helloworldnew.helloWorld` activation event is fired. The VS Code extension host loads your `dist/extension.js` file and executes the `activate` function within it.
    *   **Execution:** The `activate` function calls `vscode.commands.registerCommand`. Now that the command implementation is registered, VS Code immediately executes it. The code inside the command's callback runs, calling `vscode.window.showInformationMessage`.
    *   **UI Effect:** An information notification appears in the bottom-right corner of the window with the message "Hello World from HelloWorldNew!".

    ![Hello World notification](https://code.visualstudio.com/assets/api/get-started/your-first-extension-information-message.png)

This sequence demonstrates the full activation-to-execution lifecycle.

##### **Demonstration: Verifying Extension State After Activation**

Now that the extension has been activated, we can confirm its new state using the same diagnostic tool.

**Instructions:**

1.  If you closed the "Running Extensions" editor, reopen it using the **Developer: Show Running Extensions** command. If you left it open, it will have updated automatically.
2.  **Observe the Change:** In the list of active extensions, you will **now see "HelloWorldNew"**. The view provides valuable diagnostic information:
    *   **Path:** The location on disk from which it was loaded.
    *   **Activation Events:** The event that triggered its activation (e.g., `onCommand:helloworldnew.helloWorld`).
    *   **Activate Time:** The time it took for your `activate` function to execute. For our simple extension, this will be a very small number, typically just a few milliseconds (e.g., `(2ms)`). This metric is absolutely critical for diagnosing performance issues in more complex extensions.

This final check provides irrefutable proof that the extension has been successfully loaded, activated, and is now running within the extension host. This entire sequence—launch, verify dormancy, activate, observe effect, and verify active state—constitutes a complete and professional "smoke test" for an extension's core lifecycle.