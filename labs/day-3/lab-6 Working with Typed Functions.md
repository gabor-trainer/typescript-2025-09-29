# Lab: Working with Typed Functions

**Time:** Approx. 60 minutes

---

### **Setup**

These exercises use the `starter-project-multi` project.

1.  Open the `starter-project-multi` project in Visual Studio Code.
2.  If you haven't already, run `npm install`.
3.  For each exercise, create a new file in the `src` directory (e.g., `src/exercise-1.ts`).
4.  To run and verify your solution for a specific exercise, use the command:
    ```bash
    npx ts-node src/exercise-1.ts
    ```

---

### **Introduction: Defining Clear Contracts**

Functions are the primary building blocks of any application. TypeScript enhances standard JavaScript functions by allowing us to create explicit, statically-checked "contracts" for them. By defining types for parameters and return values, we make our functions more predictable, easier to use, and less prone to bugs. This lab explores the various ways TypeScript allows us to define these robust function signatures.

---

### **Part 1: Function Parameters**

#### **Exercise 1: Typed Parameters**

The most basic feature is adding type annotations to function parameters. This ensures that the function can only be called with arguments of the correct type.

In `src/exercise-1.ts`, create a function that logs a message with a severity level. The level must be a specific string literal type.

```typescript
// src/exercise-1.ts

type LogLevel = 'INFO' | 'DEBUG' | 'ERROR';

// TODO: Create a function `logMessage`.
// It should accept a `message` of type `string` and a `level` of type `LogLevel`.
// The function should log a formatted string, e.g., "[INFO]: User logged in."


logMessage('User successfully authenticated.', 'INFO');
logMessage('Failed to fetch data.', 'ERROR');

// This call should produce a compile-time error.
// logMessage('Some debug info.', 'WARNING');
```

#### **Exercise 2: Optional Parameters**

An optional parameter can be omitted when the function is called. Inside the function, its value will be `undefined` if it was not provided. An optional parameter is denoted with a `?` after its name.

In `src/exercise-2.ts`, create a function to show a VS Code notification. The "action button" text is optional.

```typescript
// src/exercise-2.ts

function showNotification(message: string, actionLabel?: string) {
  let notification = `Notification: ${message}`;
  // TODO: Use a type guard to check if `actionLabel` is not undefined.
  // If it exists, append ` (Action: ${actionLabel})` to the notification string.

  console.log(notification);
}

showNotification('File saved successfully.');
showNotification('File could not be saved.', 'Retry');
```

#### **Exercise 3: Default-Initialized Parameters**

A parameter can be given a default value. If the argument is omitted, the default value is used. This is often safer and cleaner than an optional parameter that can be `undefined`.

In `src/exercise-3.ts`, create a function that creates a status bar item. The `timeout` should default to 5000ms if not specified.

```typescript
// src/exercise-3.ts

// TODO: Create a function `createStatusBarItem`.
// It should accept `text` of type `string` and `timeout` of type `number`.
// The `timeout` parameter should have a default value of 5000.
// The function should log a message indicating the text and timeout.


createStatusBarItem('Loading...');
createStatusBarItem('Ready.', 2000);
```

#### **Exercise 4: Rest Parameters**

A rest parameter allows a function to accept an indefinite number of arguments as an array. It is denoted with `...` and must be the last parameter in the function signature.

In `src/exercise-4.ts`, create a function that merges multiple configuration objects into one.

```typescript
// src/exercise-4.ts

type Config = { [key: string]: any };

// TODO: Create a function `mergeConfigs`.
// It should accept one required parameter, `baseConfig` of type `Config`.
// It should also accept a rest parameter, `otherConfigs`, which will be an array of `Config` objects.
// The function should merge all `otherConfigs` into `baseConfig` and return the result.
// Hint: Use `Object.assign()` or the spread operator.


const base = {
  allowDebugging: true
};
const user = {
  theme: 'dark'
};
const workspace = {
  allowDebugging: false,
  fontSize: 14
};

const merged = mergeConfigs(base, user, workspace);
console.log(merged);
```

---

### **Part 2: Function Return Types**

#### **Exercise 5: Explicit Return Types**

Just as with parameters, you should explicitly type the return value of a function. This ensures the function's implementation adheres to its contract.

