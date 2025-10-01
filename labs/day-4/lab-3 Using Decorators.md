# Lab: Using Decorators

**Time:** Approx. 75 minutes

---

### **Setup**

These exercises use the `starter-project-multi` project.

1.  Open the `starter-project-multi` project in Visual Studio Code.
2.  If you haven't already, run `npm install`.
3.  For each exercise, you will create or modify files in the `src` directory.
4.  To run and verify your solution for a specific exercise, use the command:
    ```bash
    npx ts-node src/exercise-1.ts
    ```

---

### **Introduction: Transforming Classes with Decorators**

Decorators are a special kind of declaration that can be attached to a class, method, accessor, property, or parameter. They are functions that can observe, modify, or replace the definition of the item they decorate. This makes them a powerful tool for meta-programming and handling "cross-cutting concerns" like logging, performance monitoring, or data validation without cluttering your core business logic.

---

### **Part 1: Method and Class Decorators**

#### **Exercise 1: Creating a Simple Method Decorator**

A method decorator is a function that receives the original method and a context object, and can return a new function to replace the original. Let's create a simple logging decorator.

In `src/exercise-1.ts`, create a `log` decorator that prints a message before and after the decorated method is called.

```typescript
// src/exercise-1.ts

// The decorator function
function log(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  // TODO: Return a new function that will replace the original method.
  // This function must accept the same arguments as the original.
  // 1. Log `>> Calling ${methodName}`.
  // 2. Call the original method using `originalMethod.call(this, ...args)`.
  // 3. Store the result.
  // 4. Log `<< Exiting ${methodName}`.
  // 5. Return the result.
  function replacementMethod(this: any, ...args: any[]) {
    // ... your implementation
  }
  return replacementMethod;
}

class CommandHandler {
  @log
  run(command: string) {
    console.log(`   Executing command: ${command}`);
    return `Command ${command} finished.`;
  }
}

const handler = new CommandHandler();
const result = handler.run('extension.sayHello');
console.log(`Final result: ${result}`);
```

#### **Exercise 2: Creating a Class Decorator for Serialization**

A class decorator receives the original class constructor and a context object. It can return a new constructor that extends the original, allowing you to add new functionality.

In `src/exercise-2.ts`, create a `serializable` class decorator that adds a `serialize()` method to any class it decorates.

```typescript
// src/exercise-2.ts

// TODO: Create a class decorator named `serializable`.
// It should accept the original class constructor.
// It should return a new class that `extends` the original.
// The new class should have a method `serialize()` that returns `JSON.stringify(this)`.
function serializable<T extends { new (...args: any[]): {} }>(
  originalClass: T,
  context: ClassDecoratorContext
) {
  // ... your implementation
}

@serializable
class ExtensionConfig {
  constructor(public theme: string, public fontSize: number) {}
}

const config = new ExtensionConfig('dark', 14);

// We must use a type assertion here because TypeScript doesn't know
// about the method added by the decorator at compile time.
const json = (config as any).serialize();

console.log(json);
```

---

### **Part 2: Decorator Factories and Other Decorator Types**

#### **Exercise 3: Creating a Decorator Factory**

A decorator factory is a function that *returns* a decorator function. This pattern allows you to pass arguments to your decorator when you apply it, making it configurable.

In `src/exercise-3.ts`, create a `logWithPrefix` factory. It should accept a `prefix` string and create a method decorator that includes the prefix in its log messages.

```typescript
// src/exercise-3.ts

// TODO: Create a decorator factory `logWithPrefix(prefix: string)`.
// It should return a method decorator function.
// This decorator should behave just like the `log` decorator from Exercise 1,
// but the log messages should be prefixed with the provided string.
// e.g., `[MyPrefix] >> Calling run`
function logWithPrefix(prefix: string) {
  // ... your implementation (will be nested)
}

class CommandHandler {
  @logWithPrefix('CMD')
  run(command: string) {
    console.log(`   Executing command: ${command}`);
  }
}

const handler = new CommandHandler();
handler.run('extension.showInfo');
```

#### **Exercise 4: Creating a Field Decorator**

A field (or property) decorator receives a context object and can return an initializer function to modify the initial value of the property.

In `src/exercise-4.ts`, create a `defaultValue` decorator that sets a property's initial value if it is `undefined`.

```typescript
// src/exercise-4.ts

// TODO: Create a field decorator `defaultValue(value: any)`.
// This is a factory that returns a decorator.
// The decorator should return an `initializer` function.
// The initializer should return the provided `value`.
function defaultValue(value: any) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    // ... your implementation
  }
}

class Settings {
  @defaultValue('dark')
  theme: string;

  @defaultValue(14)
  fontSize: number;

  constructor() {
    // The initializers from the decorators run before the constructor body.
    console.log(`Theme is: ${this.theme}`);
    console.log(`Font size is: ${this.fontSize}`);
  }
}

new Settings();
```
*Insight:* This pattern is useful for dependency injection or providing default configuration values.

