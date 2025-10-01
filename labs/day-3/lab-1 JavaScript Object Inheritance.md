# Lab: JavaScript Object Inheritance

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

### **Introduction: The Prototype Chain**

Unlike classical inheritance found in languages like Java or C#, JavaScript uses **prototypal inheritance**. Every object has a hidden link to another object, called its "prototype." When you try to access a property on an object, the runtime first checks the object itself. If the property isn't found, it checks the object's prototype, then the prototype's prototype, and so on, until it finds the property or reaches the end of the chain. This lab explores this fundamental mechanism.

---

### **Part 1: Raw Prototypes**

#### **Exercise 1: Inspecting the Prototype Chain**

Every object literal in JavaScript, by default, inherits from `Object.prototype`. This base prototype provides common methods like `toString()` and `hasOwnProperty()`.

In `src/exercise-1.ts`, create a simple object and inspect its prototype to verify this relationship.

```typescript
// src/exercise-1.ts

const baseConfig = {
  name: 'MyExtension',
};

// TODO: Get the prototype of `baseConfig` using `Object.getPrototypeOf()`.
const proto = {}; // Replace this

// TODO: Check if the prototype is equal to `Object.prototype`.
const isBaseObjectProto = false; // Replace this

console.log(`Prototype of baseConfig is Object.prototype: ${isBaseObjectProto}`);

// We can call methods from the prototype, like toString()
console.log(baseConfig.toString());
```

#### **Exercise 2: Creating a Custom Prototype**

We can create our own chain of inheritance. Let's create a base object with a shared method and have other objects inherit from it. This is a common pattern for sharing default behaviors.

In `src/exercise-2.ts`, create a `commandPrototype` with a `log()` method. Then, create two new command objects, `command1` and `command2`, and set their prototype to `commandPrototype` using `Object.setPrototypeOf()`.

```typescript
// src/exercise-2.ts

const commandPrototype = {
  log() {
    console.log(`Command '${this.name}' executed.`);
  }
};

const command1 = {
  name: 'extension.sayHello',
};

const command2 = {
  name: 'extension.showInfo',
};

// TODO: Set the prototype of `command1` and `command2` to be `commandPrototype`.


// Now, both commands can use the log method from their prototype.
command1.log();
command2.log();
```

*Insight:* Note how the `this` keyword inside the `log` method correctly refers to `command1` and `command2` respectively, because it's called *on* those objects.

---

### **Part 2: Constructor Functions**

The "classic" way to create objects with a shared prototype before the `class` keyword was introduced is by using **constructor functions**.

#### **Exercise 3: Creating a Constructor Function**

A constructor function is a regular function that is invoked with the `new` keyword. When called with `new`, JavaScript automatically creates a new object, sets its prototype to the constructor's `prototype` property, and binds `this` to the new object.

In `src/exercise-3.ts`, create a `Command` constructor function that initializes `name` and `description`. Add a `log()` method to its `prototype`.

```typescript
// src/exercise-3.ts

// TODO: Create a constructor function named `Command`.
// It should accept `name` and `description` as arguments and assign them to `this`.
function Command(name: string, description: string) {
  // ... your implementation
}

// TODO: Add a `log` method to the `Command.prototype`.
// This method should log the command's name.


const cmd1 = new Command('extension.sayHello', 'Says Hello');
const cmd2 = new Command('extension.showInfo', 'Shows Info');

cmd1.log();
cmd2.log();
```

#### **Exercise 4: Chaining Constructors**

We can create more specialized constructors that build upon a base constructor. This requires two steps: calling the parent constructor with `.call()` and linking the prototypes.

In `src/exercise-4.ts`, create a `StatusBarCommand` constructor that inherits from `Command`. It should add a `statusBarText` property.

```typescript
// src/exercise-4.ts

function Command(name: string, description: string) {
  this.name = name;
  this.description = description;
}
Command.prototype.log = function() {
  console.log(`Command '${this.name}' executed.`);
}

// TODO: Create a `StatusBarCommand` constructor.
// It should accept `name`, `description`, and `statusBarText`.
// Inside it, call the parent `Command` constructor using `Command.call(this, ...)`.
function StatusBarCommand(name: string, description: string, statusBarText: string) {
  // ... your implementation
}

// TODO: Link the prototypes. Set `StatusBarCommand.prototype` to inherit from `Command.prototype`.
// Hint: `Object.setPrototypeOf(StatusBarCommand.prototype, Command.prototype);`


const statusBarCmd = new StatusBarCommand('extension.showLoading', 'Shows loading indicator', 'Loading...');
statusBarCmd.log(); // Should work, inherited from Command.prototype
console.log(`Status Bar Text: ${statusBarCmd.statusBarText}`);
```

#### **Exercise 5: Checking the Prototype Chain with `instanceof`**

