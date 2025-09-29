# Lab: Setting Up the Development Environment

**Module:** Day 1: Foundations & JavaScript Essentials
**Time:** Approx. 45 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Install and manage Node.js using a version manager.
*   Initialize a new CommonJS project with Git version control and NPM.
*   Install TypeScript and configure the compiler for a CommonJS target.
*   Understand why and how `jiti` is used for ESLint module interoperability.
*   Install and configure Visual Studio Code with essential extensions for modern linting and formatting.
*   Create and verify a "Hello, TypeScript" project that is automatically linted and formatted.

### 2. Scenario

Before any professional development work can begin, a stable, consistent, and verifiable development environment must be established. This foundational setup prevents a wide range of future problems related to tool versions, module system incompatibilities, code style, and code quality.

In this lab, we will construct the standard development environment for a VS Code extension logic project. We will configure it as a traditional CommonJS project and use modern tooling. This will introduce the real-world scenario of using a tool (`jiti`) to bridge the gap between older and newer JavaScript module systems, a common challenge in the Node.js ecosystem.

### 3. Prerequisites

*   A computer running Windows, Linux, or macOS.
*   Administrative privileges for installing software.
*   A stable internet connection.

### 4. Steps

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Install Node.js (via a Version Manager)**
    A version manager is a professional standard for managing multiple Node.js versions. We will use one to install the latest Long-Term Support (LTS) version.

    *   **Windows:** Install `nvm-windows` from [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows). After installation, open a **new** command prompt (as Administrator) and run:
        ```bash
        nvm install lts
        nvm use lts
        ```

    *   **Linux/macOS:** Open your terminal and install `nvm` using the cURL script from [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm). After installation, open a **new** terminal and run:
        ```bash
        nvm install --lts
        nvm use --lts
        nvm alias default lts
        ```

    **Verification:**
    ```bash
    node -v
    npm -v
    ```    The `node` version should be an LTS version (e.g., v20.x.x), and an `npm` version should be displayed.

2.  **Install Git and Initialize the Project**
    Git is the standard for version control. We will also create our project directory and initialize it.

    *   Install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads).
    *   Create and initialize the project directory:
        ```bash
        # Create a directory for your projects if you don't have one
        mkdir C:\dev       # Windows
        mkdir ~/dev        # Linux/macOS
        
        # Create and navigate to the project folder
        cd C:\dev
        mkdir vscode-ext-logic
        cd vscode-ext-logic

        # Initialize Git and NPM
        git init
        npm init -y
        ```    **Verification:** `git --version` should display the installed version. The `vscode-ext-logic` folder should contain a `.git` directory and a `package.json` file.

3.  **Install TypeScript**
    We will install the TypeScript compiler globally so the `tsc` command is available system-wide.
    ```bash
    npm install -g typescript@5
    ```
    **Verification:** `tsc --version` should display version 5.x.x.

