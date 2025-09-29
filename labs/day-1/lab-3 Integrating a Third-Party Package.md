# Lab: Integrating a Third-Party Package

**Module:** Day 1: Foundations & JavaScript Essentials
**Time:** Approx. 45 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Configure the project to use modern ECMAScript (ES) Modules.
*   Update internal module imports to be compliant with the ES Module specification in Node.js.
*   Install an external NPM package (`inquirer`) to add new functionality.
*   Install a corresponding type declaration package (`@types/inquirer`) to provide compile-time type safety.
*   Refactor the application to create an interactive command-line interface.

### 2. Scenario

Our data model is robust, but the application is static; it runs from top to bottom and then exits. To build a useful tool, we need to add interactivity, allowing a user to issue commands. While we could build a command-parsing system from scratch, the professional approach is to leverage the vast NPM ecosystem of open-source packages.

In this lab, we will integrate `inquirer`, a popular command-line interface tool. This process will require us to update our project's module system to be compatible with modern packages. We will then refactor our application from a simple script into an interactive loop that can accept user input, laying the groundwork for a more complex, command-driven application.

### 3. Prerequisites

*   Completion of the "Lab: Building the Core Data Model". The final code from that lab is the starting point for this one.
*   You must have the `vscode-ext-logic` project open in VS Code.

### 4. Steps

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Configure for ES Modules**
    Modern Node.js packages are increasingly distributed as ES Modules. To use them, we must explicitly tell Node.js and the TypeScript compiler that our project will use this module system.

    *   In `package.json`, add the `"type": "module"` property.
        ```json
        // package.json
        {
          // ... existing properties
          "license": "ISC",
          "type": "module", // <-- ADD THIS LINE
          "devDependencies": { // ...
        }
        ```
    *   In `tsconfig.json`, update the `"module"` compiler option to `"Node16"`.
        ```json
        // tsconfig.json
        {
          "compilerOptions": {
            "target": "es2022",
            "module": "Node16", // <-- CHANGE THIS
            // ...
          }
        }
        ```

2.  **Update Local Import Paths**
    A strict requirement of the ES Module system in Node.js is that relative imports must include the file extension. We must update our existing TypeScript code to reflect this.

    *   Modify the import statement in `src/todoCollection.ts`:
        ```typescript
        // src/todoCollection.ts
        import { TodoItem } from "./todoItem.js"; // <-- ADD .js EXTENSION
        // ...
        ```
    *   Modify the import statements in `src/index.ts`:
        ```typescript
        // src/index.ts
        import { TodoItem } from './todoItem.js'; // <-- ADD .js EXTENSION
        import { TodoCollection } from './todoCollection.js'; // <-- ADD .js EXTENSION
        // ...
        ```
    *Insight:* This can feel counterintuitive, but we must specify the extension of the *compiled JavaScript file* (`.js`) in our *TypeScript source file* (`.ts`). This is because TypeScript does not rewrite import paths, and the final path must be valid for the Node.js runtime.

3.  **Install `inquirer` and its Type Definitions**
    Now we will add our third-party package. `inquirer` will handle user prompts, but since it's a JavaScript package, we also need to install a separate package to provide TypeScript with its type information.

    *   From your terminal, install `inquirer`:
        ```bash
        npm install inquirer@9.1.4
        ```
    *   Next, install the type definitions for `inquirer` as a development dependency:
        ```bash
        npm install --save-dev @types/inquirer@9.0.3
        ```
    *Insight:* The `@types/*` packages on NPM are part of the "DefinitelyTyped" project. They provide the bridge that allows the TypeScript compiler to understand the shapes, function signatures, and types of a pure JavaScript library.

