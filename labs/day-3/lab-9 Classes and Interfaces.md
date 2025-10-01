# Lab: Classes and Interfaces

**Time:** Approx. 75 minutes

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

### **Introduction: Blueprints for Objects**

While `type` aliases and `interface`s describe the *shape* of objects, **classes** provide a complete blueprint for creating objects that have both state (properties) and behavior (methods). TypeScript enhances JavaScript classes with features like access control keywords and a more robust implementation of interfaces, making object-oriented programming safer and more predictable. This lab explores these core OOP features.

---

### **Part 1: Defining and Instantiating Classes**

#### **Exercise 1: Creating a Basic Class**

A class is a template for creating objects. The `constructor` is a special method for creating and initializing an object instance.

In `src/exercise-1.ts`, create a `Logger` class for your extension. It should have a `name` property and a method to log messages.

```typescript
// src/exercise-1.ts

// TODO: Create a class `Logger`.
// 1. It should have a public property `name` of type `string`.
// 2. Its `constructor` should accept a `name` and assign it to the property.
// 3. It should have a method `log(message: string)` that prints a formatted message.
class Logger {
  // ... your implementation
}

const fileLogger = new Logger('FileLogger');
const consoleLogger = new Logger('ConsoleLogger');

fileLogger.log('Saving file...');
consoleLogger.log('Displaying message.');
```

#### **Exercise 2: Using Access Control Keywords**

TypeScript provides `public`, `private`, and `protected` keywords to control the visibility of class members. `private` members can only be accessed from within the class itself.

In `src/exercise-2.ts`, create a `ConfigurationService`. The actual configuration data should be `private` to prevent external code from modifying it directly.

```typescript
// src/exercise-2.ts

class ConfigurationService {
  // TODO: Make this property `private`.
  private config: Map<string, any>;
  
  constructor() {
    this.config = new Map();
    this.config.set('theme', 'dark');
  }
  
  // This public method provides controlled access to the private data.
  get<T>(key: string): T | undefined {
    return this.config.get(key);
  }
}

const configService = new ConfigurationService();

console.log('Theme:', configService.get('theme'));

// The following line should now cause a compile-time error
// because `config` is private.
// console.log(configService.config);
```

#### **Exercise 3: The Concise Constructor Syntax**

To reduce boilerplate, TypeScript allows you to declare and initialize class properties directly in the constructor's parameter list by using an access modifier.

In `src/exercise-3.ts`, refactor the `Logger` class from Exercise 1 to use the concise constructor syntax. Also, make the `name` property `readonly` so it cannot be changed after initialization.

```typescript
// src/exercise-3.ts

// TODO: Refactor this class to use the concise constructor syntax.
// The `name` property should be declared and initialized in the constructor's signature.
// It should also be marked as `readonly`.
class Logger {
  // ... your refactored implementation
}

const logger = new Logger('SystemLogger');
logger.log('System starting up.');

// This line should now cause a compile-time error because `name` is readonly.
// logger.name = 'NewName';
```

---

### **Part 2: Inheritance**

#### **Exercise 4: Creating a Subclass with `extends`**

Inheritance allows a class (the subclass) to inherit properties and methods from another class (the superclass). The `extends` keyword is used to establish this relationship.

In `src/exercise-4.ts`, create a base `View` class and a more specific `PanelView` class that inherits from it.

```typescript
// src/exercise-4.ts

class View {
  constructor(public title: string) {}

  render() {
    console.log(`Rendering view: ${this.title}`);
  }
}

// TODO: Create a class `PanelView` that extends `View`.
// 1. It should have an additional property, `position` of type `'left' | 'right'`.
// 2. Its constructor should accept `title` and `position`.
// 3. It MUST call the parent constructor using `super(title)`.
class PanelView {
  // ... your implementation
}

const panel = new PanelView('Explorer', 'left');
panel.render(); // This method is inherited from `View`.
console.log(`Panel is on the ${panel.position} side.`);
```

#### **Exercise 5: Abstract Classes and Methods**

An `abstract` class cannot be instantiated directly. It serves as a base class that provides common functionality and defines `abstract` methods that subclasses *must* implement.

In `src/exercise-5.ts`, create an `abstract DataProvider` class. It will provide a concrete `getData()` method but require subclasses to implement a specific `parse()` method.

```typescript
// src/exercise-5.ts

// TODO: Make this class `abstract`.
abstract class DataProvider {
  // This is a concrete method shared by all subclasses.
  async getData(): Promise<string[]> {
    const rawData = await this.fetchRawData();
    // It relies on an abstract method that subclasses will provide.
    return this.parse(rawData);
  }
  
  protected abstract fetchRawData(): Promise<string>;
  protected abstract parse(rawData: string): string[];
}

// TODO: Create a `JsonDataProvider` that extends `DataProvider`.
// It must implement the `fetchRawData` and `parse` methods.
class JsonDataProvider extends DataProvider {
  // ... your implementation
  // `fetchRawData` can return a Promise resolving to a JSON string, e.g., '["item1", "item2"]'
  // `parse` should use `JSON.parse()`.
}

const jsonProvider = new JsonDataProvider();
jsonProvider.getData().then(data => console.log('Data:', data));

// This line should cause a compile-time error because `DataProvider` is abstract.
// const abstractProvider = new DataProvider();
```

