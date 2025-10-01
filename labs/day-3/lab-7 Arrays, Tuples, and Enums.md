# Lab: Arrays, Tuples, and Enums

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

### **Introduction: Structuring Collections of Data**

Beyond primitive types, real applications need to manage collections and structured groups of data. TypeScript provides powerful features for working with arrays, tuples (fixed-length, mixed-type arrays), and enums (named constant values). This lab explores how to use these structures to create strongly-typed, readable, and maintainable code.

---

### **Part 1: Typed Arrays**

#### **Exercise 1: Creating a Strongly-Typed Array**

TypeScript allows you to declare that an array can only hold values of a specific type. This prevents accidental mixing of data types.

In `src/exercise-1.ts`, create an array that is explicitly typed to hold only strings. This will represent a list of supported language IDs for a linter extension.

```typescript
// src/exercise-1.ts

// TODO: Declare an array named `supportedLanguages` and explicitly type it as an array of strings (`string[]`).
// Initialize it with the values: 'typescript', 'javascript', 'python'.


// The following line should cause a compile-time error.
// supportedLanguages.push(2);

console.log('Supported Languages:', supportedLanguages);
```

#### **Exercise 2: Type Inference with Arrays**

If you initialize an array with values of the same type, TypeScript can infer the array's type, saving you from writing an explicit annotation.

In `src/exercise-2.ts`, create an array of numbers without a type annotation. Then, write a function that accepts a `number[]` and verify that your inferred array can be passed to it.

```typescript
// src/exercise-2.ts

// TODO: Create an array `lineNumbers` and initialize it with some numbers (e.g., 10, 25, 42).
// Do NOT add a type annotation.

function logLineNumbers(lines: number[]) {
  console.log('Logging line numbers:', lines);
}

// TODO: Call `logLineNumbers` with your `lineNumbers` array.
// TypeScript will allow this because it correctly inferred the type as `number[]`.
```

---

### **Part 2: Tuples**

A tuple is a fixed-length array where the type of each element is known. It's perfect for representing a small, structured piece of data.

#### **Exercise 3: Defining and Using a Tuple**

Imagine a command in your extension takes a fixed set of arguments: a file path (string) and a line number (number). A tuple is the ideal way to represent this.

In `src/exercise-3.ts`, define a tuple type to represent a command argument. Create an instance of this tuple and access its elements.

```typescript
// src/exercise-3.ts

// TODO: Define a type alias named `FileLocation` for a tuple.
// The tuple should have two elements: a string followed by a number.
type FileLocation = []; // Replace this

// TODO: Create a variable `location` of type `FileLocation` and initialize it.
// e.g., ['/src/app.ts', 15]
let location: FileLocation; // Replace this

function navigateToFile(path: string, line: number) {
  console.log(`Navigating to ${path} on line ${line}...`);
}

// TODO: Call `navigateToFile` using the elements from your `location` tuple.
// Access them using index notation (e.g., location[0]).
```

#### **Exercise 4: Tuples with Optional and Rest Elements**

Tuples can have optional elements (`?`) and a final rest element (`...`) to capture a variable number of trailing items.

In `src/exercise-4.ts`, define a tuple for a "log" command that takes a required message, an optional log level, and any number of additional structured parameters.

```typescript
// src/exercise-4.ts

// A log entry can have a message, an optional level, and any number of extra details.
// TODO: Define a type alias `LogEntry` for a tuple with:
// 1. A required `string` (the message).
// 2. An optional `string` (the level).
// 3. A rest element that is an array of `any` (`...any[]`).
type LogEntry = []; // Replace this

const entry1: LogEntry = ['User logged in'];
const entry2: LogEntry = ['File not found', 'ERROR'];
const entry3: LogEntry = ['Complex operation failed', 'DEBUG', { userId: 123, file: 'a.ts' }];

function log(data: LogEntry) {
  const [message, level = 'INFO', ...details] = data;
  console.log(`[${level}] ${message}`);
  if (details.length > 0) {
    console.log('  Details:', ...details);
  }
}

log(entry1);
log(entry2);
log(entry3);
```

---

### **Part 3: Enums and Literal Types**