The `instanceof` operator checks if an object's prototype chain includes the `prototype` property of a constructor. It's the standard way to check an object's "type" in a prototypal system.

In `src/exercise-5.ts`, use the code from the previous exercise and verify the prototype chain of `statusBarCmd`.

```typescript
// src/exercise-5.ts

// ... (copy the full Command and StatusBarCommand setup from Exercise 4)

const statusBarCmd = new StatusBarCommand('extension.showLoading', 'Shows loading indicator', 'Loading...');

// TODO: Check if `statusBarCmd` is an instance of `StatusBarCommand`.
const isStatusBarCommand = false; // Replace this

// TODO: Check if `statusBarCmd` is also an instance of `Command`.
const isCommand = false; // Replace this

console.log(`Is instance of StatusBarCommand? ${isStatusBarCommand}`);
console.log(`Is instance of Command? ${isCommand}`);
```

---

### **Part 3: The `class` Syntax**

The `class` syntax, introduced in ES2015, provides a much cleaner, more familiar syntax for doing exactly what we just did with constructor functions. It is **syntactic sugar** over the underlying prototypal inheritance model.

#### **Exercise 6: Refactoring to a `class`**

Let's convert our `Command` constructor function into a modern `class`.

In `src/exercise-6.ts`, create a `Command` class that has a `constructor` and a `log` method.

```typescript
// src/exercise-6.ts

// TODO: Create a class named `Command`.
// It should have a constructor that accepts `name` and `description`.
// It should also have a `log` method.
class Command {
  // ... your implementation
}

const cmd = new Command('extension.sayHello', 'Says Hello');
cmd.log();
```

#### **Exercise 7: Class Inheritance with `extends` and `super`**

Class inheritance is achieved with the `extends` keyword. The `super()` call inside a subclass constructor is mandatory and calls the parent class's constructor.

In `src/exercise-7.ts`, convert the `StatusBarCommand` constructor to a class that `extends` `Command`.

```typescript
// src/exercise-7.ts

class Command {
  name: string;
  description: string;
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
  log() {
    console.log(`Command '${this.name}' executed.`);
  }
}

// TODO: Create a `StatusBarCommand` class that extends `Command`.
// Its constructor should accept `name`, `description`, and `statusBarText`.
// It must call `super()` to initialize the parent class.
class StatusBarCommand {
  // ... your implementation
}

const statusBarCmd = new StatusBarCommand('extension.showLoading', 'Shows loading indicator', 'Loading...');
statusBarCmd.log(); // Inherited method
console.log(`Status Bar Text: ${statusBarCmd.statusBarText}`);
```

---

### **Questions**

1.  What is the fundamental difference between an object's own properties and the properties it has "on its prototype"?
2.  In Exercise 2, if you were to define `command1.log = function() { console.log('Overridden!'); }`, what would happen when you call `command1.log()`? Why?
3.  Why is the `.call(this, ...)` necessary when chaining constructor functions (Exercise 4)? What would be missing if you omitted that line?
4.  The `instanceof` operator checks the prototype chain. Is it possible for an object to have access to a method but for `instanceof` to return `false` for the constructor that provided it? (Hint: Think about `Object.setPrototypeOf`).
5.  What does the term "syntactic sugar" mean in the context of JavaScript `class`es?
6.  In a class that uses `extends`, why is it mandatory to call `super()` inside the constructor before you can use the `this` keyword?
7.  How would you add a "static" method to the `Command` class (Exercise 7) that could be called as `Command.getRegisteredCommands()` without needing an instance of the class?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
const baseConfig = {
  name: 'MyExtension',
};

const proto = Object.getPrototypeOf(baseConfig);
const isBaseObjectProto = proto === Object.prototype;

console.log(`Prototype of baseConfig is Object.prototype: ${isBaseObjectProto}`);
console.log(baseConfig.toString());
```

#### **`src/exercise-2.ts`**
```typescript
const commandPrototype = {
  log() {
    console.log(`Command '${this.name}' executed.`);
  }
};

const command1 = {
  name: 'extension.sayHello',
};

const command2 = {
  name: 'extension.showInfo',
};

Object.setPrototypeOf(command1, commandPrototype);
Object.setPrototypeOf(command2, commandPrototype);

command1.log();
command2.log();
```

#### **`src/exercise-3.ts`**
```typescript
function Command(name: string, description: string) {
  this.name = name;
  this.description = description;
}

Command.prototype.log = function() {
  console.log(`Command '${this.name}' executed.`);
};

const cmd1 = new Command('extension.sayHello', 'Says Hello');
const cmd2 = new Command('extension.showInfo', 'Shows Info');

cmd1.log();
cmd2.log();
```

#### **`src/exercise-4.ts`**
```typescript
function Command(name: string, description: string) {
  this.name = name;
  this.description = description;
}
Command.prototype.log = function() {
  console.log(`Command '${this.name}' executed.`);
}