---

### **Part 3: Interfaces**

An `interface` defines a "code contract" or a shape that a class must adhere to, without providing any implementation.

#### **Exercise 6: Defining and Implementing an Interface**

Interfaces are the preferred way to define contracts for services in an extension.

In `src/exercise-6.ts`, define an `ICommand` interface. Then, create a `ShowInfoMessageCommand` class that `implements` this interface.

```typescript
// src/exercise-6.ts

// TODO: Create an interface `ICommand`.
// It should define one method: `execute()`, which returns `void`.
interface ICommand {
  // ...
}

// TODO: Create a class `ShowInfoMessageCommand` that implements `ICommand`.
// Its `execute` method should log a message to the console.
class ShowInfoMessageCommand implements ICommand {
  // ...
}

const command: ICommand = new ShowInfoMessageCommand();
command.execute();
```

#### **Exercise 7: Using Interfaces for Polymorphism**

One of the most powerful uses of interfaces is to handle different objects that share a common contract in a uniform way (polymorphism).

In `src/exercise-7.ts`, create another command class, `ShowErrorMessageCommand`. Then, create an array of `ICommand` and execute each command, regardless of its specific class.

```typescript
// src/exercise-7.ts

interface ICommand {
  execute(): void;
}
class ShowInfoMessageCommand implements ICommand {
  execute() { console.log('This is an informational message.'); }
}

// TODO: Create another class `ShowErrorMessageCommand` that also implements `ICommand`.
// Its `execute` method should log an error message.
class ShowErrorMessageCommand implements ICommand {
  // ...
}

// TODO: Create an array `commands` typed as `ICommand[]`.
// Populate it with one instance of `ShowInfoMessageCommand` and one of `ShowErrorMessageCommand`.
const commands: ICommand[] = []; // Replace this

// Iterate and execute each command polymorphically.
commands.forEach(cmd => cmd.execute());
```

#### **Exercise 8: Extending Interfaces**

Interfaces can inherit from other interfaces using the `extends` keyword. This is useful for creating more specialized contracts from a base contract.

In `src/exercise-8.ts`, create a base `Disposable` interface and an extended `Cache` interface.

```typescript
// src/exercise-8.ts

interface Disposable {
  dispose(): void;
}

// TODO: Create an interface `Cache` that extends `Disposable`.
// It should add two new members:
// - `set(key: string, value: any): void`
// - `get(key: string): any`
interface Cache {
  // ...
}

class FileCache implements Cache {
  set(key: string, value: any): void {
    console.log(`Setting cache for ${key}`);
  }
  get(key: string): any {
    console.log(`Getting cache for ${key}`);
    return null;
  }
  dispose(): void {
    console.log('Disposing file cache...');
  }
}

const myCache: Cache = new FileCache();
myCache.set('user.settings', { theme: 'dark' });
myCache.dispose(); // This method is available because Cache extends Disposable.
```

---

### **Questions**

1.  What is the difference between `private` and `protected` access modifiers in TypeScript?
2.  What is the purpose of the `readonly` modifier, and when is the value of a `readonly` property set?
3.  Can you create an instance of an `abstract` class? Why or why not?
4.  What is the key difference between a class that `extends` another class and a class that `implements` an interface?
5.  In Exercise 7, the `commands` array is typed as `ICommand[]`. Why is it possible to add instances of both `ShowInfoMessageCommand` and `ShowErrorMessageCommand` to this array?
6.  An `interface` is a compile-time-only construct. What does this mean for the final, compiled JavaScript code?
7.  Can a single class implement multiple interfaces? If so, what is the syntax?
8.  If you have an `abstract` class that `implements` an interface, does the abstract class have to implement all the interface's methods?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
class Logger {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  log(message: string) {
    console.log(`[${this.name}]: ${message}`);
  }
}

const fileLogger = new Logger('FileLogger');
const consoleLogger = new Logger('ConsoleLogger');

fileLogger.log('Saving file...');
consoleLogger.log('Displaying message.');```

#### **`src/exercise-2.ts`**
```typescript
class ConfigurationService {
  private config: Map<string, any>;
  
  constructor() {
    this.config = new Map();
    this.config.set('theme', 'dark');
  }
  
  get<T>(key: string): T | undefined {
    return this.config.get(key);
  }
}

const configService = new ConfigurationService();

console.log('Theme:', configService.get('theme'));
```

#### **`src/exercise-3.ts`**
```typescript
class Logger {
  constructor(public readonly name: string) {}

  log(message: string) {
    console.log(`[${this.name}]: ${message}`);
  }
}

const logger = new Logger('SystemLogger');
logger.log('System starting up.');
```

#### **`src/exercise-4.ts`**
```typescript
class View {
  constructor(public title: string) {}

