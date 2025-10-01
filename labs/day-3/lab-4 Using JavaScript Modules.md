# Lab: Using JavaScript Modules

**Time:** Approx. 60 minutes

---

### **Setup**

These exercises use the `starter-project-multi` project.

1.  Open the `starter-project-multi` project in Visual Studio Code.
2.  If you haven't already, run `npm install`.
3.  For each exercise, you will create or modify files in the `src` directory.
4.  To run and verify your solution for a specific exercise, use the command:
    ```bash
    npx ts-node src/exercise-2.ts 
    ```
    (Replace `exercise-2.ts` with the appropriate file for the exercise you are on.)

---

### **Introduction: Organizing Code with Modules**

As an application grows, placing all code in a single file becomes unmanageable. Modules allow us to split our code into smaller, reusable, and maintainable files. Each file is its own module with a private scope. To make functions, classes, or variables available to other files, we must explicitly **export** them. To use them, other files must **import** them. This lab covers the standard ES Module syntax for exporting and importing code.

---

### **Steps**

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Project Setup for ES Modules**
    Before we can use modules, we must configure our project to use the modern ECMAScript Module system.

    *   In `package.json`, add the `"type": "module"` property. This tells Node.js to treat our `.js` files as ES Modules.
        ```json
        // package.json
        {
          // ...
          "license": "ISC",
          "type": "module", // <-- ADD THIS
          "devDependencies": { //...
        }
        ```
    *   In `tsconfig.json`, ensure the compiler is set to a modern module target that respects the `package.json` setting.
        ```json
        // tsconfig.json
        {
          "compilerOptions": {
            "module": "Node16", // or "NodeNext"
            // ...
          }
        }
        ```

---

### **Part 1: Default Exports**

A `default export` is used when a module has one primary "thing" to export, like a single class or function.

#### **Exercise 1: Creating a Module with a Default Export**

Let's create a utility module for formatting currency, a common task in an extension that might deal with product information.

Create a new file `src/formatters.ts`. Inside it, define and export a single function as the default export.

```typescript
// src/formatters.ts

// TODO: Define a function `formatCurrency` that takes a number and returns a formatted string.
// e.g., 100 -> "$100.00"
// Use `export default` to export it.
```

#### **Exercise 2: Importing and Using a Default Export**

Now, let's use our new formatter in a separate file. When importing a default export, you can give it any name you like.

Create a new file `src/exercise-2.ts`. Import the default function from `formatters.ts` and use it.

```typescript
// src/exercise-2.ts

// TODO: Import the default export from `./formatters.js`.
// Give it a name, for example `currencyFormatter`.
// Remember to include the .js extension in the path!

const price = 129.50;
const formattedPrice = ''; // TODO: Call your imported function with `price`.

console.log(formattedPrice);
```

---

### **Part 2: Named Exports**

`Named exports` are used when a module provides several distinct, independent utilities. This is the most common and scalable export pattern.

#### **Exercise 3: Creating a Module with Named Exports**

Let's create a utility module for string manipulation that provides multiple functions.

Create a new file `src/stringUtils.ts`. Define and export two functions using the `export` keyword.

```typescript
// src/stringUtils.ts

// TODO: Create a function `toUpperCase` that takes a string and returns it in upper case.
// Export it using the `export` keyword.

// TODO: Create another function `toLowerCase` that takes a string and returns it in lower case.
// Export it as well.
```

#### **Exercise 4: Importing a Single Named Export**

When importing named exports, you must use their exact names inside curly braces `{}`. You can choose to import only the functions you need.

Create a new file `src/exercise-4.ts`. Import only the `toUpperCase` function and use it.

```typescript
// src/exercise-4.ts

// TODO: Import only the `toUpperCase` function from `./stringUtils.js`.
// Remember the curly braces `{}`.

const message = 'Hello, modules!';
const upperMessage = ''; // TODO: Call the imported function with `message`.

console.log(upperMessage);
```

#### **Exercise 5: Importing Multiple Named Exports**

To import multiple items, you simply add them to the list inside the curly braces.

Create a new file `src/exercise-5.ts`. Import both functions from `stringUtils.ts`.

```typescript
// src/exercise-5.ts

// TODO: Import both `toUpperCase` and `toLowerCase` from `./stringUtils.js`.

const text = "This Is A Mixed Case String";

console.log(toUpperCase(text));
console.log(toLowerCase(text));
```

---

### **Part 3: Combining Exports**

A module can have one default export and as many named exports as you like.

#### **Exercise 6: Creating a Module with Mixed Exports**

Let's modify our `stringUtils.ts` module. We'll add a `default export` that provides a primary, combined functionality, while keeping the specific named exports available.

Modify `src/stringUtils.ts` from Exercise 3.

```typescript
// src/stringUtils.ts

// ... (keep the existing toUpperCase and toLowerCase named exports)

// TODO: Add a new default export. It should be a function named `formatInfo`
// that takes a string and returns a formatted message like:
// "Info: [YOUR_STRING_IN_UPPERCASE]"
// This function can call the existing `toUpperCase` function.
```