function StatusBarCommand(name: string, description: string, statusBarText: string) {
  Command.call(this, name, description);
  this.statusBarText = statusBarText;
}

Object.setPrototypeOf(StatusBarCommand.prototype, Command.prototype);

const statusBarCmd = new StatusBarCommand('extension.showLoading', 'Shows loading indicator', 'Loading...');
statusBarCmd.log();
console.log(`Status Bar Text: ${statusBarCmd.statusBarText}`);
```

#### **`src/exercise-5.ts`**
```typescript
function Command(name: string, description: string) {
  this.name = name;
  this.description = description;
}
Command.prototype.log = function() {
  console.log(`Command '${this.name}' executed.`);
}

function StatusBarCommand(name: string, description: string, statusBarText: string) {
  Command.call(this, name, description);
  this.statusBarText = statusBarText;
}
Object.setPrototypeOf(StatusBarCommand.prototype, Command.prototype);

const statusBarCmd = new StatusBarCommand('extension.showLoading', 'Shows loading indicator', 'Loading...');

const isStatusBarCommand = statusBarCmd instanceof StatusBarCommand;
const isCommand = statusBarCmd instanceof Command;

console.log(`Is instance of StatusBarCommand? ${isStatusBarCommand}`);
console.log(`Is instance of Command? ${isCommand}`);
```

#### **`src/exercise-6.ts`**
```typescript
class Command {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  log() {
    console.log(`Command '${this.name}' executed.`);
  }
}

const cmd = new Command('extension.sayHello', 'Says Hello');
cmd.log();
```

#### **`src/exercise-7.ts`**
```typescript
class Command {
  name: string;
  description: string;
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
  log() {
    console.log(`Command '${this.name}' executed.`);
  }
}

class StatusBarCommand extends Command {
  statusBarText: string;

  constructor(name: string, description: string, statusBarText: string) {
    super(name, description);
    this.statusBarText = statusBarText;
  }
}

const statusBarCmd = new StatusBarCommand('extension.showLoading', 'Shows loading indicator', 'Loading...');
statusBarCmd.log();
console.log(`Status Bar Text: ${statusBarCmd.statusBarText}`);
```

---

### **Answers**

1.  **Own properties vs. prototype properties?**
    An object's "own properties" are the key/value pairs that are attached directly to the object instance itself. Prototype properties are not on the object itself but are on another object that it links to. The runtime will only look at prototype properties if it cannot find an "own property" with the same name.
2.  **What happens if you override a prototype method?**
    The overridden method on the `command1` instance would be called. The JavaScript runtime's property lookup mechanism always checks for an "own property" on the object first. Since it would find `log` directly on `command1`, it would execute that version and never walk up the prototype chain to find the one on `commandPrototype`.
3.  **Why is `.call(this, ...)` necessary?**
    The `.call(this, ...)` is necessary to execute the parent constructor's logic *in the context of the new object*. When `new StatusBarCommand()` is called, a new object is created and assigned to `this`. The `.call(this, ...)` line effectively says, "Run the `Command` function, but make sure its `this` is the same as my `this`." If you omitted it, the properties that the parent `Command` constructor is supposed to initialize (`name`, `description`) would be missing from the final `StatusBarCommand` instance.
4.  **Is it possible for `instanceof` to be false for a method an object has?**
    Yes. `instanceof` specifically checks the constructor's `prototype` property. If you manually link objects using `Object.setPrototypeOf()` as in Exercise 2, the `command1` object has access to the `log` method from `commandPrototype`. However, `command1 instanceof SomeConstructor` would likely be false, because `command1` was created as an object literal and its prototype chain was manually altered, not established by a constructor function.
5.  **What does "syntactic sugar" mean?**
    It means the `class` syntax provides a cleaner, more convenient, and more familiar way to write code, but it does not introduce any new, fundamental functionality to the language. Behind the scenes, the JavaScript engine translates `class`, `extends`, `constructor`, and `super` into the older, more verbose system of constructor functions and direct prototype manipulation that we practiced in Part 2 of this lab.
6.  **Why is `super()` mandatory in a subclass constructor?**
    In JavaScript's class model, the parent class is responsible for creating and initializing the object instance (`this`). The `super()` call is what executes the parent constructor. Until `super()` has been called, the `this` value for the new object does not exist in the subclass's constructor. Attempting to access `this` before `super()` results in a `ReferenceError`.
7.  **How would you add a static method?**
    You add the `static` keyword before the method name inside the class definition. Static methods are attached to the class (constructor function) itself, not to its prototype, and are called directly on the class.
    ```typescript
    class Command {
      // ... constructor and other methods
      static getRegisteredCommands() {
        return ['extension.sayHello', 'extension.showInfo'];
      }
    }
    console.log(Command.getRegisteredCommands());
    ```