#### **Exercise 5: Using a Numeric Enum**

Enums provide a way to create a set of named numeric constants. This is far more readable and less error-prone than using "magic numbers" in your code.

In `src/exercise-5.ts`, create an enum for different `DiagnosticSeverity` levels.

```typescript
// src/exercise-5.ts

// TODO: Create a numeric enum `DiagnosticSeverity`.
// It should have three members: `Error`, `Warning`, and `Information`.
// By default, `Error` will be 0, `Warning` will be 1, etc.

function reportDiagnostic(severity: DiagnosticSeverity) {
  switch (severity) {
    case DiagnosticSeverity.Error:
      console.error('This is an error!');
      break;
    case DiagnosticSeverity.Warning:
      console.warn('This is a warning.');
      break;
    case DiagnosticSeverity.Information:
      console.info('This is for your information.');
      break;
  }
}

reportDiagnostic(DiagnosticSeverity.Warning);
```

#### **Exercise 6: Using a String Enum**

String enums work similarly but use string values. They are often more descriptive and easier to debug, as the logged or serialized value is human-readable.

In `src/exercise-6.ts`, create a string enum for the state of a status bar item.

```typescript
// src/exercise-6.ts

// TODO: Create a string enum `StatusBarState`.
// It should have two members:
// - `Loading` with the value 'loading'
// - `Ready` with the value 'ready'

function setStatusBar(state: StatusBarState) {
  if (state === StatusBarState.Loading) {
    console.log('Status Bar: Displaying loading spinner...');
  } else {
    console.log('Status Bar: Ready.');
  }
}

setStatusBar(StatusBarState.Loading);
setStatusBar(StatusBarState.Ready);
```

#### **Exercise 7: Using Literal Types**

A literal type is a more lightweight alternative to an enum when you just need to restrict a variable to a few specific primitive values.

In `src/exercise-7.ts`, create a `ThemeColor` type alias for a string literal union. Use it to type a function parameter.

```typescript
// src/exercise-7.ts

// TODO: Create a type alias `ThemeColor` for the string literal union:
// 'dark' | 'light' | 'high-contrast'
type ThemeColor = ''; // Replace this

function applyTheme(theme: ThemeColor) {
  console.log(`Applying ${theme} theme.`);
}

applyTheme('dark');
applyTheme('light');

// This call should cause a compile-time error.
// applyTheme('blue');
```

---

### **Questions**

1.  What is the difference between an empty array typed as `any[]` versus one typed as `never[]`? When might the compiler infer `never[]`?
2.  What is the primary difference in purpose between a tuple (`[string, number]`) and an array of a union type (`(string | number)[]`)?
3.  In a default numeric enum (`enum Color { Red, Green, Blue }`), what is the numeric value of `Color.Blue`?
4.  What is a key advantage of using a string enum over a numeric enum when it comes to debugging or logging?
5.  When would you choose to use a string literal type (like in Exercise 7) instead of a string enum?
6.  `const enum` is a special type of enum in TypeScript. What is its main characteristic and when might you use it?
7.  How would you define a tuple that represents a key-value pair where the key is a `string` and the value can be a `string`, `number`, or `boolean`?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
const supportedLanguages: string[] = ['typescript', 'javascript', 'python'];

// supportedLanguages.push(2); // This correctly causes an error.

console.log('Supported Languages:', supportedLanguages);
```

#### **`src/exercise-2.ts`**```typescript
const lineNumbers = [10, 25, 42];

function logLineNumbers(lines: number[]) {
  console.log('Logging line numbers:', lines);
}

logLineNumbers(lineNumbers);
```

#### **`src/exercise-3.ts`**
```typescript
type FileLocation = [string, number];

let location: FileLocation = ['/src/app.ts', 15];

function navigateToFile(path: string, line: number) {
  console.log(`Navigating to ${path} on line ${line}...`);
}

navigateToFile(location[0], location[1]);
```

#### **`src/exercise-4.ts`**
```typescript
type LogEntry = [string, string?, ...any[]];

const entry1: LogEntry = ['User logged in'];
const entry2: LogEntry = ['File not found', 'ERROR'];
const entry3: LogEntry = ['Complex operation failed', 'DEBUG', { userId: 123, file: 'a.ts' }];