4.  **Install and Configure VS Code & Extensions**
    VS Code is our target editor. We will install it and add extensions for ESLint and Prettier.

    *   Download and install VS Code from [https://code.visualstudio.com/](https://code.visualstudio.com/).
    *   Launch VS Code and open the Extensions view (Ctrl+Shift+X).
    *   Install the following two extensions:
        *   `ESLint` (ID: `dbaeumer.vscode-eslint`)
        *   `Prettier - Code formatter` (ID: `esbenp.prettier-vscode`)
    *   Open your project folder in VS Code (`File -> Open Folder...` or `code .` from the terminal).
    *   Create a `.vscode` directory and a `settings.json` file inside it:
        ```json
        // .vscode/settings.json
        {
          "editor.formatOnSave": true,
          "editor.defaultFormatter": "esbenp.prettier-vscode"
        }
        ```

5.  **Configure Project Tooling**
    Now we will add project-specific configurations for TypeScript, ESLint, and Prettier.

    *   **TypeScript (`tsconfig.json`):** Create this file in the project root.
        ```json
        // tsconfig.json
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
        }
        ```
    *   **ESLint (`eslint.config.mjs`):** Run the ESLint initialization wizard in your terminal.
        ```bash
        npm init @eslint/config
        ```
        Answer the prompts precisely as follows to simulate a CommonJS project that needs `jiti`:
        1.  *What do you want to lint?* -> Select `javascript`
        2.  *How would you like to use ESLint?* -> Select `To check syntax and find problems`
        3.  *What type of modules does your project use?* -> Select **`CommonJS (require/exports)`**
        4.  *Which framework does your project use?* -> Select `None of these`
        5.  *Does your project use TypeScript?* -> Select `Yes`
        6.  *Where does your code run?* -> Select `Node` (deselect `Browser`)
        7.  *Which language do you want your configuration file be written in?* -> Select `JavaScript`
        8.  *The config file will be named `eslint.config.mjs` and will require `jiti` to be loaded. Would you like to install `jiti`?* -> Select `Yes`
        9.  *Would you like to install them now?* -> Select `Yes`
        10. *Which package manager do you want to use?* -> Select `npm`

        After the wizard completes, install the Prettier config and update the generated `eslint.config.mjs` file:
        ```bash
        npm install --save-dev eslint-config-prettier
        ```
        Modify the `eslint.config.mjs` file to import and add the Prettier configuration. It must be the **last** element in the exported array.
        ```javascript
        // eslint.config.mjs
        import globals from "globals";
        import pluginJs from "@eslint/js";
        import tseslint from "typescript-eslint";
        import eslintConfigPrettier from "eslint-config-prettier"; // <-- 1. IMPORT

        export default [
          { languageOptions: { globals: globals.node } },
          pluginJs.configs.recommended,
          ...tseslint.configs.recommended,
          eslintConfigPrettier, // <-- 2. ADD AS THE LAST ELEMENT
        ];
        ```    *   **Prettier (`.prettierrc.json`):** Create this file in the project root.
        ```json
        // .prettierrc.json
        {
          "semi": true,
          "singleQuote": true,
          "tabWidth": 2
        }
        ```

6.  **Create and Verify "Hello, TypeScript"**
    Finally, we will create a sample file to test our entire setup.

    *   Create a `src` folder and an `index.ts` file inside it.
    *   Add the following **intentionally poorly formatted** code to `src/index.ts`:
        ```typescript
        // src/index.ts
        var  greeting = "Hello, Professional TypeScript!"

        function showGreeting( msg:string ) {
        console.log(msg)
        }

        showGreeting(greeting);
        ```
    *   **Save the file (Ctrl+S).** Observe two things:
        1.  The code will instantly be reformatted by Prettier.
        2.  ESLint will place a squiggle under `var greeting` with a warning. Hover over it; it will suggest using `const` instead. Change `var` to `const`. The warning will disappear.

### 5. Verification
1.  **Compile the code.**
    From your terminal, run the TypeScript compiler. It should complete without errors.
    ```bash
    npx tsc
    ```
2.  **Run the application.**
    Execute the compiled JavaScript file.
    ```bash
    node dist/index.js
    ```3.  **Check the output.**
    The console output should be:
    ```text
    Hello, Professional TypeScript!
    ```

### 6. Discussion
You have successfully established a professional-grade development environment. This setup uses modern tooling (`ESLint Flat Config`) within a traditional CommonJS project context, a common real-world scenario.
*   **TypeScript (`tsc`)** is responsible for type-checking and compiling your code to CommonJS modules.
*   **Prettier** is responsible for maintaining a consistent code format.
*   **ESLint** is responsible for analyzing code for quality issues. Because its modern configuration file (`eslint.config.mjs`) is an ES Module, the **`jiti`** package was automatically installed to act as a compatibility layer, allowing the CommonJS-based ESLint process to load its ESM configuration file on-the-fly.

### 7. Questions
1.  Why is using a version manager like `nvm` recommended over installing Node.js directly?
2.  What is the fundamental difference between the roles of ESLint and Prettier in this setup?
3.  What specific problem does the `jiti` package solve in our configuration?
4.  What would happen if `eslintConfigPrettier` was not the last entry in the exported array in `eslint.config.mjs`?
5.  Why is a project-specific `devDependency` on `typescript` (installed by the ESLint wizard) crucial for team projects?

---

### 8. Solution

#### 8.1. Final Code Artifacts
**`.vscode/settings.json`**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**`.prettierrc.json`**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

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
}
```

**`eslint.config.mjs`**
```javascript
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
```

**`package.json`** (Dependencies will reflect this specific wizard path; versions may vary)
```json
{
  "name": "vscode-ext-logic",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@eslint/js": "^9.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.0.0",
    "globals": "^15.0.0",
    "jiti": "^1.21.0",
    "typescript": "^5.4.5",
    "typescript-eslint": "^7.7.0"
  }
}
```

**`src/index.ts`**
```typescript
const greeting = 'Hello, Professional TypeScript!';

function showGreeting(msg: string) {
  console.log(msg);
}

showGreeting(greeting);
```

#### 8.2. Command Summary
```bash
# Node/NPM Verification
node -v
npm -v

# Git Verification
git --version

# Project Init
git init
npm init -y

# Global TypeScript Install
npm install -g typescript@5

# ESLint Setup
npm init @eslint/config
npm install --save-dev eslint-config-prettier

# Final Verification
npx tsc
node dist/index.js
```

### 9. Answers

#### 9.1. Answers to Questions
1.  **Why `nvm`?**
    Directly installing Node.js gives you a single, system-wide version. In a professional context, you often work on multiple projects. One project might require an older LTS version for stability, while another might need the latest features. `nvm` allows you to install multiple versions side-by-side and switch between them, preventing version conflicts and ensuring each project uses its required Node.js version.

2.  **ESLint vs. Prettier Roles?**
    They have distinct, complementary roles:
    *   **Prettier is a Formatter:** Its only job is to enforce a consistent code *style* (indentation, spacing, quote style, etc.). It is concerned with how the code *looks*.
    *   **ESLint is a Linter:** Its job is to analyze code for *quality* and potential *bugs* (e.g., unused variables, incorrect use of `async`). It is concerned with how the code *works*.

3.  **What problem does `jiti` solve?**
    `jiti` is an interoperability tool. Our project is a CommonJS (CJS) environment (the default for Node.js). However, the modern ESLint wizard created an `eslint.config.mjs` file, which is an ECMAScript Module (ESM). A CJS process cannot load an ESM file directly. `jiti` acts as a just-in-time transpiler, allowing the CJS-based ESLint process to load and understand our ESM configuration file on-the-fly.

4.  **What if `eslintConfigPrettier` is not last in the array?**
    The configuration array is processed in order, with later configurations overriding earlier ones. The `eslint-config-prettier` package works by disabling ESLint's stylistic rules. If another configuration (like `tseslint.configs.recommended`) came *after* `eslintConfigPrettier`, it would re-enable the very stylistic rules that `prettier` just turned off. This would lead to conflicts where Prettier formats the code one way, and ESLint then reports an error because it expects a different format. **`eslintConfigPrettier` must always be last.**

5.  **Why a project-specific `typescript` dependency?**
    While a global install is convenient for running `tsc` from anywhere, a project-local `devDependency` is crucial for team collaboration and reproducible builds. It ensures that every developer on the team, and any automated build server, uses the **exact same version** of the TypeScript compiler for this specific project, as defined in `package-lock.json`. This prevents "works on my machine" issues caused by subtle differences between compiler versions. The ESLint TypeScript plugin also relies on this project-local version.