# Lab: Creating a VS Code Debug Configuration

**Module:** Day 1: Foundations & JavaScript Essentials
**Time:** Approx. 25 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Enable source map generation in `tsconfig.json`.
*   Generate a `launch.json` file to configure the VS Code debugger for a Node.js application.
*   Correctly configure the debugger to execute compiled TypeScript and use source maps.
*   Set and hit a breakpoint in your TypeScript source code.
*   Use the core functions of the debug toolbar to control program execution.
*   Inspect the value of variables at a specific point in the program's execution.

### 2. Scenario

Writing code is only one part of the development process; verifying and diagnosing it is equally critical. While `console.log` can be useful, a professional developer relies on an interactive debugger to step through code, inspect program state, and understand control flow. This provides a much faster and more powerful feedback loop for finding and fixing bugs.

In this lab, we will configure VS Code to debug our simple "Hello, TypeScript!" application. This process is identical to how you would debug the core logic of a VS Code extension in isolation, allowing you to perfect your algorithms and data structures before running them within the full extension host.

### 3. Prerequisites

*   Completion of the "Lab: Setting Up the Development Environment".
*   You must have the `vscode-ext-logic` project open in VS Code.

### 4. Steps

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Enable Source Maps in `tsconfig.json`**
    The debugger relies on "source maps" (`.map` files) to connect the compiled JavaScript in the `dist` folder back to your original TypeScript source code in the `src` folder. We must enable this feature in our compiler configuration.

    Modify the `compilerOptions` in your `tsconfig.json` file to add the `sourceMap` property:
    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        // ... existing options
        "strict": true,
        "sourceMap": true // <-- ADD THIS LINE
      },
      "include": ["src"]
    }
    ```

2.  **Open the Run and Debug View**
    The central location for managing debugging in VS Code is the "Run and Debug" view.

    *   In the VS Code Activity Bar on the left, click the icon that looks like a play button with a bug on it (or press `Ctrl+Shift+D`).
    *   You will see a view with a "Run and Debug" button and a link to "create a launch.json file".

3.  **Generate the `launch.json` File**
    VS Code uses a `launch.json` file to store debugging configurations. We will let the editor generate a template for us.

    *   Click the link **"create a launch.json file"**.
    *   A dropdown will appear at the top of the editor. Select **"Node.js"** from the list of environments.
    *   VS Code will create a `.vscode` directory in your project and a `launch.json` file inside it with a default Node.js configuration.

4.  **Configure `launch.json` for TypeScript**
    The default template is designed for single, simple files. We must configure it to explicitly run our project's compiled entry point.

    Modify the generated `.vscode/launch.json` file as follows:
    ```json
    // .vscode/launch.json
    {
      // ... other properties
      "configurations": [
        {
          // ... other properties
          "program": "${workspaceFolder}/dist/index.js", // <-- CHANGE THIS LINE
          "outFiles": ["${workspaceFolder}/dist/**/*.js"] // <-- ADD THIS LINE
        }
      ]
    }
    ```
    *Insight:* By specifying the exact `program`, we create a reliable configuration that doesn't depend on which file is currently open in the editor. This is the professional standard for multi-file projects.

5.  **Set a Breakpoint and Compile**
    Before we debug, we must set a breakpoint and ensure our compiled code is up-to-date.

    *   Open the `src/index.ts` file.
    *   In the editor gutter to the left of the line numbers, click next to the `console.log(msg);` line. A red dot will appear.
    *   **Crucially, re-compile your project** to ensure the `dist` directory and its source maps are current. Run this in your terminal:
        ```bash
        npx tsc
        ```

6.  **Start the Debug Session**
    With the configuration, breakpoint, and fresh compiled code in place, you are ready to start debugging.

    *   Ensure the "Run and Debug" view is open (`Ctrl+Shift+D`).
    *   Click the green play button at the top of the sidebar, or simply press **F5**.
    *   The debugger will start and run your application. Execution will pause on the line where you set the breakpoint, and the line will be highlighted.

### 5. Verification
1.  **Execution Pauses:** The program execution stops at the `console.log(msg);` line in `src/index.ts`.
2.  **Debug Toolbar Appears:** A floating toolbar with debugging controls appears, usually near the top of the editor.
3.  **Variables are Visible:** In the "Run and Debug" sidebar, under the "VARIABLES" panel, you can see the `msg` parameter and its value: `"Hello, Professional TypeScript!"`.

### 6. Discussion
You have successfully configured a professional debugging workflow. The key mechanism at play is **source maps**. The TypeScript compiler generates `.js.map` files in the `dist` directory that create a mapping between the compiled JavaScript and the original TypeScript source. The `outFiles` property in `launch.json` tells the VS Code debugger how to use these maps.

This creates a seamless experience where you can set breakpoints and step through your `.ts` files, and the debugger handles the mapping to the running `.js` code behind the scenes. You never need to look at the compiled output during a debug session. This is a fundamental productivity tool for quickly diagnosing and resolving issues in your application logic.

### 7. The Debug Toolbar Explained

When execution is paused, the debug toolbar provides full control over the program's flow.

| Icon | Name (Shortcut)             | Description                                                                                                                                                                                  |
| :--- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ▶️    | **Continue** (F5)           | Resumes normal program execution until the next breakpoint is hit or the program terminates.                                                                                                 |
| ↪️    | **Step Over** (F10)         | Executes the current line of code and pauses on the *next line in the current function*. If the current line is a function call, it executes the entire function without stopping inside it. |
| 🔽    | **Step Into** (F11)         | If the current line is a function call, this moves the execution point to the *first line inside that function*. If not a function call, it behaves like Step Over.                          |
| 🔼    | **Step Out** (Shift+F11)    | Executes the rest of the current function and pauses on the line *after* the original function call was made.                                                                                |
| 🔄    | **Restart** (Ctrl+Shift+F5) | Terminates the current debug session and immediately starts a new one.                                                                                                                       |
| 🟥    | **Stop** (Shift+F5)         | Terminates the debug session completely.                                                                                                                                                     |

### 8. Questions
1.  In `launch.json`, why do we set the `program` property to point to `dist/index.js` and not `src/index.ts`?
2.  What is the specific role of the `sourceMap` option in `tsconfig.json` in the debugging process?
3.  You are paused on the line `showGreeting(greeting);`. What is the functional difference between pressing F10 (Step Over) and F11 (Step Into)?
4.  If you set a breakpoint and it appears as an unfilled gray circle instead of a solid red dot, what are the two most likely causes?
5.  How does debugging this standalone Node.js application provide value when your ultimate goal is to build a VS Code extension?

---

### 9. Solution

#### 9.1. Final Code Artifacts
**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "sourceMap": true
  },
  "include": ["src"]
}```