function log(data: LogEntry) {
  const [message, level = 'INFO', ...details] = data;
  console.log(`[${level}] ${message}`);
  if (details.length > 0) {
    console.log('  Details:', ...details);
  }
}

log(entry1);
log(entry2);
log(entry3);
```

#### **`src/exercise-5.ts`**
```typescript
enum DiagnosticSeverity {
  Error,
  Warning,
  Information,
}

function reportDiagnostic(severity: DiagnosticSeverity) {
  switch (severity) {
    case DiagnosticSeverity.Error:
      console.error('This is an error!');
      break;
    case DiagnosticSeverity.Warning:
      console.warn('This is a warning.');
      break;
    case DiagnosticSeverity.Information:
      console.info('This is for your information.');
      break;
  }
}

reportDiagnostic(DiagnosticSeverity.Warning);```

#### **`src/exercise-6.ts`**
```typescript
enum StatusBarState {
  Loading = 'loading',
  Ready = 'ready',
}

function setStatusBar(state: StatusBarState) {
  if (state === StatusBarState.Loading) {
    console.log('Status Bar: Displaying loading spinner...');
  } else {
    console.log('Status Bar: Ready.');
  }
}

setStatusBar(StatusBarState.Loading);
setStatusBar(StatusBarState.Ready);
```

#### **`src/exercise-7.ts`**
```typescript
type ThemeColor = 'dark' | 'light' | 'high-contrast';

function applyTheme(theme: ThemeColor) {
  console.log(`Applying ${theme} theme.`);
}

applyTheme('dark');
applyTheme('light');

// applyTheme('blue'); // This correctly causes an error.
```

---

### **Answers**

1.  **`any[]` vs. `never[]`?**
    *   `any[]` is an array that can hold values of any type. The compiler performs no type checking on its elements. This is often inferred for an empty array `[]` when `strictNullChecks` is off.
    *   `never[]` is an array that can effectively hold no values. The type `never` represents something that should never occur. The compiler infers `never[]` for an empty array `[]` when `strictNullChecks` is *on*, because it cannot infer a type, and `any` is disallowed by the strict setting. This forces you to be explicit about the array's type.

2.  **Tuple (`[string, number]`) vs. Array of Union (`(string | number)[]`)?**
    *   A **tuple** like `[string, number]` has a **fixed length** (2 elements) and a **fixed type for each position** (the first must be a string, the second must be a number). It describes structure.
    *   An **array of a union** like `(string | number)[]` has a **variable length**, and **each element** can be *either* a string or a number. It describes a list of mixed-but-related items.

3.  **Value of `Color.Blue`?**
    In a default numeric enum, the first member is `0`, and each subsequent member increments by one. Therefore, `Color.Red` would be `0`, `Color.Green` would be `1`, and `Color.Blue` would be **`2`**.

4.  **Advantage of string enums for debugging?**
    The primary advantage is readability. When a string enum's value is logged to the console or serialized to JSON, you see a meaningful string (e.g., `"loading"`). When a numeric enum is logged, you just see a number (e.g., `0`), which is less descriptive and requires you to look up what that number represents.

5.  **Literal type vs. string enum?**
    You would choose a string literal type when the set of values is small, simple, and you don't need the extra features of an enum (like reverse mapping from value to name). Literal types are more lightweight as they are purely a compile-time construct and generate no extra JavaScript code. Enums generate a reverse-mapping object in the compiled JavaScript, which adds a small amount of runtime overhead.

6.  **What is `const enum`?**
    A `const enum` is a compile-time-only construct. Unlike a regular enum, it does not generate a lookup object in the compiled JavaScript. Instead, the compiler replaces every usage of the enum member with its corresponding hard-coded value (e.g., `DiagnosticSeverity.Warning` becomes `1`). This results in more performant code with zero runtime overhead. It should be used when you need the readability of an enum in your source code but don't need the runtime reverse-mapping capabilities.

7.  **How to define the key-value pair tuple?**
    You would define it as a tuple where the second element is a union type.
    ```typescript
    type KeyValuePair = [string, string | number | boolean];
    ```