In `src/exercise-5.ts`, create a function that fetches a configuration value. It should be explicitly typed to return a `string | undefined`.

```typescript
// src/exercise-5.ts

const settings = new Map<string, string>();
settings.set('extension.theme', 'dark');

// TODO: Create a function `getConfigValue`.
// It should accept a `key` of type `string`.
// It should be explicitly typed to return `string | undefined`.
// The function should use `settings.get(key)` to find the value.


const theme = getConfigValue('extension.theme');
const font = getConfigValue('editor.fontFamily'); // This key doesn't exist

console.log(`Theme: ${theme}`);
console.log(`Font: ${font}`);
```

#### **Exercise 6: The `void` Return Type**

Functions that do not return a value have a return type of `void`. While TypeScript can often infer this, being explicit improves clarity.

In `src/exercise-6.ts`, create a function that simply logs an error to the console and does not return anything.

```typescript
// src/exercise-6.ts

// TODO: Create a function `logError`.
// It should accept a `message` of type `string`.
// It should explicitly declare a return type of `void`.
// The function should log the error message to `console.error`.


logError('Failed to connect to the server.');
```

---

### **Part 3: Function Overloading**

#### **Exercise 7: Overloading Function Signatures**

Function overloading in TypeScript is a compile-time feature that allows you to define multiple, more specific signatures for a single function implementation. This provides better type-checking and editor autocompletion for functions that behave differently based on their arguments.

In `src/exercise-7.ts`, create a `sendCommand` function. If it's called with one argument, it just sends the command. If it's called with two, the second is the payload. You will provide two "overload signatures" and one "implementation signature".

```typescript
// src/exercise-7.ts

// TODO: 1. Add the first overload signature. It should accept one argument: `command` of type `string`.
// It should declare a return type of `void`.

// TODO: 2. Add the second overload signature. It should accept two arguments: `command` of type `string`
// and `payload` of type `any[]`. It should declare a return type of `void`.

// TODO: 3. Create the function implementation. Its signature must be compatible with both overloads.
// Use a type union for the `payload` parameter and make it optional.
function sendCommand(command: string, payload?: any[]) {
  if (payload) {
    console.log(`Sending command '${command}' with payload:`, payload);
  } else {
    console.log(`Sending command '${command}'`);
  }
}

sendCommand('extension.activate');
sendCommand('extension.runQuery', ['SELECT * FROM users']);

// This call should now correctly cause a compile-time error,
// because no overload signature matches it.
// sendCommand('extension.runQuery', 'SELECT * FROM users');
```

---

### **Questions**

1.  What is the difference in behavior between an optional parameter (`name?: string`) and a default-initialized parameter (`name: string = 'default'`)?
2.  Can a function have more than one rest parameter? Why or why not?
3.  What happens if you have a function explicitly typed to return `void` but you accidentally return a value from it (e.g., `return 42;`)?
4.  In function overloading (Exercise 7), can you call the function with a signature that matches the implementation but not any of the overload signatures? Why?
5.  What is the `never` return type used for, and how does it differ from `void`?
6.  When using an optional parameter, why is it often necessary to perform a type guard (like checking for `undefined`) before using it?
7.  Could the `mergeConfigs` function (Exercise 4) be implemented using a `for...of` loop instead of `Object.assign` or the spread operator? What would that look like?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
type LogLevel = 'INFO' | 'DEBUG' | 'ERROR';

function logMessage(message: string, level: LogLevel): void {
  console.log(`[${level}]: ${message}`);
}

logMessage('User successfully authenticated.', 'INFO');
logMessage('Failed to fetch data.', 'ERROR');
```

#### **`src/exercise-2.ts`**
```typescript
function showNotification(message: string, actionLabel?: string) {
  let notification = `Notification: ${message}`;
  if (typeof actionLabel !== 'undefined') {
    notification += ` (Action: ${actionLabel})`;
  }
  console.log(notification);
}

showNotification('File saved successfully.');
showNotification('File could not be saved.', 'Retry');
```

#### **`src/exercise-3.ts`**
```typescript
function createStatusBarItem(text: string, timeout: number = 5000): void {
  console.log(`Displaying "${text}" for ${timeout}ms.`);
}

