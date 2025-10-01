# Lab: Understanding Static Types

**Time:** Approx. 60-75 minutes

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

### **Introduction: The Core of TypeScript**

JavaScript is dynamically typed, meaning a variable's type is determined at runtime. This flexibility can lead to unexpected errors. TypeScript's primary feature is a powerful static type system, which allows us to declare the intended type of variables and function parameters. The TypeScript compiler then checks our code for type consistency *before* it is ever run, catching a huge class of bugs at compile-time. This lab explores these foundational type-checking features.

---

### **Part 1: Type Annotations and Inference**

#### **Exercise 1: Explicit Type Annotations**

A type annotation is an explicit instruction to the TypeScript compiler about the intended type of a variable, parameter, or function return value.

In `src/exercise-1.ts`, create a function that activates an extension feature. Use explicit type annotations for the function's parameter and its return value.

```typescript
// src/exercise-1.ts

// TODO: Create a function `activateFeature`.
// It should accept one parameter, `featureName`, explicitly typed as a `string`.
// It should explicitly declare that it returns a `boolean`.
// Inside the function, log the feature name and return `true`.


const featureActivated = activateFeature('automatic-updates');
console.log(`Feature activated: ${featureActivated}`);
```

#### **Exercise 2: Type Inference**

TypeScript can often infer the type of a variable from its initial value, which reduces the need for verbose annotations.

In `src/exercise-2.ts`, declare a constant for a configuration setting. Do *not* add a type annotation. Then, try to assign a value of a different type to it and observe the compile-time error.

```typescript
// src/exercise-2.ts

// TODO: Declare a constant `timeout` and initialize it with the number 5000.
// Do not use an explicit type annotation.


// The following line will cause a TypeScript error because `timeout` was inferred as type `number`.
// Your task is to observe this error. You can comment it out to make the file run.
timeout = 'ten-seconds';

console.log(`Timeout is: ${timeout}`);
```

---

### **Part 2: Special Types: `any` and `unknown`**

#### **Exercise 3: The `any` Type**

The `any` type is an "escape hatch" that tells TypeScript to completely opt-out of type checking for a variable. It should be used sparingly, as it undermines the safety TypeScript provides.

In `src/exercise-3.ts`, you are receiving a payload from a legacy system. Use `any` to handle it, but observe the lack of safety.

```typescript
// src/exercise-3.ts

// A payload from a legacy part of the extension, we don't know its shape.
let legacyPayload: any = {
  command: 'show-panel',
  data: { userId: 123 }
};

// TODO: Access a property that exists, e.g., `legacyPayload.command`. Log it.


// TODO: Now, try to access a property that *doesn't* exist, e.g., `legacyPayload.payload.id`.
// TypeScript will NOT complain at compile time because the type is `any`.
// This will throw a runtime error when you run the code.
// Wrap it in a try...catch block to see the error message.
```

#### **Exercise 4: The Safer Alternative: `unknown`**

The `unknown` type is a safer alternative to `any`. It also accepts any value, but you cannot perform any operations on it without first performing a type check or a type assertion to narrow its type.

In `src/exercise-4.ts`, handle the same payload using `unknown` and a type guard.

```typescript
// src/exercise-4.ts

let modernPayload: unknown = {
  command: 'show-panel',
  data: { userId: 123 }
};

// The following line would cause a compile-time error. You can't access properties on `unknown`.
// console.log(modernPayload.command);

// TODO: Use a type guard to check if `modernPayload` is an object and has a `command` property.
// Check `typeof modernPayload === 'object'` and `modernPayload !== null`.
// Inside the `if` block, you'll need a type assertion to tell TS it's safe to access `command`.
// e.g., `(modernPayload as { command: string }).command`
```

---

### **Part 3: Combining Types with Unions**

#### **Exercise 5: Creating and Using a Type Union**

A type union (`|`) allows a variable or parameter to hold values of several different, specific types.

In `src/exercise-5.ts`, create a function that can accept either a numerical `statusCode` or a string `statusMessage`.

