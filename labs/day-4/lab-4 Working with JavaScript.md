# Lab: Working with JavaScript

**Time:** Approx. 75 minutes

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

### **Introduction: Bridging the Gap Between TypeScript and JavaScript**

No project exists in a vacuum. Professional developers must frequently integrate TypeScript code with existing JavaScript—be it legacy internal code or third-party packages from NPM. TypeScript is designed for this interoperability. This lab explores the tools and techniques TypeScript provides for creating a type-safe bridge between the two worlds, from simple project configuration to writing and consuming type declaration files.

---

### **Part 1: Mixed TypeScript/JavaScript Projects**

#### **Exercise 1: Enabling a Mixed Project**

By default, the TypeScript compiler only processes `.ts` files. To create a project that contains both `.ts` and `.js` files, you must enable the `allowJs` compiler option.

1.  In `tsconfig.json`, add the `"allowJs": true` compiler option.
    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        // ...
        "sourceMap": true,
        "allowJs": true // <-- ADD THIS
      },
      // ...
    }
    ```
2.  Create a pure JavaScript utility file named `src/js-logger.js`.
    ```javascript
    // src/js-logger.js
    
    // TODO: Create and export a function `logJsMessage`.
    // It should accept a `message` and log it to the console with a prefix,
    // e.g., "[JS Logger]: Your message here"
    ```3.  Create a TypeScript file `src/exercise-1.ts` that imports and uses this JavaScript function.
    ```typescript
    // src/exercise-1.ts
    
    // TODO: Import the `logJsMessage` function from `./js-logger.js`.
    // Remember to use the `.js` extension for ES Module compliance.
    
    console.log('From TypeScript file...');
    // TODO: Call the imported JavaScript function.
    ```
*Insight:* With `allowJs`, `tsc` will now process `js-logger.js`, copying it to the `dist` directory and ensuring its module format is consistent with the rest of the project.

---

### **Part 2: Describing JavaScript with Types**

The problem with Exercise 1 is that TypeScript treats the imported `logJsMessage` function as having `any` for its parameters, sacrificing type safety. We need to provide type information.

#### **Exercise 2: Describing Types with JSDoc**

The TypeScript compiler can understand type annotations written in standard JSDoc comments inside `.js` files. This is the quickest way to add type safety to a JavaScript file without converting it to TypeScript.

In `src/js-logger.js`, add a JSDoc block to the `logJsMessage` function to specify that its `message` parameter is a `string`. Then, create `src/exercise-2.ts` to test it.

```javascript
// src/js-logger.js

// TODO: Add a JSDoc comment block above the function.
// Use `@param {string} message` to type the parameter.
export function logJsMessage(message) {
  console.log(`[JS Logger]: ${message}`);
}```

```typescript
// src/exercise-2.ts
import { logJsMessage } from './js-logger.js';

logJsMessage('This is a string, it works.');