**`.vscode/launch.json`**
```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/dist/index.js",
      "outFiles": [
        "${workspaceFolder}/dist/**/*.js"
      ]
    }
  ]
}
```

#### 9.2. Command Summary
```bash
# Ensure project is compiled with source maps before debugging
npx tsc

# Start debugging
Press F5 in VS Code
```

### 10. Answers

#### 10.1. Answers to Questions
1.  **Why `program` points to `dist/index.js`?**
    The Node.js runtime cannot execute TypeScript directly; it can only execute JavaScript. The `program` property tells the debugger which file to pass to the Node.js executable to start the application. We must point it to the compiled JavaScript output in the `dist` directory.

2.  **What is the role of `sourceMap`?**
    The `"sourceMap": true` option in `tsconfig.json` instructs the TypeScript compiler to generate `.js.map` files alongside the `.js` files. These map files contain data that creates a link between each line of the compiled JavaScript and the corresponding line in the original TypeScript source. The VS Code debugger uses these maps, guided by the `outFiles` property in `launch.json`, to allow you to set breakpoints and step through your `.ts` files while it executes the `.js` files. Without source maps, the debugger would not know how to make this connection.

3.  **Step Over (F10) vs. Step Into (F11) on `showGreeting(greeting);`?**
    *   **Step Over (F10):** The debugger would execute the entire `showGreeting` function in one go and pause on the next line *after* the function call in `index.ts`.
    *   **Step Into (F11):** The debugger would jump to the first line *inside* the `showGreeting` function, which is `console.log(msg);`, allowing you to debug the function's internal logic.

4.  **Unfilled gray breakpoint?**
    The two most likely causes are:
    1.  **Missing or Incorrect Source Maps:** The `sourceMap` option in `tsconfig.json` is set to `false` or is missing, so no `.map` files were generated.
    2.  **Stale Compiled Code:** You have made changes to your `.ts` source file but have not re-compiled the project with `npx tsc`. The existing `.map` files in the `dist` directory are now out of sync with your source code.

5.  **Why debug a standalone app for an extension?**
    This workflow provides a rapid and isolated development loop. A full VS Code extension runs in a complex host environment. By writing your core business logic as a pure Node.js module, you can debug and perfect it in a simple, fast, and predictable environment, as shown in this lab. This allows you to confirm your algorithms and data structures are correct without the overhead of reloading the entire VS Code development window for every change.