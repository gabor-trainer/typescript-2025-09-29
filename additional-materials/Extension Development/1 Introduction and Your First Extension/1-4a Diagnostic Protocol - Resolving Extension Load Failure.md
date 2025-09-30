### **Diagnostic Protocol: Resolving Extension Load Failure**

The root cause is almost always one of three issues: a compilation failure, a configuration mismatch in `package.json`, or a runtime error during the initial load.

#### **Step 1: Check the Build Output (The "Did the Artifact Get Created?" Check)**

Before VS Code can load your extension, the TypeScript code must be successfully compiled (and bundled) into JavaScript. If this step fails, there is no extension to load.

**Instructions:**

1.  Return to your **main development window** (the one where you pressed `F5`).
2.  Open the **Explorer** view (Ctrl+Shift+E).
3.  Look for a `dist` directory (or `out` if you used a non-bundler template). This is the output directory configured in your `esbuild.js` or `webpack.config.js`.
4.  Expand the `dist` directory. **Do you see an `extension.js` file inside it?**

*   **If `extension.js` is MISSING:** This is our smoking gun. The build process failed.
    *   Open the **Terminal** view in your main window (Ctrl+` ).
    *   Look at the output from the `npm run watch` task that `F5` triggered. You will almost certainly see a **TypeScript compilation error** or an **esbuild error** printed in red.
    *   Common errors include syntax mistakes in `src/extension.ts` or configuration problems in `tsconfig.json`. Correct the error, save the file, and watch the terminal to ensure the build completes successfully. You should see "build finished" or similar output without any preceding errors.
    *   Once the build succeeds and `dist/extension.js` exists, you may need to restart the debug session (`F5`).

*   **If `extension.js` EXISTS:** The build was successful. The problem lies elsewhere. Proceed to Step 2.

#### **Step 2: Check the Extension Manifest Configuration (The "Is the Blueprint Correct?" Check)**

If the JavaScript bundle exists, the next most likely culprit is a misconfiguration in `package.json`. VS Code reads this file to know *what* to load.

**Instructions:**

1.  In your main development window, open the `package.json` file.
2.  Verify the following fields with extreme prejudice:

    *   **`"main"`:** This field tells VS Code where to find the entry point for your extension's code.
        *   **It must point to the generated JavaScript file.** For our `esbuild` setup, this should be: `"main": "./dist/extension.js"`.
        *   A very common mistake is leaving it pointing to a non-existent `out` directory (e.g., `"./out/extension.js"`) from a previous template, or directly to the TypeScript file (`"./src/extension.ts"`), which the extension host cannot execute.
        *   Correct this path if it is wrong.

    *   **`"engines.vscode"`:** This field declares the minimum version of VS Code your extension is compatible with.
        *   Example: `"engines": { "vscode": "^1.82.0" }`.
        *   Check your VS Code version via **Help > About**. If your VS Code version (e.g., 1.81.0) is *lower* than the version specified here, VS Code will refuse to load the extension.
        *   **Solution:** Either update your VS Code or lower the version in `engines.vscode`. For development, it's safe to set it to your current version.

3.  After correcting any errors in `package.json`, you **must restart the debug session**. Configuration changes in the manifest are not picked up by a simple reload. Press the "Stop" button in the debug toolbar (or Shift+F5) and then press `F5` to launch a new Extension Development Host.

If the extension still does not load, proceed to Step 3.

#### **Step 3: Check the Developer Tools Console (The "What Happened at Runtime?" Check)**

If the build is correct and the manifest is correct, then VS Code is likely encountering a runtime error when it first tries to load your extension's code. We need to look at the logs for the Extension Host process.

**Instructions:**

1.  Go to the **Extension Development Host** window (the one where the extension is supposed to be running).
2.  From the main menu, go to **Help > Toggle Developer Tools**.
3.  The Chrome Developer Tools will open. Select the **Console** tab.
4.  Look for any errors, especially those that mention `[Extension Host]` or the path to your extension file.

    ![Developer Tools Console showing an error](https://code.visualstudio.com/assets/api/extension-guides/webview/developer-console.png)

*   Common errors you might see here include:
    *   `"Activating extension 'your.extension-id' failed: ..."` followed by a stack trace.
    *   Errors related to `require()` failing for a Node.js module that wasn't bundled correctly.
    *   Syntax errors that the TypeScript compiler missed but the JavaScript runtime caught.

*   This console is the ground truth for what happens when your extension's code is first parsed and the `activate` function is called. Any error here will point directly to the problem in your `extension.ts` or its dependencies.

---

**Summary of the Diagnostic Flow:**

1.  **No `dist/extension.js`?** It's a build problem. Check the terminal in your main window for `tsc` or `esbuild` errors.
2.  **`dist/extension.js` exists?** It's likely a `package.json` problem. Check the `"main"` and `"engines.vscode"` paths and versions.
3.  **`package.json` looks correct?** It's a runtime problem. Check the Developer Tools Console in the Extension Development Host for errors.

By following this professional, systematic process, you will isolate the failure. Let me know what you find at each step, and we will resolve it.