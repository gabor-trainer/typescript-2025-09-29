# Lab: JavaScript Core Concepts for TypeScript

**Time:** Approx. 90 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Configure a multi-file project for modern TypeScript development with ES Modules.
*   Create a professional VS Code debugging configuration to compile and run the currently active TypeScript file.
*   Demonstrate and explain the behavior of JavaScript's dynamic typing.
*   Work with primitive data types and understand how TypeScript infers them.
*   Identify and control JavaScript's implicit type coercion.
*   Define and invoke functions, understanding how TypeScript helps manage parameters.

### 2. Scenario

A deep understanding of JavaScript's core mechanics is not a liability for a TypeScript developer; it is a professional requirement. TypeScript is a layer on top of JavaScript, and its features are designed to solve specific problems inherent in the language. To appreciate *why* TypeScript's features exist, we must first have a practical, hands-on understanding of the JavaScript behaviors they are designed to manage.

In this lab, you will work through a series of short, focused exercises. Each exercise will be in its own file, allowing you to isolate and observe a specific JavaScript concept. You will configure your environment to compile and run any of these files with a single command, creating a rapid learning and experimentation workflow.

### 3. Prerequisites

*   A starter project template with the standard `package.json`, `tsconfig.json`, etc., from the previous labs. We will refer to this as the "Starter Project".

### 4. Project Setup

1.  **Initialize the Project**
    Copy the "Starter Project" to a new directory and name it `day2lab1`. Open this new folder in Visual Studio Code.

2.  **Configure `package.json` for ES Modules**
    We will configure our project to use the modern ECMAScript Module system, which is standard for new development.

    Modify your `package.json` file by adding the `"type": "module"` property.
    ```json
    // package.json
    {
      "name": "day2lab1", // <-- CHANGE THIS
      // ...
      "license": "ISC",
      "type": "module",   // <-- ADD THIS
      "devDependencies": { // ...
    }
    ```