```typescript
// src/exercise-5.ts

// TODO: Create a function `logStatus`.
// It should accept one parameter, `status`, with the type `number | string`.
// The function should simply log the status to the console.


logStatus(200);
logStatus('OK');

// The following line should cause a compile-time error.
// logStatus(true);```

#### **Exercise 6: Narrowing Unions with a Type Guard**

You cannot use methods that are specific to one type in a union without first narrowing the type. The `typeof` operator is a perfect type guard for primitive types.

In `src/exercise-6.ts`, modify the `logStatus` function to provide different output based on whether the status is a number or a string.

```typescript
// src/exercise-6.ts

function logStatus(status: number | string) {
  // TODO: Use a `typeof` type guard.
  // If `status` is a 'string', log it in upper case.
  // If it's a 'number', log it with a message like "Status Code: 200".
}

logStatus(404);
logStatus('Not Found');
```

---

### **Part 4: Handling Nullability**

#### **Exercise 7: The `strictNullChecks` Problem**

By default, TypeScript allows `null` and `undefined` to be assigned to any type. This can hide bugs. The `"strictNullChecks": true` compiler option (which is part of `"strict": true`) fixes this.

In `src/exercise-7.ts`, you will find a function that might return `null`. With `strictNullChecks` enabled, TypeScript will correctly identify a potential bug.

```typescript
// src/exercise-7.ts

function findCommand(commandName: string): string | null {
  return ['extension.sayHello', 'extension.showInfo'].includes(commandName) ? commandName : null;
}

const command = findCommand('extension.sayHello');

// TODO: The following line will cause a compile-time error because `command` could be `null`.
// `command.toUpperCase();`
// Your task is to fix this by adding a type guard to check if `command` is not null
// before attempting to call `toUpperCase()` on it.

console.log(`Found command: ${command}`);
```

#### **Exercise 8: The Non-Null Assertion Operator**

In situations where you, the developer, know for certain that a value will not be `null` or `undefined`, you can use the non-null assertion operator (`!`) to tell the compiler to ignore its safety check. This should be used with caution.

In `src/exercise-8.ts`, use the non-null assertion operator to fix the compile-time error.

```typescript
// src/exercise-8.ts

function findCommand(commandName: string): string | null {
  return ['extension.sayHello', 'extension.showInfo'].includes(commandName) ? commandName : null;
}

// In this specific case, we KNOW the command exists.
const command = findCommand('extension.sayHello');

// TODO: Use the non-null assertion operator `!` to tell TypeScript that `command`
// is not null here, allowing you to call `toUpperCase()`.
const upperCommand = ''; // Replace this

console.log(`Upper Command: ${upperCommand}`);
```

---

### **Questions**

1.  What is the key difference in behavior between the `any` and `unknown` types? Which one is generally safer to use and why?
2.  In a function that accepts a type union `string | number[]`, what properties or methods could you safely access on the parameter without using a type guard?
3.  What are two different ways to "narrow" the type of a variable that is a type union?
4.  Why is enabling `"strictNullChecks": true` in `tsconfig.json` considered a professional best practice for new TypeScript projects?
5.  What is the potential risk of using the non-null assertion operator (`!`)?
6.  The `never` type is used to represent a value that should never occur. In a `switch` statement that handles all cases of a string literal union, what would be the type of the variable in the `default` block?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
function activateFeature(featureName: string): boolean {
  console.log(`Activating feature: ${featureName}`);
  return true;
}

const featureActivated = activateFeature('automatic-updates');
console.log(`Feature activated: ${featureActivated}`);
```

#### **`src/exercise-2.ts`**
```typescript
const timeout = 5000;

// timeout = 'ten-seconds'; // This line correctly causes a compile-time error.

console.log(`Timeout is: ${timeout}`);
```

#### **`src/exercise-3.ts`**
```typescript
let legacyPayload: any = {
  command: 'show-panel',
  data: { userId: 123 }
};

console.log(`Command is: ${legacyPayload.command}`);

try {
  console.log(legacyPayload.payload.id);
} catch (error) {
  console.error('Runtime error as expected:', error.message);
}
```

#### **`src/exercise-4.ts`**
```typescript
let modernPayload: unknown = {
  command: 'show-panel',
  data: { userId: 123 }
};

