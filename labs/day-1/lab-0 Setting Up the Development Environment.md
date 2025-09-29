# Lab: Setting Up the Development Environment

**Module:** Day 1: Foundations & JavaScript Essentials
**Time:** Approx. 45 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Install and manage Node.js using a version manager.
*   Initialize a new project with Git version control and NPM.
*   Install TypeScript and configure the compiler for a Node.js project.
*   Install and configure Visual Studio Code with essential extensions for linting and formatting using the modern ESLint "Flat Config" system.
*   Create and verify a "Hello, TypeScript" project that is automatically linted and formatted.

### 2. Scenario

Before any professional development work can begin, a stable, consistent, and verifiable development environment must be established. This foundational setup prevents a wide range of future problems related to tool versions, code style inconsistencies, and code quality.

In this lab, we will construct the standard development environment for our VS Code extension logic project. We will install all the necessary command-line tools and then configure VS Code to automatically enforce code quality and a consistent format, creating a seamless and professional workflow.

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

    *Insight:* Using `nvm` prevents conflicts and allows you to easily switch Node.js versions for different projects.

    **Verification:**
    ```bash
    node -v
    npm -v
    ```
    The `node` version should be an LTS version (e.g., v20.x.x), and an `npm` version should be displayed.

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
    VS Code is our target editor. We will install it and add extensions for ESLint (code quality) and Prettier (code formatting).

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
    *Insight:* This configuration tells VS Code to automatically format your code using Prettier every time you save a file, ensuring consistency with zero effort.

5.  **Configure Project Tooling**
    Now we will add project-specific configurations for TypeScript, ESLint, and Prettier using modern standards.

    *   **TypeScript (`tsconfig.json`):** Create this file in the project root.
        ```json
        // tsconfig.json
        {
          "compilerOptions": {
            "target": "es2022",
            "module": "commonjs",
            "rootDir": "./src",
            "outDir": "./dist",
            "strict": true
          },
          "include": ["src"]
        }
        ```
        *Insight:* We've added `"include": ["src"]`. This explicitly tells TypeScript where to find our source files, which resolves a common warning.

    *   **ESLint (`eslint.config.mjs`):** Run the ESLint initialization wizard in your terminal.
        ```bash
        npm init @eslint/config
        ```
        Answer the prompts precisely as follows:
        1.  *What do you want to lint?* -> Select `javascript`
        2.  *How would you like to use ESLint?* -> Select `To check syntax and find problems`
        3.  *What type of modules does your project use?* -> Select `JavaScript modules (import/export)`
        4.  *Which framework does your project use?* -> Select `None of these`
        5.  *Does your project use TypeScript?* -> Select `Yes`
        6.  *Where does your code run?* -> Select `Node` (deselect `Browser`)
        7.  *Which language do you want your configuration file be written in?* -> Select `JavaScript`
        8.  *Would you like to install them now?* -> Select `Yes`
        9.  *Which package manager do you want to use?* -> Select `npm`

        *Insight:* The wizard now generates `eslint.config.mjs`, which is ESLint's new "Flat Config" format.

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
        ```
    *   **Prettier (`.prettierrc.json`):** Create this file in the project root to ensure consistent formatting rules.
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
    ```
3.  **Check the output.**
    The console output should be:
    ```text
    Hello, Professional TypeScript!
    ```

### 6. Discussion
You have successfully established a professional-grade development environment. This setup enforces a clean separation of concerns:
*   **TypeScript (`tsc`)** is responsible for type-checking and compiling your code.
*   **Prettier** is responsible for maintaining a consistent code format, eliminating style debates.
*   **ESLint** is responsible for analyzing code for quality issues and potential bugs beyond what the type system can catch.
The integration with VS Code automates this process, providing immediate feedback and ensuring every file saved is clean, consistent, and correct. This foundation is essential for efficient and scalable development.

### 7. Questions
1.  Why is using a version manager like `nvm` recommended over installing Node.js directly?
2.  What is the fundamental difference between the roles of ESLint and Prettier in this setup?
3.  What would happen if `eslintConfigPrettier` was not the last entry in the exported array in `eslint.config.mjs`?
4.  What is the purpose of the `.vscode/settings.json` file? Why is it useful in a team environment?
5.  We installed TypeScript globally (`npm install -g`), but the ESLint wizard added it as a project `devDependency`. Why is having a project-specific version crucial?

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
    "strict": true
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

**`package.json`** (Dependencies will reflect the modern wizard's choices; versions may vary)
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
    Directly installing Node.js gives you a single, system-wide version. In a professional context, you often work on multiple projects simultaneously. One project might require an older LTS version for stability, while another might need the latest features. `nvm` allows you to install multiple versions side-by-side and switch between them on a per-shell or per-project basis, preventing version conflicts and ensuring each project uses the exact Node.js version it was built for.

2.  **ESLint vs. Prettier Roles?**
    They have distinct, complementary roles:
    *   **Prettier is a Formatter:** Its only job is to enforce a consistent code *style*. It parses your code and re-prints it according to its strict rules, handling things like indentation, spacing, quote style, and line wrapping. It is concerned with how the code *looks*.
    *   **ESLint is a Linter:** Its job is to analyze code for *quality* and potential *bugs*. It catches programmatic errors like using a variable before it's defined, identifies anti-patterns, and flags code that doesn't follow best practices. It is concerned with how the code *works* and whether it's correct.

3.  **What if `eslintConfigPrettier` is not last in the array?**
    The configuration array is processed in order, with later configurations overriding earlier ones. The `eslint-config-prettier` package works by disabling ESLint's stylistic rules. If another configuration (like `tseslint.configs.recommended`) came *after* `eslintConfigPrettier`, it would re-enable the very stylistic rules that `prettier` just turned off. This would lead to conflicts where Prettier formats the code one way, and ESLint then reports an error because it expects a different format. **`eslintConfigPrettier` must always be last.**

4.  **Purpose of `.vscode/settings.json`?**
    This file allows you to define editor settings that are specific to the current project (workspace). By setting `"editor.formatOnSave": true` and the default formatter here, you ensure that every developer who opens this project in VS Code automatically gets the same consistent, auto-formatting behavior. If these settings were only in a developer's global user settings, you couldn't guarantee that a new team member would have the same setup. It makes the project's development experience self-contained and reproducible.

5.  **Global vs. Project TypeScript?**
    *   **Global TypeScript** provides the `tsc` command everywhere in your system's terminal. This is convenient for quick, one-off compilations or for checking the version, as we did in this lab.
    *   **Project `devDependency` TypeScript** is crucial for team collaboration and CI/CD pipelines. It ensures that every developer on the team, and the build server, uses the **exact same version** of the TypeScript compiler for this specific project, as defined in `package.json`. This prevents "works on my machine" issues caused by subtle differences between compiler versions. The ESLint plugin also relies on this project-local version.