4.  **Refactor `index.ts` for Interactivity**
    We will now completely overhaul our application's entry point to create an interactive loop.

    Replace the entire content of `src/index.ts` with the following structure. This code introduces a `Commands` enum to avoid "magic strings" and a `promptUser` function that uses `inquirer`.
    ```typescript
    // src/index.ts
    import { TodoItem } from './todoItem.js';
    import { TodoCollection } from './todoCollection.js';
    import inquirer from 'inquirer';
    
    let todos: TodoItem[] = [
      new TodoItem(1, 'Buy Flowers'), new TodoItem(2, 'Get Shoes'),
      new TodoItem(3, 'Collect Tickets'), new TodoItem(4, 'Call Joe', true)
    ];
    
    let collection: TodoCollection = new TodoCollection('Adam', todos);
    
    function displayTodoList(): void {
        console.log(`${collection.userName}'s Todo List ` +
            `(${collection.getItemCounts().incomplete} items to do)`);
        collection.getTodoItems(true).forEach((item) => item.printDetails());
    }
    
    enum Commands {
        Quit = "Quit"
    }
    
    function promptUser(): void {
        console.clear();
        displayTodoList();
        inquirer.prompt({
            type: "list",
            name: "command",
            message: "Choose option",
            choices: Object.values(Commands)
        }).then(answers => {
            if (answers["command"] !== Commands.Quit) {
                promptUser();
            }
        })
    }
    
    promptUser();
    ```

### 5. Verification
1.  **Compile the code.**
    From your terminal, run the TypeScript compiler. It should complete without errors.
    ```bash
    npx tsc
    ```
2.  **Run the application.**
    Execute the compiled JavaScript entry point using Node.js.
    ```bash
    node dist/index.js
    ```
3.  **Check the behavior.**
    The application is now interactive. The console should clear, display the full to-do list, and present a navigable prompt with one option: "Quit".
    *   Navigating with arrow keys should work.
    *   Pressing **Enter** on the "Quit" option should cause the program to exit cleanly.

### 6. Discussion
You have successfully integrated a third-party JavaScript package into a TypeScript project while maintaining full type safety. This lab introduced several critical, real-world concepts:
*   **Module System Configuration:** You learned that to use modern packages, you must configure your project for ES Modules via `package.json` and `tsconfig.json`.
*   **ES Module Import Paths:** You handled the Node.js requirement for explicit file extensions in relative imports.
*   **Type Declarations:** You saw the essential role of `@types` packages. Without `@types/inquirer`, TypeScript would have treated the `inquirer` object as type `any`, completely defeating the purpose of using TypeScript. The type declaration package allowed the compiler to understand `inquirer.prompt` and its expected arguments and return types.
This entire process is the standard workflow for extending your application's functionality with any of the hundreds of thousands of packages available on NPM.

### 7. Questions
1.  What is the primary reason for adding `"type": "module"` to `package.json`?
2.  What would be the consequence of forgetting to install the `@types/inquirer` package? How would the developer experience change in `index.ts`?
3.  The `inquirer.prompt` method is asynchronous. How does the code in `promptUser` handle the response when it eventually arrives?
4.  In the `inquirer.prompt` call, `choices: Object.values(Commands)` is used. What does this line of code do, and why is it a good practice?
5.  `inquirer` was installed as a regular `dependency`, but `@types/inquirer` was installed as a `devDependency`. What is the difference, and why is this distinction made?

---

### 8. Solution

#### 8.1. Final Code Artifacts
**`package.json`** (relevant sections updated)
```json
{
  "name": "vscode-ext-logic",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "inquirer": "^9.1.4"
  },
  "devDependencies": {
    "@types/inquirer": "^9.0.3",
    // ... other devDependencies
  }
}
```

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "Node16",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "sourceMap": true
  },
  "include": ["src"]
}
```

**`src/todoItem.ts`**
```typescript
export class TodoItem {
    constructor(
        public id: number,
        public task: string,
        public complete: boolean = false
    ) {
        // no statements required
    }

    printDetails(): void {
        console.log(`${this.id}\t${this.task} ${this.complete ? "\t(complete)": ""}`);
    }
}
```