if (
  typeof modernPayload === 'object' &&
  modernPayload !== null &&
  'command' in modernPayload
) {
  // We've guarded the type. Now we can assert and access.
  const command = (modernPayload as { command: string }).command;
  console.log(`Command from guarded payload: ${command}`);
}
```

#### **`src/exercise-5.ts`**
```typescript
function logStatus(status: number | string) {
  console.log(`Status received: ${status}`);
}

logStatus(200);
logStatus('OK');

// logStatus(true); // This line correctly causes a compile-time error.
```

#### **`src/exercise-6.ts`**```typescript
function logStatus(status: number | string) {
  if (typeof status === 'string') {
    console.log(`Status Message: ${status.toUpperCase()}`);
  } else {
    console.log(`Status Code: ${status}`);
  }
}

logStatus(404);
logStatus('Not Found');
```

#### **`src/exercise-7.ts`**
```typescript
function findCommand(commandName: string): string | null {
  return ['extension.sayHello', 'extension.showInfo'].includes(commandName) ? commandName : null;
}

const command = findCommand('extension.sayHello');

if (command !== null) {
  const upperCommand = command.toUpperCase();
  console.log(`Found command: ${upperCommand}`);
} else {
  console.log('Command not found.');
}
```

#### **`src/exercise-8.ts`**
```typescript
function findCommand(commandName: string): string | null {
  return ['extension.sayHello', 'extension.showInfo'].includes(commandName) ? commandName : null;
}

const command = findCommand('extension.sayHello');

const upperCommand = command!.toUpperCase();

console.log(`Upper Command: ${upperCommand}`);
```

---

### **Answers**

1.  **`any` vs. `unknown`?**
    *   **`any`** completely disables the type checker. You can access any property, call it as a function, or assign it to any other type without any compile-time errors. It provides no safety.
    *   **`unknown`** forces you to prove the type is safe before using it. You cannot access properties or call an `unknown` value. You must first use a type guard (like `typeof`) or a type assertion (`as`) to narrow it to a more specific type. **`unknown` is always the safer choice** when you don't know the type of a value.
2.  **What properties can be accessed on `string | number[]`?**
    You can only safely access the properties and methods that are common to **both** `string` and `number[]`. This is a very small set, including methods like `toString()`, `valueOf()`, etc. You could not access `toUpperCase()` (only on string) or `.length` (which has different meanings on both) without a type guard.
3.  **Two ways to narrow a union type?**
    1.  **Type Guard:** Using runtime checks that TypeScript understands, like `typeof`, `instanceof`, or checking for a property with the `in` operator. This is the safest method as it verifies the type at runtime.
    2.  **Type Assertion:** Using the `as` keyword (e.g., `myVar as string`) to tell the compiler to trust your assessment of the type. This provides no runtime safety and should be used only when you are certain of the type.
4.  **Why use `"strictNullChecks": true`?**
    It eliminates an entire class of common runtime errors: "Cannot read property '...' of null/undefined". By making `null` and `undefined` distinct types, it forces the developer to explicitly handle cases where a value might be absent. This leads to more robust, predictable, and self-documenting code, as the possibility of `null` must be declared in the type signature (e.g., `string | null`).
5.  **Risk of the non-null assertion operator (`!`)?**
    The risk is that you might be wrong. The `!` operator is a compile-time-only construct that tells the compiler, "Trust me, this value is not null." The compiler will then allow you to access properties on it. However, if at runtime the value *is* actually `null` or `undefined`, your program will still crash with a `TypeError`. It removes a compile-time safety check without adding any runtime safety.
6.  **Type of the `default` block in an exhaustive `switch`?**
    If a `switch` statement correctly and exhaustively handles every possible case of a union (e.g., all members of a string literal union like `'a' | 'b'`), the type of the variable in the `default` block will be narrowed to **`never`**. This is a powerful feature, as it means you can assign the variable to a `never` type, and the compiler will throw an error if you later add a new member to the union but forget to update the `switch` statement.