3.  **Configure `tsconfig.json` for Modern Output**
    We need to tell the TypeScript compiler to output modern module syntax that the Node.js ESM runtime can understand.

    Modify your `tsconfig.json` file by changing the `"module"` option to `"esnext"`.
    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        "target": "es2022",
        "module": "esnext", // <-- CHANGE THIS
        // ...
      },
      "include": ["src"]
    }
    ```
    *Insight:* The `"module": "esnext"` setting tells TypeScript to preserve the modern `import`/`export` syntax in its output. Since our `package.json` now has `"type": "module"`, the Node.js runtime will be able to execute this modern syntax natively.

4.  **Configure VS Code for "Run Current File" Debugging**
    This is a critical step for an efficient multi-file lab workflow. We will create a configuration that automatically compiles and runs whichever `.ts` file is currently open in your editor.

    *   **Create the Build Task:** Create a `tasks.json` file inside the `.vscode` directory. This task will be responsible for running the TypeScript compiler.
        ```json
        // .vscode/tasks.json
        {
            "version": "2.0.0",
            "tasks": [
                {
                    "label": "tsc: build",
                    "type": "npm",
                    "script": "build",
                    "problemMatcher": ["$tsc"],
                    "group": {
                        "kind": "build",
                        "isDefault": true
                    }
                }
            ]
        }
        ```
    *   **Add a Build Script:** For the task to work, add a `"build"` script to your `package.json`.
        ```json
        // package.json
        {
          // ...
          "main": "index.js",
          "scripts": {
            "build": "tsc", // <-- ADD THIS
            "test": "echo \"Error: no test specified\" && exit 1"
          },
          // ...
        }
        ```
    *   **Create the Launch Configuration:** Modify your `.vscode/launch.json` file. We will create a new configuration that uses the build task.
        ```json
        // .vscode/launch.json
        {
            "version": "0.2.0",
            "configurations": [
                {
                    "name": "Run Current TS File",
                    "type": "node",
                    "request": "launch",
                    "program": "${workspaceFolder}/dist/${fileBasenameNoExtension}.js",
                    "outFiles": [
                        "${workspaceFolder}/dist/**/*.js"
                    ],
                    "preLaunchTask": "tsc: build"
                }
            ]
        }
        ```
    *Insight:* When you press F5, the `"preLaunchTask"` runs `npm run build` (which runs `tsc`), ensuring all files are compiled. The `program` path is then dynamically constructed to run the specific compiled file corresponding to the one you have open in the editor.

### 5. Exercises

For each exercise, create a new file in the `src` folder (e.g., `ex01.ts`). Add the provided code, and then run it by pressing **F5**.

---

#### **Part 1: "Getting confused by JavaScript" (Book §3.2)**

**Exercise 1: Confusing Equality**
*   **Instruction:** Create `src/ex01.ts`. Write code that compares a `number` to a `string` containing the same value, first using the loose equality operator (`==`) and then the strict equality operator (`===`). Log the results of both comparisons.
*   **Goal:** To demonstrate JavaScript's implicit type coercion with `==` and how `===` prevents it, which is the professional standard enforced by tools like ESLint.

    ```typescript
    // src/ex01.ts
    const price1 = 100;
    const price2 = "100";
    
    if (price1 == price2) {
        console.log("Prices are the same (loose equality).");
    } else {
        console.log("Prices are different (loose equality).");
    }
    
    if (price1 === price2) {
        console.log("Prices are the same (strict equality).");
    } else {
        console.log("Prices are different (strict equality).");
    }
    ```
*   **Expected Output:**
    ```text
    Prices are the same (loose equality).
    Prices are different (strict equality).
    ```

**Exercise 2: Confusing Addition**
*   **Instruction:** Create `src/ex02.ts`. Add a `number` to a `string` containing a number. Log the result and the `typeof` the result.
*   **Goal:** To show how the `+` operator behaves differently when one of its operands is a string, performing string concatenation instead of mathematical addition.

    ```typescript
    // src/ex02.ts
    const price1 = 100;
    const price2 = "100";
    
    const total = price1 + price2;
    console.log(`Total: ${total}`);
    console.log(`Type of total: ${typeof total}`);
    ```
*   **Expected Output:**
    ```text
    Total: 100100
    Type of total: string
    ```

**Exercise 3: The `NaN` Pitfall**
*   **Instruction:** Create `src/ex03.ts`. Perform a mathematical operation with a non-numeric string. Log the result and its type, then verify if the result is `NaN`.
*   **Goal:** To introduce `NaN` (Not-a-Number) as a special value of the `number` type and demonstrate that `isNaN()` is the correct way to check for it.

    ```typescript
    // src/ex03.ts
    const calculatedValue = 100 * "apples";
    
    console.log(`Calculated value: ${calculatedValue}`);
    console.log(`Type of calculatedValue: ${typeof calculatedValue}`);
    
    if (isNaN(calculatedValue)) {
        console.log("The value is Not-a-Number (NaN).");
    }
    ```
*   **Expected Output:**
    ```text
    Calculated value: NaN
    Type of calculatedValue: number
    The value is Not-a-Number (NaN).
    ```

---

#### **Part 2: "Working with primitive data types" (Book §3.3.1)**

**Exercise 4: Dynamic Variable Typing**
*   **Instruction:** Create `src/ex04.ts`. Declare a variable without an initial value, then successively assign it a number, a string, and a boolean. Log the `typeof` the variable after each assignment.
*   **Goal:** To explicitly demonstrate JavaScript's dynamic typing, where a variable's type is determined by the value it currently holds, not by its declaration.

    ```typescript
    // src/ex04.ts
    let myVariable: any;
    
    console.log(`Initial type: ${typeof myVariable}`);
    
    myVariable = 42;
    console.log(`After assigning a number: ${typeof myVariable}`);
    
    myVariable = "Hello, TypeScript";
    console.log(`After assigning a string: ${typeof myVariable}`);
    
    myVariable = true;
    console.log(`After assigning a boolean: ${typeof myVariable}`);
    ```
*   **Expected Output:**
    ```text
    Initial type: undefined
    After assigning a number: number
    After assigning a string: string
    After assigning a boolean: boolean
    ```

**Exercise 5: TypeScript Type Inference**
*   **Instruction:** Create `src/ex05.ts`. Define a variable by immediately assigning it a string value. Attempt to reassign it to a number (this will be a compile-time error).
*   **Goal:** To show how TypeScript, unlike JavaScript, infers a static type from the initial assignment, providing type safety even without explicit annotations.

    ```typescript
    // src/ex05.ts
    const inferredString = "This is a string";
    
    // Hover over 'inferredString' in VS Code to see its inferred type.
    
    // The following line will show a red squiggle. The code will not compile.
    // inferredString = 123;
    
    console.log(`TypeScript correctly inferred the type: ${typeof inferredString}`);
    ```
*   **Expected Output:**
    ```text
    TypeScript correctly inferred the type: string
    ```

**Exercise 6: Undefined vs. Null**
*   **Instruction:** Create `src/ex06.ts`. Declare one variable without a value and another variable explicitly assigned to `null`. Log the type and value of both.
*   **Goal:** To clarify the distinction between `undefined` (the default value of uninitialized variables) and `null` (an intentional absence of value), and to point out the famous JavaScript quirk where `typeof null` returns `'object'`.

    ```typescript
    // src/ex06.ts
    let uninitialized;
    let userSelection = null;
    
    console.log(`Type of uninitialized: ${typeof uninitialized}, Value: ${uninitialized}`);
    console.log(`Type of userSelection: ${typeof userSelection}, Value: ${userSelection}`);
    ```
*   **Expected Output:**
    ```text
    Type of uninitialized: undefined, Value: undefined
    Type of userSelection: object, Value: null
    ```

---

#### **Part 3: "Understanding type coercion" (Book §3.3.2)**

**Exercise 7: Explicit Coercion to Number**
*   **Instruction:** Create `src/ex07.ts`. Given a numeric value stored as a string, use the `Number()` function to explicitly convert it before performing a calculation.
*   **Goal:** To demonstrate the correct, professional way to handle numeric data from sources (like user input) that may provide it as a string.

    ```typescript
    // src/ex07.ts
    const priceString = "100.50";
    const quantity = 2;
    
    const totalCost = Number(priceString) * quantity;
    
    console.log(`Total cost: ${totalCost.toFixed(2)}`);
    ```
*   **Expected Output:**
    ```text
    Total cost: 201.00
    ```

**Exercise 8: Falsy Value Coercion**
*   **Instruction:** Create `src/ex08.ts`. Use the logical OR `||` operator to provide a default value for a variable initialized to `0`.
*   **Goal:** To highlight the danger of using `||` for default values, as it treats all "falsy" values (`0`, `""`, `false`) as conditions to be replaced, which is often not the desired behavior.

    ```typescript
    // src/ex08.ts
    const falsyValue = 0;
    
    const setting = falsyValue || 10;
    
    console.log(`Setting is: ${setting} (0 was incorrectly replaced)`);
    ```
*   **Expected Output:**
    ```text
    Setting is: 10 (0 was incorrectly replaced)
    ```

**Exercise 9: Nullish Coalescing for Precision**
*   **Instruction:** Create `src/ex09.ts`. Use the nullish coalescing operator `??` to provide a default value for both a variable set to `0` and a variable set to `null`.
*   **Goal:** To demonstrate the modern, safer `??` operator, which only provides a default for `null` or `undefined`, correctly preserving legitimate "falsy" values like `0` or an empty string.

    ```typescript
    // src/ex09.ts
    const validZeroSetting = 0;
    const missingSetting = null;
    
    const setting1 = validZeroSetting ?? 10;
    const setting2 = missingSetting ?? 10;
    
    console.log(`With a valid zero: ${setting1}`);
    console.log(`With a missing value: ${setting2}`);
    ```
*   **Expected Output:**
    ```text
    With a valid zero: 0
    With a missing value: 10
    ```

---

#### **Part 4: "Working with functions" (Book §3.3.3)**

**Exercise 10: Missing Function Arguments**
*   **Instruction:** Create `src/ex10.ts`. Define a function that requires two arguments. Attempt to call it with only one.
*   **Goal:** To show how TypeScript provides compile-time safety by enforcing the correct number of arguments for a function call, a check that does not exist in plain JavaScript.

    ```typescript
    // src/ex10.ts
    function createMessage(greeting: string, name: string): string {
        return `${greeting}, ${name}!`;
    }
    
    // The following line will show a red squiggle and will not compile.
    // const message = createMessage("Hello");
    
    console.log("TypeScript prevents calls with incorrect argument counts.");
    console.log("To test, comment out the line above and see the error disappear.");
    ```
*   **Expected Output:**
    ```text
    TypeScript prevents calls with incorrect argument counts.
    To test, comment out the line above and see the error disappear.
    ```

**Exercise 11: Optional Parameters**
*   **Instruction:** Create `src/ex11.ts`. Modify a function signature to make a parameter optional using the `?` syntax. Handle the `undefined` case inside the function.
*   **Goal:** To demonstrate how to define functions that can be called with a variable number of arguments in a type-safe way.

    ```typescript
    // src/ex11.ts
    function createMessage(greeting: string, name?: string): string {
        const recipient = name ?? "World";
        return `${greeting}, ${recipient}!`;
    }
    
    const message1 = createMessage("Hello");
    const message2 = createMessage("Hello", "Gabor");
    
    console.log(message1);
    console.log(message2);
    ```
*   **Expected Output:**
    ```text
    Hello, World!
    Hello, Gabor!
    ```

**Exercise 12: Default Parameter Values**
*   **Instruction:** Create `src/ex12.ts`. Refactor the previous exercise to use a default parameter value instead of the optional `?` and internal nullish check.
*   **Goal:** To show a cleaner, more declarative syntax for providing default values to function parameters, which simplifies the function body.

    ```typescript
    // src/ex12.ts
    function createMessage(greeting: string, name: string = "World"): string {
        return `${greeting}, ${name}!`;
    }
    
    const message1 = createMessage("Hello");
    const message2 = createMessage("Hello", "Gabor");
    
    console.log(message1);
    console.log(message2);
    ```
*   **Expected Output:**
    ```text
    Hello, World!
    Hello, Gabor!
    ```

### 6. Verification
For each exercise file (`ex01.ts` through `ex12.ts`):
1.  Open the file in the VS Code editor.
2.  Press **F5** to start the "Run Current TS File" debug configuration.
3.  The code should compile and run, and the output for that specific exercise should appear in the **DEBUG CONSOLE**.
4.  Ensure the output matches the **Expected Output** for that exercise.

### 7. Discussion

This series of exercises has provided a practical tour of the fundamental behaviors of JavaScript that directly motivated the creation of TypeScript. You've seen firsthand how dynamic typing, type coercion, and loose function argument handling can lead to ambiguity and potential bugs.

You have also seen how TypeScript's static analysis, type inference, and stricter function rules provide a powerful safety net at compile time. The concepts of `nullish coalescing (??)`, `optional (?)`, and `default parameters` are not just TypeScript features but modern JavaScript patterns that lead to clearer and more robust code. This foundation is essential as we move on to more complex TypeScript constructs.

### 8. Questions
1.  What is the practical difference between the `==` and `===` operators, and which one should be the professional standard?
2.  In Exercise 3, `typeof NaN` returns `'number'`. Why is this the case, and why is the `isNaN()` function necessary?
3.  Why does TypeScript's type inference (Exercise 5) provide a significant advantage over the purely dynamic typing of JavaScript (Exercise 4)?
4.  In Exercise 8, what is a real-world example where using the `||` operator for a default value would cause a bug that the `??` operator (Exercise 9) would prevent?
5.  Compare the optional parameter (`name?: string`) approach in Exercise 11 with the default parameter (`name: string = "World"`) in Exercise 12. When might you prefer one over the other?

---

### 9. Solution

*Note: The project configuration files are as specified in the "Project Setup" section of this lab.*

#### 9.1. Final Code Artifacts

*(The 12 exercise `.ts` files are as specified in the steps above.)*

### 10. Answers

#### 10.1. Answers to Questions
1.  **`==` vs. `===`:**
    *   `==` (Loose Equality): Compares two values for equality *after* performing type coercion. For example, `100 == "100"` is `true`.
    *   `===` (Strict Equality): Compares two values for equality *without* performing type coercion. It checks if both the value and the type are the same. `100 === "100"` is `false`.
    The professional standard is to **always use `===`**. It is predictable and prevents bugs that arise from unexpected type coercion.

2.  **`typeof NaN`:**
    `NaN` (Not-a-Number) is a special value within the `number` type specification. It is the result of mathematical operations that cannot produce a valid number (e.g., `0 / 0` or `Math.sqrt(-1)`). Since it is technically part of the numeric type set, `typeof` correctly identifies it as a `'number'`. The `isNaN()` function is necessary because, by definition, `NaN` is not equal to anything, including itself (`NaN === NaN` is `false`). `isNaN()` is the only reliable way to check if a value is `NaN`.

3.  **Advantage of Type Inference:**
    Type inference provides the best of both worlds. Like dynamic JavaScript, the developer does not have to write explicit type annotations for simple assignments. However, unlike JavaScript, TypeScript *remembers* the inferred type. If you later try to use the variable in a way that violates its inferred type (e.g., assigning a number to a variable that was inferred as a string), TypeScript will raise a compile-time error. It provides static safety without adding unnecessary verbosity.

4.  **`||` vs. `??` Bug Example:**
    Imagine a function that takes an optional `timeout` setting, where `0` means "wait indefinitely".
    ```typescript
    function connect(timeout: number | undefined) {
        const waitTime = timeout || 5000; // Buggy!
        // ...
    }
    connect(0); // Intended to wait forever.
    ```
    Here, `timeout` is `0`, which is a "falsy" value. The `||` operator will incorrectly discard the `0` and use the default `5000`. The `??` operator would fix this, as it only triggers for `null` or `undefined`: `const waitTime = timeout ?? 5000;`. In this case, `waitTime` would correctly be `0`.

5.  **Optional vs. Default Parameters:**
    *   **Default Parameter (`name: string = "World"`)** is preferred when there is a sensible, common default value. It makes the function body cleaner, as you don't have to check for `undefined` yourself.
    *   **Optional Parameter (`name?: string`)** is necessary when there is no sensible default, and the function's behavior needs to change fundamentally based on whether a value was provided or not. For example, a `search` function might have an optional `filter?: SearchFilter` parameter. If the filter is `undefined`, the function performs one type of query; if it's provided, it performs a completely different, filtered query.