---

### **Part 3: Advanced Decorator Concepts**

#### **Exercise 5: Using the Decorator Context Object**

The `context` object passed to every decorator is full of useful metadata, such as the name of the decorated member, its kind (`'method'`, `'class'`, etc.), and whether it is `static` or `private`.

In `src/exercise-5.ts`, create a `timing` decorator that measures how long a method takes to execute. It should use `context.name` to log the name of the method being timed.

```typescript
// src/exercise-5.ts

function timing(originalMethod: any, context: ClassMethodDecoratorContext) {
  // TODO: Get the method name from `context.name`.
  const methodName = ''; // Replace this
  
  function replacementMethod(this: any, ...args: any[]) {
    const start = performance.now();
    const result = originalMethod.call(this, ...args);
    const end = performance.now();
    console.log(`${methodName} execution time: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return replacementMethod;
}

class DataFetcher {
  @timing
  fetchData() {
    // Simulate a network delay
    for (let i = 0; i < 1e8; i++) {}
    return 'Some data';
  }
}

const fetcher = new DataFetcher();
fetcher.fetchData();
```

#### **Exercise 6: Using `addInitializer`**

The `context.addInitializer()` method allows a decorator to run some setup code for each instance of the class. This is perfect for tasks like registering an event listener or, in our case, validating a property after the object has been constructed.

In `src/exercise-6.ts`, create a `@validatePositiveNumber` field decorator. It should use an initializer to check the property's value *after* the constructor has run and throw an error if it's not a positive number.

```typescript
// src/exercise-6.ts

function validatePositiveNumber(target: undefined, context: ClassFieldDecoratorContext) {
  const fieldName = String(context.name);
  
  // TODO: Use `context.addInitializer` to add a function.
  // The initializer function runs with `this` set to the class instance.
  // Inside the initializer, get the value of the property using `this[fieldName]`.
  // Check if it's a number and greater than 0. If not, throw an error.
}

class Config {
  @validatePositiveNumber
  timeout: number;

  constructor(timeout: number) {
    this.timeout = timeout;
  }
}

const validConfig = new Config(5000);
console.log('Valid config created.');

try {
  const invalidConfig = new Config(-100);
} catch (error) {
  console.error(error.message);
}
```

---

### **Questions**

1.  What is the fundamental difference between a regular decorator and a decorator factory?
2.  In a method decorator, what is the purpose of `originalMethod.call(this, ...args)`? What would happen if you forgot `call(this)` and just invoked `originalMethod(...args)`?
3.  Why must a type assertion (`as any`) sometimes be used to call a method added by a class decorator?
4.  What is the execution order of decorators when multiple are applied to the same method? (e.g., `@log @timing myMethod()`)
5.  What is the difference between the code that runs inside a field decorator's `initializer` function and the code that runs in the main body of the decorator function itself?
6.  Could you use a decorator to prevent a class from being extended (`final` in other languages)? How might you approach that?
7.  Decorators can modify or replace class features. What are the potential risks of using decorators from untrusted third-party libraries?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
function log(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function replacementMethod(this: any, ...args: any[]) {
    console.log(`>> Calling ${methodName}`);
    const result = originalMethod.call(this, ...args);
    console.log(`<< Exiting ${methodName}`);
    return result;
  }
  return replacementMethod;
}

class CommandHandler {
  @log
  run(command: string) {
    console.log(`   Executing command: ${command}`);
    return `Command ${command} finished.`;
  }
}

const handler = new CommandHandler();
const result = handler.run('extension.sayHello');
console.log(`Final result: ${result}`);
```

#### **`src/exercise-2.ts`**
```typescript
function serializable<T extends { new (...args: any[]): {} }>(
  originalClass: T,
  context: ClassDecoratorContext
) {
  return class extends originalClass {
    serialize() {
      return JSON.stringify(this);
    }
  };
}

@serializable
class ExtensionConfig {
  constructor(public theme: string, public fontSize: number) {}
}

const config = new ExtensionConfig('dark', 14);
const json = (config as any).serialize();

console.log(json);
```

#### **`src/exercise-3.ts`**
```typescript
function logWithPrefix(prefix: string) {
  return function (originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    function replacementMethod(this: any, ...args: any[]) {
      console.log(`[${prefix}] >> Calling ${methodName}`);
      const result = originalMethod.call(this, ...args);
      console.log(`[${prefix}] << Exiting ${methodName}`);
      return result;
    }
    return replacementMethod;
  };
}

class CommandHandler {
  @logWithPrefix('CMD')
  run(command: string) {
    console.log(`   Executing command: ${command}`);
  }
}

const handler = new CommandHandler();
handler.run('extension.showInfo');```