// TODO: Now try to call `logJsMessage` with a number.
// If your JSDoc is correct, TypeScript will now show a compile-time error for this line.
// logJsMessage(123);
```

#### **Exercise 3: Creating a Declaration File (`.d.ts`)**

JSDoc is useful, but a more robust and decoupled way to describe a JavaScript module is with a **declaration file** (`.d.ts`). This file provides only the type information, completely separate from the implementation.

1.  Create a new JavaScript utility file, `src/string-utils.js`, with two functions.
    ```javascript
    // src/string-utils.js
    export function pad(str, len) {
      return str.padStart(len);
    }
    export function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    ```
2.  Create its corresponding declaration file, `src/string-utils.d.ts`.
    ```typescript
    // src/string-utils.d.ts
    
    // TODO: Declare the module's public API.
    // Declare the `pad` function. It takes a `str: string` and `len: number`, and returns a `string`.
    // Declare the `capitalize` function. It takes a `str: string` and returns a `string`.
    // Use the `export declare function ...` syntax.
    ```
3.  Create `src/exercise-3.ts` to consume the JavaScript module.
    ```typescript
    // src/exercise-3.ts
    import { pad, capitalize } from './string-utils.js';
    
    const capitalized = capitalize('hello');
    const padded = pad(capitalized, 10);
    
    console.log(`[${padded}]`); // Expects '[     Hello]'
    ```
*Insight:* When a `.d.ts` file is present for a `.js` module, TypeScript uses it as the definitive source of type information and ignores JSDoc or inference from the `.js` file.

---

### **Part 3: Consuming Third-Party NPM Packages**

#### **Exercise 4: Using a Package with Bundled Types**

Modern libraries often ship their own `.d.ts` files directly within the NPM package. This is the ideal scenario, as it requires no extra setup. `lowdb`, which we used in a previous lab, is an example.

Let's use another one: `chalk`, a popular library for coloring terminal output.

1.  Install the package: `npm install chalk@4.1.2` (v4 is CJS-compatible, simpler for this lab).
2.  Create `src/exercise-4.ts`. Import `chalk` and use it. TypeScript will automatically find the bundled declaration file.

    ```typescript
    // src/exercise-4.ts
    
    // TODO: Import the default export from `chalk`.
    
    console.log(chalk.green('This message should be green!'));
    console.log(chalk.blue.bold('This should be bold and blue.'));
    
    // TODO: Try to access a color that doesn't exist.
    // TypeScript will give you a compile-time error, proving it has the type info.
    // console.log(chalk.nonExistentColor('This will fail.'));
    ```

#### **Exercise 5: Using a DefinitelyTyped Package (`@types`)**

For the vast number of JavaScript packages that do *not* bundle their own types, the community maintains a massive repository of declaration files called **DefinitelyTyped**. These are published to NPM under the `@types` scope.

Let's use `lodash`, a classic JavaScript utility library.

1.  Install the library and its corresponding `@types` package.
    ```bash
    npm install lodash
    npm install --save-dev @types/lodash
    ```
2.  Create `src/exercise-5.ts`. Import and use a function from `lodash`.

    ```typescript
    // src/exercise-5.ts
    
    // TODO: Import the `camelCase` function from `lodash`.
    // The import will look like: `import { camelCase } from 'lodash';`
    
    const originalString = 'my-extension--is--awesome';
    const camelCased = ''; // TODO: Call `camelCase` with the original string.
    
    console.log(camelCased); // Expects 'myExtensionIsAwesome'
    ```

#### **Exercise 6: Generating Declaration Files for Your Own Library**

If you are building a library to be published for others, you should generate your own `.d.ts` files. This is controlled by the `declaration` compiler option.

1.  Create a simple library file, `src/math-lib.ts`.
    ```typescript
    // src/math-lib.ts
    
    /**
     * Adds two numbers.
     * @param a The first number.
     * @param b The second number.
     * @returns The sum.
     */
    export function add(a: number, b: number): number {
      return a + b;
    }
    ```
2.  In `tsconfig.json`, add the `"declaration": true` compiler option.
    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        // ...
        "allowJs": true,
        "declaration": true // <-- ADD THIS
      },
      // ...
    }
    ```
3.  Compile the entire project from your terminal:
    ```bash
    npx tsc
    ```
4.  **Verify the output:** Look in your `dist` directory. Alongside `math-lib.js`, you should now see a new file, `math-lib.d.ts`, containing the type signature for your `add` function.

---

### **Questions**

1.  What is the purpose of the `"allowJs": true` option in `tsconfig.json`?
2.  What are the pros and cons of using JSDoc versus a `.d.ts` file to describe a JavaScript module?
3.  What is the DefinitelyTyped project, and how do you identify the package name for a library like `express`?
4.  If a package (like `chalk` in Exercise 4) includes its own `.d.ts` files, do you still need to install a corresponding `@types` package?
5.  What is the purpose of the `declare` keyword in a `.d.ts` file?
6.  The `"declaration": true` option generates `.d.ts` files for our project. Why is this a critical feature if we plan to publish our code as a library for other TypeScript developers to use?
7.  If you import a JavaScript module that has neither JSDoc nor a `.d.ts` file, what type will TypeScript infer for its exports?

---

### **Solution**

#### **`src/js-logger.js`**
```javascript
/**
 * @param {string} message The message to log.
 */
export function logJsMessage(message) {
  console.log(`[JS Logger]: ${message}`);
}
```