#### **Exercise 7: Importing Both Default and Named Exports**

There is a specific syntax for importing the default and named exports in a single line.

Create a new file `src/exercise-7.ts`. Import the default function and one of the named functions from `stringUtils.ts`.

```typescript
// src/exercise-7.ts

// TODO: Import the default export (give it the name `formatInfo`) AND
// the named export `toLowerCase` in a single import statement from `./stringUtils.js`.
// The syntax is: `import defaultName, { namedName } from '...'`

const data = "This is Important Data";

console.log(formatInfo(data));
console.log(toLowerCase(data));
```

---

### **Questions**

1.  What is the key syntactical difference between importing a `default` export and a `named` export?
2.  In this lab, we configured our project as an ES Module. Why was it necessary to add the `.js` extension to our import paths (e.g., `'./formatters.js'`)?
3.  What is "tree-shaking," and why does using named exports (`import { toUpperCase } from ...`) help with this process more than importing a default object with many methods?
4.  How would you import the `toUpperCase` function but give it a different name, `makeUpper`, in your local file?
5.  What is the syntax for importing all named exports from a module into a single object?
6.  What does a "side-effect import" look like (e.g., `import './polyfills.js';`), and when might you use it?

---

### **Solution**

#### **`package.json`** (Relevant Part)
```json
{
  "name": "starter-project-multi",
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
  "devDependencies": {
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  }
}
```

#### **`src/formatters.ts`**
```typescript
export default function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}
```

#### **`src/exercise-2.ts`**
```typescript
import currencyFormatter from './formatters.js';

const price = 129.50;
const formattedPrice = currencyFormatter(price);

console.log(formattedPrice);
```

#### **`src/stringUtils.ts`**
```typescript
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

function formatInfo(str: string): string {
  return `Info: ${toUpperCase(str)}`;
}

export default formatInfo;```

#### **`src/exercise-4.ts`**
```typescript
import { toUpperCase } from './stringUtils.js';

const message = 'Hello, modules!';
const upperMessage = toUpperCase(message);

console.log(upperMessage);
```

#### **`src/exercise-5.ts`**
```typescript
import { toUpperCase, toLowerCase } from './stringUtils.js';

const text = "This Is A Mixed Case String";

console.log(toUpperCase(text));
console.log(toLowerCase(text));
```

#### **`src/exercise-7.ts`**
```typescript
import formatInfo, { toLowerCase } from './stringUtils.js';

const data = "This is Important Data";

console.log(formatInfo(data));
console.log(toLowerCase(data));
```

---

### **Answers**

1.  **Syntactical difference between default and named imports?**
    *   A `default` export is imported without curly braces, and you can assign it any local name you want: `import myLocalName from './module.js';`
    *   `Named` exports must be imported using their exact exported names inside curly braces: `import { exportName1, exportName2 } from './module.js';`

2.  **Why the `.js` extension?**
    This is a strict rule of the native ECMAScript Module implementation in Node.js. Unlike the older CommonJS system, the ESM resolver does not automatically try to guess file extensions. The import path you write must be the exact path to the file that the Node.js runtime will execute. Since our TypeScript files are compiled to JavaScript files, we must use the final `.js` extension in our source code. TypeScript itself does not rewrite these paths.

3.  **What is "tree-shaking"?**
    Tree-shaking is a build optimization process where a bundler (like Webpack or Vite) analyzes `import` and `export` statements to determine exactly which code is being used. Any exported code that was *not* imported anywhere in the project is considered "dead code" and is eliminated from the final output bundle. Named exports are excellent for tree-shaking because `import { toUpperCase } from ...` makes it very clear that only `toUpperCase` is needed, allowing `toLowerCase` to be shaken out if it's unused. Importing a default object with many methods (`import utils from ...; utils.toUpperCase()`) can sometimes make it harder for the bundler to determine which parts are unused.

4.  **How to rename a named import?**
    You use the `as` keyword inside the curly braces.
    ```typescript
    import { toUpperCase as makeUpper } from './stringUtils.js';
    console.log(makeUpper('test')); // Outputs 'TEST'
    ```

5.  **How to import all named exports?**
    You use the wildcard (`*`) import with the `as` keyword to create a "namespace object" that contains all the named exports as its properties.
    ```typescript
    import * as StringUtils from './stringUtils.js';
    console.log(StringUtils.toUpperCase('test'));
    console.log(StringUtils.toLowerCase('test'));
    ```
    *Note: This does not import the `default` export.*

6.  **What is a "side-effect import"?**
    An import statement with just the path (`import './my-module.js';`) executes the code in that module but does not import any of its exports into the current scope. This is used when a module's primary purpose is to run some global setup code. A common example is a "polyfill," which is a piece of code that adds modern JavaScript features to older runtimes. Simply importing the polyfill file makes those features available globally.