#### **`src/exercise-4.ts`**
```typescript
function defaultValue(value: any) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    return function (originalValue: any) {
      return originalValue === undefined ? value : originalValue;
    };
  };
}

class Settings {
  @defaultValue('dark')
  theme: string;

  @defaultValue(14)
  fontSize: number;

  constructor() {
    console.log(`Theme is: ${this.theme}`);
    console.log(`Font size is: ${this.fontSize}`);
  }
}

new Settings();
```

#### **`src/exercise-5.ts`**
```typescript
function timing(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  
  function replacementMethod(this: any, ...args: any[]) {
    console.log(`Starting timer for ${methodName}...`);
    const start = performance.now();
    const result = originalMethod.call(this, ...args);
    const end = performance.now();
    console.log(`${methodName} execution time: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return replacementMethod;
}

class DataFetcher {
  @timing
  fetchData() {
    for (let i = 0; i < 1e8; i++) {} // Simulate work
    return 'Some data';
  }
}

const fetcher = new DataFetcher();
fetcher.fetchData();
```

#### **`src/exercise-6.ts`**
```typescript
function validatePositiveNumber(target: undefined, context: ClassFieldDecoratorContext) {
  const fieldName = String(context.name);
  
  context.addInitializer(function () {
    const value = this[fieldName];
    if (typeof value !== 'number' || value <= 0) {
      throw new Error(`Property '${fieldName}' must be a positive number.`);
    }
  });
}

class Config {
  @validatePositiveNumber
  timeout: number;

  constructor(timeout: number) {
    this.timeout = timeout;
  }
}

const validConfig = new Config(5000);
console.log('Valid config created.');

try {
  const invalidConfig = new Config(-100);
} catch (error) {
  console.error(error.message);
}
```

---

### **Answers**

1.  **Decorator vs. Decorator Factory?**
    *   A **decorator** is a function that is applied directly to a target (e.g., `@log`). It accepts arguments like the original method and a context object.
    *   A **decorator factory** is a function that you call, which then *returns* the actual decorator function (e.g., `@logWithPrefix('MyPrefix')`). This factory pattern is used to pass configuration arguments to the decorator at the time of its application.

2.  **Purpose of `originalMethod.call(this, ...args)`?**
    This is crucial for preserving the `this` context. When `replacementMethod` is called, `this` refers to the class instance. `originalMethod.call(this, ...)` executes the original method, but explicitly sets its `this` context to be the same instance. If you just called `originalMethod(...args)`, it would be invoked as a stand-alone function, and its `this` would be `undefined` in strict mode, leading to a `TypeError` if it tried to access any instance properties.

3.  **Why is `as any` sometimes needed for methods added by a class decorator?**
    Decorators operate at runtime (or more accurately, at class definition time), but TypeScript's type system operates at compile time. When you apply a class decorator that adds a new method (`serialize()`), the static type definition of the original class (`ExtensionConfig`) does not know about this new method. The compiler only sees the original shape of the class. Using `as any` is a way to tell the compiler, "Trust me, I know this method will exist at runtime, so please don't give me a compile-time error."

4.  **Execution order of multiple decorators?**
    Decorator evaluation happens in two phases:
    1.  **Factories (if any) are called from top to bottom.** In `@log @timing`, the `log` factory would be called before the `timing` factory.
    2.  **The actual decorators are applied from bottom to top (inside-out).** The `timing` decorator would wrap the original method first. Then, the `log` decorator would wrap the function *returned by the `timing` decorator*. The outermost decorator is the first one you see in the call stack at runtime.

5.  **Decorator body vs. initializer function?**
    *   Code in the **main body of the decorator** runs only *once* per decorated field, when the class itself is first defined by the JavaScript runtime. It does not have access to the class instance.
    *   Code in an **initializer function (added via `addInitializer`)** runs *for every new instance* of the class, after the constructor has assigned its properties. It has access to the instance via `this`, making it ideal for validation or instance-specific setup.

6.  **Could you use a decorator to create a `final` class?**
    Yes. You could create a class decorator that, when applied, checks if the class it's replacing has been extended. If so, it could throw an error. A simpler approach would be for the decorator to return a new class that, in its constructor, checks `this.constructor !== TheNewClass` and throws an error, effectively preventing inheritance.

7.  **Risks of third-party decorators?**
    The primary risk is that decorators have the power to fundamentally alter your code's behavior in non-obvious ways. An untrusted decorator could:
    *   Log sensitive data from method arguments or return values.
    *   Change the return value of a method to something malicious.
    *   Introduce performance bottlenecks by adding heavy computations.
    *   Monkey-patch your classes in unpredictable ways.
    You should only use decorators from trusted, well-vetted libraries, just as with any other dependency.