#### **`src/exercise-1.ts`**
```typescript
import { logJsMessage } from './js-logger.js';

console.log('From TypeScript file...');
logJsMessage('Hello from a JS module!');
```

#### **`src/exercise-2.ts`**
```typescript
import { logJsMessage } from './js-logger.js';

logJsMessage('This is a string, it works.');
// logJsMessage(123); // This correctly causes a compile-time error.
```

#### **`src/string-utils.js`**
```javascript
export function pad(str, len) {
  return str.padStart(len);
}
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

#### **`src/string-utils.d.ts`**
```typescript
export declare function pad(str: string, len: number): string;
export declare function capitalize(str: string): string;
```

#### **`src/exercise-3.ts`**
```typescript
import { pad, capitalize } from './string-utils.js';

const capitalized = capitalize('hello');
const padded = pad(capitalized, 10);

console.log(`[${padded}]`);
```

#### **`src/exercise-4.ts`**

```typescript
import chalk from 'chalk';

console.log(chalk.green('This message should be green!'));
console.log(chalk.blue.bold('This should be bold and blue.'));

// console.log(chalk.nonExistentColor('This will fail.'));
```

#### **`src/exercise-5.ts`**
```typescript
import { camelCase } from 'lodash';

const originalString = 'my-extension--is--awesome';
const camelCased = camelCase(originalString);

console.log(camelCased);
```

#### **`src/math-lib.ts`**
```typescript
/**
 * Adds two numbers.
 * @param a The first number.
 * @param b The second number.
 * @returns The sum.
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

---

### **Answers**

1.  **Purpose of `"allowJs"`?**
    The `"allowJs": true` option tells the TypeScript compiler to include `.js` and `.jsx` files in its compilation process. This allows you to have a mixed codebase where TypeScript files can import from JavaScript files and vice-versa. The compiler will pass the JavaScript files through to the output directory, ensuring they are part of the final build.

2.  **JSDoc vs. `.d.ts` file?**
    *   **JSDoc:**
        *   *Pro:* Type information lives directly alongside the implementation in the `.js` file. It's easy to keep them in sync.
        *   *Con:* It can clutter the JavaScript source code. It is less powerful for describing very complex types compared to the full TypeScript syntax.
    *   **`.d.ts` file:**
        *   *Pro:* Provides a clean separation of implementation and type definition. It allows you to use the full power of TypeScript syntax to describe complex shapes.
        *   *Con:* The types and implementation are in separate files, so it's possible for them to drift out of sync if the JavaScript code is changed without updating the declaration file.

3.  **What is DefinitelyTyped?**
    DefinitelyTyped is a massive, community-managed open-source repository of high-quality TypeScript type declaration files (`.d.ts`) for thousands of JavaScript libraries on NPM that don't ship their own. You identify the package name by prefixing the original NPM package name with `@types/`. For example, the `express` package has its types at `@types/express`.

4.  **Do you need `@types` if a package bundles its own types?**
    No. If a package includes its own `.d.ts` files (a practice known as "shipping types"), the TypeScript compiler will automatically find and use them. You do not need to, and should not, install a separate `@types` package for it.

5.  **Purpose of the `declare` keyword?**
    The `declare` keyword is used in a `.d.ts` file to tell the TypeScript compiler, "This function/variable/class exists at runtime, but there is no implementation for it here. This is only its type signature." It allows you to describe the shape of existing JavaScript code without creating new variables or functions in the compiled output.

6.  **Why is `"declaration": true` critical for libraries?**
    When you publish a library for other TypeScript developers, they need type information to use it safely and get features like autocompletion. The `"declaration": true` option makes the compiler generate the public `.d.ts` files for your library. These files act as the public contract for your library, allowing other TypeScript projects to consume it with full type safety.

7.  **Type inference for an untyped JS module?**
    If you import from a JavaScript module that has no associated type information (no JSDoc, no `.d.ts` file, and is not a `.ts` file), TypeScript has no way to know the shapes of its exports. For safety, it will implicitly infer the type of each export as **`any`**. This allows the code to compile but completely sacrifices type safety for that module.
