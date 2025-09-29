# Lab: Setting Up the Development Environment

**Module:** Day 1: Foundations & JavaScript Essentials
**Time:** Approx. 45 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Install and manage Node.js using a version manager.
*   Initialize a new project with Git version control and NPM.
*   Install TypeScript and configure the compiler for a Node.js project.
*   Install and configure Visual Studio Code with essential extensions for linting and formatting.
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
        ```
    **Verification:** `git --version` should display the installed version. The `vscode-ext-logic` folder should contain a `.git` directory and a `package.json` file.

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
            "strict": true
          }
        }
        ```
    *   **ESLint (`.eslintrc.json`):** Run the ESLint initialization wizard.
        ```bash
        npm init @eslint/config
        ```
        Answer the prompts as follows:
        1.  `To check syntax, find problems, and enforce code style`
        2.  `JavaScript modules (import/export)`
        3.  `None of these`
        4.  `Yes` (for TypeScript)
        5.  `Node` (spacebar to select, deselect Browser if needed)
        6.  `Use a popular style guide` -> `Standard`
        7.  `JSON`
        8.  `Yes` to install dependencies.

        After the wizard completes, install the Prettier config and update your `.eslintrc.json`:
        ```bash
        npm install --save-dev eslint-config-prettier
        ```
        Modify the `"extends"` array in `.eslintrc.json` to add `"prettier"` at the end.
        ```json
        // .eslintrc.json
        {
            // ... other settings from wizard
            "extends": [
                "standard-with-typescript",
                "prettier" // MUST BE LAST
            ],
            // ...
        }
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
3.  What would happen if `"prettier"` was not the last entry in the `extends` array in `.eslintrc.json`?
4.  What is the purpose of the `.vscode/settings.json` file? Why is it useful in a team environment?
5.  We installed TypeScript globally (`npm install -g`), but the ESLint wizard added it as a project `devDependency`. Why might having both be a good practice?

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

**`tsconfig.json`**```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true
  }
}
```

**`.eslintrc.json`**
```json
{
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    }
}
```

**`package.json`** (Dependencies will reflect your wizard choices)
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
    "@typescript-eslint/eslint-plugin": "^5.59.0",
    "eslint": "^8.38.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-config-standard-with-typescript": "^34.0.1",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-n": "^15.7.0",
    "eslint-plugin-promise": "^6.1.1",
    "typescript": "^5.0.4"
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

3.  **What if `prettier` is not last in the `extends` array?**
    The `extends` array works like a cascading stylesheet; each configuration overrides the previous one. The `eslint-config-prettier` package works by disabling ESLint's stylistic rules. If another configuration (like `standard-with-typescript`) comes *after* `prettier`, it will re-enable the very stylistic rules that `prettier` just turned off. This would lead to conflicts where Prettier formats the code one way, and ESLint then reports an error because it expects a different format. **`prettier` must always be last.**

4.  **Purpose of `.vscode/settings.json`?**
    This file allows you to define editor settings that are specific to the current project (workspace). By setting `"editor.formatOnSave": true` and the default formatter here, you ensure that every developer who opens this project in VS Code automatically gets the same consistent, auto-formatting behavior. If these settings were only in a developer's global user settings, you couldn't guarantee that a new team member would have the same setup. It makes the project's development experience self-contained and reproducible.

5.  **Global vs. Project TypeScript?**
    *   **Global TypeScript** provides the `tsc` command everywhere in your system's terminal. This is convenient for quick, one-off compilations or for checking the version, as we did in this lab.
    *   **Project `devDependency` TypeScript** is crucial for team collaboration and CI/CD pipelines. It ensures that every developer on the team, and the build server, uses the **exact same version** of the TypeScript compiler for this specific project, as defined in `package.json`. This prevents "works on my machine" issues caused by subtle differences between compiler versions. The ESLint plugin also relies on this project-local version.