  render() {
    console.log(`Rendering view: ${this.title}`);
  }
}

class PanelView extends View {
  position: 'left' | 'right';

  constructor(title: string, position: 'left' | 'right') {
    super(title);
    this.position = position;
  }
}

const panel = new PanelView('Explorer', 'left');
panel.render();
console.log(`Panel is on the ${panel.position} side.`);
```

#### **`src/exercise-5.ts`**
```typescript
abstract class DataProvider {
  async getData(): Promise<string[]> {
    const rawData = await this.fetchRawData();
    return this.parse(rawData);
  }
  
  protected abstract fetchRawData(): Promise<string>;
  protected abstract parse(rawData: string): string[];
}

class JsonDataProvider extends DataProvider {
  protected async fetchRawData(): Promise<string> {
    return Promise.resolve('["item1", "item2", "item3"]');
  }
  protected parse(rawData: string): string[] {
    return JSON.parse(rawData);
  }
}

const jsonProvider = new JsonDataProvider();
jsonProvider.getData().then(data => console.log('Data:', data));
```

#### **`src/exercise-6.ts`**
```typescript
interface ICommand {
  execute(): void;
}

class ShowInfoMessageCommand implements ICommand {
  execute() {
    console.log('Executing: Show Info Message');
  }
}

const command: ICommand = new ShowInfoMessageCommand();
command.execute();
```

#### **`src/exercise-7.ts`**
```typescript
interface ICommand {
  execute(): void;
}
class ShowInfoMessageCommand implements ICommand {
  execute() { console.log('This is an informational message.'); }
}

class ShowErrorMessageCommand implements ICommand {
  execute() {
    console.error('This is an error message.');
  }
}

const commands: ICommand[] = [
  new ShowInfoMessageCommand(),
  new ShowErrorMessageCommand(),
];

commands.forEach(cmd => cmd.execute());
```

#### **`src/exercise-8.ts`**
```typescript
interface Disposable {
  dispose(): void;
}

interface Cache extends Disposable {
  set(key: string, value: any): void;
  get(key: string): any;
}

class FileCache implements Cache {
  set(key: string, value: any): void {
    console.log(`Setting cache for ${key}`);
  }
  get(key: string): any {
    console.log(`Getting cache for ${key}`);
    return null;
  }
  dispose(): void {
    console.log('Disposing file cache...');
  }
}

const myCache: Cache = new FileCache();
myCache.set('user.settings', { theme: 'dark' });
myCache.dispose();
```

---

### **Answers**

1.  **`private` vs. `protected`?**
    *   **`private`** members are only accessible from *within the defining class*. They cannot be accessed by subclasses.
    *   **`protected`** members are accessible from within the defining class *and* from any subclasses that extend it. This is used to expose implementation details to child classes while still hiding them from the public.

2.  **Purpose of `readonly`?**
    The `readonly` modifier creates a property that can only be set during its declaration or inside the class's constructor. After the object is initialized, the property cannot be changed. This is used to create immutable properties on a class instance.

3.  **Can you instantiate an `abstract` class?**
    No. An abstract class serves as a blueprint for other classes. It is considered incomplete because it may have abstract methods without an implementation. Attempting to instantiate it directly (`new MyAbstractClass()`) will result in a compile-time error.

4.  **`extends` vs. `implements`?**
    *   **`extends`** is used for class inheritance. A class can only extend *one* other class. It inherits both the implementation (method bodies) and the properties of the parent class.
    *   **`implements`** is used for fulfilling a contract defined by an `interface`. A class can implement *multiple* interfaces. It does not inherit any implementation; it is simply a compile-time check to ensure the class provides its own implementation for all members defined in the interface.

5.  **Why can different classes be in the `ICommand[]` array?**
    This is polymorphism. Because both `ShowInfoMessageCommand` and `ShowErrorMessageCommand` `implement` the `ICommand` interface, they both satisfy the `ICommand` contract. TypeScript's structural type system sees that both classes have an `execute(): void` method, so they are both assignable to the type `ICommand`, and can be treated uniformly.

6.  **What does "compile-time-only" mean for an interface?**
    It means that the `interface` keyword and the contracts it defines are used exclusively by the TypeScript compiler for static type checking. After the compiler has verified the code, all `interface` declarations are completely erased. They do not exist in the final, compiled JavaScript code and have zero runtime overhead.

7.  **Can a class implement multiple interfaces?**
    Yes. You list the interfaces after the `implements` keyword, separated by commas.
    ```typescript
    class MyComponent implements IClickable, IDraggable, ISerializable {
      // ... must implement all methods from all three interfaces
    }
    ```

8.  **Does an `abstract` class have to implement all methods from an interface?**
    No. An abstract class that implements an interface can choose to provide concrete implementations for some methods and leave others as `abstract`. Any subclass that then extends the abstract class is responsible for providing the concrete implementations for the remaining abstract methods. This allows for creating a base implementation of an interface.