createStatusBarItem('Loading...');
createStatusBarItem('Ready.', 2000);
```

#### **`src/exercise-4.ts`**
```typescript
type Config = { [key: string]: any };

function mergeConfigs(baseConfig: Config, ...otherConfigs: Config[]): Config {
  return Object.assign(baseConfig, ...otherConfigs);
  // Alternative with spread operator:
  // return otherConfigs.reduce((acc, config) => ({ ...acc, ...config }), baseConfig);
}

const base = { allowDebugging: true };
const user = { theme: 'dark' };
const workspace = { allowDebugging: false, fontSize: 14 };

const merged = mergeConfigs(base, user, workspace);
console.log(merged); // { allowDebugging: false, theme: 'dark', fontSize: 14 }```

#### **`src/exercise-5.ts`**
```typescript
const settings = new Map<string, string>();
settings.set('extension.theme', 'dark');

function getConfigValue(key: string): string | undefined {
  return settings.get(key);
}

const theme = getConfigValue('extension.theme');
const font = getConfigValue('editor.fontFamily');

console.log(`Theme: ${theme}`);
console.log(`Font: ${font}`);
```

#### **`src/exercise-6.ts`**```typescript
function logError(message: string): void {
  console.error(`ERROR: ${message}`);
}

logError('Failed to connect to the server.');
```

#### **`src/exercise-7.ts`**
```typescript
// Overload signature 1: command only
function sendCommand(command: string): void;
// Overload signature 2: command with payload
function sendCommand(command: string, payload: any[]): void;

// Implementation (not directly callable from outside)
function sendCommand(command: string, payload?: any[]): void {
  if (payload) {
    console.log(`Sending command '${command}' with payload:`, payload);
  } else {
    console.log(`Sending command '${command}'`);
  }
}

sendCommand('extension.activate');
sendCommand('extension.runQuery', ['SELECT * FROM users']);
```

---

### **Answers**

1.  **Optional vs. Default-Initialized Parameters?**
    *   An **optional parameter (`name?: string`)** will have the type `string | undefined` inside the function. You must handle the `undefined` case yourself, typically with a type guard.
    *   A **default-initialized parameter (`name: string = 'default'`)** will always have the type `string` inside the function. If the caller omits the argument, TypeScript automatically assigns the default value, making the function body simpler as you don't need to handle `undefined`.

2.  **Can a function have more than one rest parameter?**
    No. A rest parameter works by collecting "all the rest" of the arguments into an array. Logically, this can only happen once, and it must be the last parameter in the signature because there would be no way to determine which arguments belong to a subsequent parameter.

3.  **What if a `void` function returns a value?**
    The TypeScript compiler will raise a compile-time error. The error message will be something like: `Type 'number' is not assignable to type 'void'`. This enforces the contract that the function is not intended to produce a result.

4.  **Can you call an overloaded function's implementation signature?**
    No. Once you provide overload signatures, they become the *only* public-facing signatures for the function. The implementation signature must be general enough to be compatible with all the overload signatures, but it is effectively private and cannot be called directly. The compiler will report an error if you try to call the function with a set of arguments that only matches the implementation.

5.  **`never` vs. `void` return type?**
    *   `void` means the function completes successfully but does not return a value.
    *   `never` means the function **never completes normally**. This applies to functions that always throw an error or functions that have an infinite loop (e.g., an event loop). It signals that the end of the function is unreachable.

6.  **Why use a type guard for optional parameters?**
    Because an omitted optional parameter has the value `undefined`. If a parameter is typed `string | undefined`, you cannot call string methods like `.toUpperCase()` on it directly because it might be `undefined`. A type guard (e.g., `if (myParam) { ... }`) proves to the compiler that inside that block, the variable is not `undefined`, and it is safe to use its string methods.

7.  **Could `mergeConfigs` be implemented with a `for...of` loop?**
    Yes. You would iterate over the `otherConfigs` array and then iterate over the keys of each config object to assign them to the base.
    ```typescript
    function mergeConfigs(baseConfig: Config, ...otherConfigs: Config[]): Config {
      for (const config of otherConfigs) {
        for (const key in config) {
          if (Object.prototype.hasOwnProperty.call(config, key)) {
            baseConfig[key] = config[key];
          }
        }
      }
      return baseConfig;
    }
    ```