**`src/todoCollection.ts`**
```typescript
import { TodoItem } from "./todoItem.js";

type ItemCounts = {
    total: number,
    incomplete: number
}

export class TodoCollection {
    private nextId: number = 1;
    private itemMap = new Map<number, TodoItem>();

    constructor(public userName: string, todoItems: TodoItem[] = []) {
        todoItems.forEach(item => this.itemMap.set(item.id, item));
    }

    addTodo(task: string): number {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
        return this.nextId;
    }

    getTodoById(id: number): TodoItem | undefined {
        return this.itemMap.get(id);
    }
    
    getTodoItems(includeComplete: boolean): TodoItem[] {
        return [...this.itemMap.values()]
            .filter(item => includeComplete || !item.complete);
    }

    markComplete(id: number, complete: boolean): void {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
        }
    }

    removeComplete(): void {
        this.itemMap.forEach(item => {
            if (item.complete) {
                this.itemMap.delete(item.id);
            }
        })
    }

    getItemCounts(): ItemCounts {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }
}
```

**`src/index.ts`**
```typescript
import { TodoItem } from './todoItem.js';
import { TodoCollection } from './todoCollection.js';
import inquirer from 'inquirer';

let todos: TodoItem[] = [
  new TodoItem(1, 'Buy Flowers'), new TodoItem(2, 'Get Shoes'),
  new TodoItem(3, 'Collect Tickets'), new TodoItem(4, 'Call Joe', true)
];

let collection: TodoCollection = new TodoCollection('Adam', todos);

function displayTodoList(): void {
    console.log(`${collection.userName}'s Todo List ` +
        `(${collection.getItemCounts().incomplete} items to do)`);
    collection.getTodoItems(true).forEach((item) => item.printDetails());
}

enum Commands {
    Quit = "Quit"
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands)
    }).then(answers => {
        if (answers["command"] !== Commands.Quit) {
            promptUser();
        }
    })
}

promptUser();
```

#### 8.2. Command Summary
```bash
npm install inquirer@9.1.4
npm install --save-dev @types/inquirer@9.0.3
npx tsc
node dist/index.js
```

### 9. Answers

#### 9.1. Answers to Questions
1.  **Why add `"type": "module"`?**
    This property explicitly tells the Node.js runtime that the `.js` files in this project should be treated as modern ECMAScript Modules, which use `import` and `export` syntax natively. Without this, Node.js would default to the older CommonJS module system (`require`/`module.exports`), and would fail to run code that uses `import`. This setting is essential for compatibility with modern packages.

2.  **Consequence of not installing `@types/inquirer`?**
    Without the `@types/inquirer` package, the TypeScript compiler would have no information about the `inquirer` object. It would infer its type as `any`. As a result, you would lose all type safety and editor support:
    *   `inquirer.prompt` would be treated as an `any` type, so the compiler could not check if you were passing the correct arguments (e.g., `type`, `name`, `choices`).
    *   There would be no autocompletion for the properties of the configuration object.
    *   The `answers` object in the `.then()` callback would also be of type `any`, so the compiler couldn't help you find typos like `answers["commmand"]`.

3.  **How is the async response handled?**
    The `inquirer.prompt` method returns a `Promise`. The code handles the asynchronous response using the `.then()` method of the Promise. A callback function is passed to `.then()`, and this function is only executed once the user has made a selection and `inquirer` has resolved the promise with the `answers` object.

4.  **Why `Object.values(Commands)`?**
    The `choices` property for `inquirer` expects an array of strings (or objects). Our `Commands` enum is `enum Commands { Quit = "Quit" }`. `Object.values(Commands)` extracts the values from this enum, producing the array `["Quit"]`. This is a robust practice because if we add more commands to the enum later (e.g., `Add = "Add Task"`), they will automatically be included in the choices array without us having to manually update a separate array of strings, reducing the chance of error.

5.  **`dependency` vs. `devDependency`?**
    *   **`dependencies`** are packages that the application needs to *run* in production. `inquirer` is in this category because our application's core functionality directly calls its code at runtime.
    *   **`devDependencies`** are packages needed only for *development and building*, but not for running the final application. `@types/inquirer` is a perfect example. It provides type information for the TypeScript compiler, but once the code is compiled to JavaScript, the types are erased and the declaration package is no longer needed. Other examples include `typescript` itself, `eslint`, and testing libraries.