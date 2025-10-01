# Lab: Iterators and Generators

**Time:** Approx. 45 minutes

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

### **Introduction: The Iteration Protocol**

JavaScript has a standardized way for objects to define their own iteration behavior. This is known as the **iteration protocol**. It consists of two parts: an **iterable** (an object that can be looped over) and an **iterator** (an object that does the actual work of returning sequential values). This lab explores how to create and consume these constructs, from the manual, low-level approach to the elegant, high-level `generator function` syntax.

---

### **Part 1: Manual Iteration**

#### **Exercise 1: Manually Creating an Iterator**

An iterator is any object that has a `next()` method. This method must return an object with two properties: `value` (the next value in the sequence) and `done` (a boolean indicating if the sequence is complete).

In `src/exercise-1.ts`, create a function `createCommandIterator` that returns a manual iterator for a fixed list of commands.

```typescript
// src/exercise-1.ts

function createCommandIterator(commands: string[]) {
  let index = 0;

  // TODO: Return an object that has a `next()` method.
  // The `next()` method should return the next command object
  // in the format { value: 'commandName', done: false }.
  // When the end of the array is reached, it should return { value: undefined, done: true }.
  return {
    // ... your implementation
  };
}

const iterator = createCommandIterator(['extension.sayHello', 'extension.showInfo']);

let result = iterator.next();
while (!result.done) {
  console.log(result.value);
  result = iterator.next();
}
```

#### **Exercise 2: Consuming an Iterator with a `for...of` Loop**

The manual `while` loop in the previous exercise is verbose. The `for...of` loop is the standard JavaScript syntax for consuming iterables. For it to work, an object must be **iterable**, meaning it must have a property with the key `Symbol.iterator` that is a function returning an iterator.

In `src/exercise-2.ts`, modify the object returned by `createCommandIterator` to make it iterable.

```typescript
// src/exercise-2.ts

function createCommandIterable(commands: string[]) {
  let index = 0;
  
  const commandIterator = {
    next() {
      // ... (implementation from Exercise 1)
      if (index < commands.length) {
        return { value: commands[index++], done: false };
      } else {
        return { value: undefined, done: true };
      }
    },
    // TODO: Add the Symbol.iterator property here.
    // It should be a function that returns `this` (the iterator itself).
  };
  return commandIterator;
}

const iterable = createCommandIterable(['extension.sayHello', 'extension.showInfo']);

// This should now work because the object is iterable.
for (const command of iterable) {
  console.log(command);
}
```

---

### **Part 2: Generator Functions**

Manually managing the state (`index`) of an iterator is tedious. **Generator functions** provide a powerful, high-level syntax to create iterators without the boilerplate. A generator function is a special type of function that can be paused and resumed.

#### **Exercise 3: Refactoring to a Generator Function**

A generator function is declared with `function*` and uses the `yield` keyword to "return" a value from the iterator. The function's state is automatically saved between calls to `next()`.

In `src/exercise-3.ts`, rewrite `createCommandIterator` as a generator function.

```typescript
// src/exercise-3.ts

// TODO: Create a generator function named `commandGenerator`.
// It should accept an array of `commands` and `yield` each one in a loop.
function* commandGenerator(commands: string[]) {
  // ... your implementation using a `for...of` loop and `yield`
}

const iterator = commandGenerator(['extension.sayHello', 'extension.showInfo']);

// The object returned by a generator is already both an iterator and an iterable.
for (const command of iterator) {
  console.log(command);
}
```

#### **Exercise 4: Using the Spread Operator with a Generator**

Because the object returned by a generator function is iterable, it can be used with any JavaScript syntax that consumes iterables, such as the spread operator (`...`).

In `src/exercise-4.ts`, use the generator from the previous exercise and the spread operator to convert the sequence of commands directly into an array.

```typescript
// src/exercise-4.ts

function* commandGenerator(commands: string[]) {
  for (const command of commands) {
    yield command;
  }
}

const commands = ['extension.sayHello', 'extension.showInfo', 'extension.runTests'];

// TODO: Use the spread operator `...` and the `commandGenerator` to create
// a new array named `commandArray` containing all the commands.
const commandArray = []; // Replace this

console.log(commandArray);
```

---

### **Part 3: Making a Class Iterable**

The most common use case for the iteration protocol is to make your own custom classes and data structures behave like built-in iterables (like `Array` or `Map`).

#### **Exercise 5: Adding a Generator Method to a Class**

Let's create a `CommandPalette` class that holds a list of commands. We'll add a generator method to it to expose those commands.

In `src/exercise-5.ts`, implement the `getCommands()` generator method.

```typescript
// src/exercise-5.ts

class CommandPalette {
  private commands: string[];
  
  constructor(commands: string[] = []) {
    this.commands = commands;
  }
  
  // TODO: Create a generator method named `getCommands`.
  // It should iterate over the `this.commands` array and `yield` each command.
}

const palette = new CommandPalette(['extension.sayHello', 'extension.showInfo']);

const commandIterator = palette.getCommands();
for (const command of commandIterator) {
  console.log(command);
}
```

#### **Exercise 6: Making the Class Directly Iterable**

Calling a specific method like `getCommands()` to iterate is not as elegant as being able to iterate over the object directly (e.g., `for (const command of palette)`). We can achieve this by making our generator method the **default iterator** for the class, using the special `Symbol.iterator` property.

In `src/exercise-6.ts`, rename the `getCommands()` method to `*[Symbol.iterator]()`.

```typescript
// src/exercise-6.ts

class CommandPalette {
  private commands: string[];
  
  constructor(commands: string[] = []) {
    this.commands = commands;
  }
  
  // TODO: Rename the `getCommands` generator method to `*[Symbol.iterator]`.
  *[Symbol.iterator]() {
    for (const command of this.commands) {
      yield command;
    }
  }
}

const palette = new CommandPalette(['extension.sayHello', 'extension.showInfo']);

// Now we can iterate directly over the `palette` instance.
for (const command of palette) {
  console.log(command);
}
```

---

### **Questions**

1.  What are the two required properties of the object returned by an iterator's `next()` method, and what do they represent?
2.  What is the key difference between an "iterator" and an "iterable" in JavaScript?
3.  What is the primary advantage of using a generator function (`function*`) over creating a manual iterator object?
4.  In Exercise 5, the `getCommands` method is a generator. What kind of object does it actually return when you call it?
5.  Why is `Symbol.iterator` used as the key for the default iterator method instead of a plain string like `"iterator"`?
6.  Could the spread operator (`...`) have been used on the `palette` object in Exercise 5? Why or why not?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
function createCommandIterator(commands: string[]) {
  let index = 0;
  return {
    next() {
      if (index < commands.length) {
        return { value: commands[index++], done: false };
      } else {
        return { value: undefined, done: true };
      }
    }
  };
}

const iterator = createCommandIterator(['extension.sayHello', 'extension.showInfo']);

let result = iterator.next();
while (!result.done) {
  console.log(result.value);
  result = iterator.next();
}
```

#### **`src/exercise-2.ts`**
```typescript
function createCommandIterable(commands: string[]) {
  let index = 0;
  
  const commandIterator = {
    next() {
      if (index < commands.length) {
        return { value: commands[index++], done: false };
      } else {
        return { value: undefined, done: true };
      }
    },
    [Symbol.iterator]() {
      return this;
    }
  };
  return commandIterator;
}

const iterable = createCommandIterable(['extension.sayHello', 'extension.showInfo']);

for (const command of iterable) {
  console.log(command);
}
```

#### **`src/exercise-3.ts`**
```typescript
function* commandGenerator(commands: string[]) {
  for (const command of commands) {
    yield command;
  }
}

const iterator = commandGenerator(['extension.sayHello', 'extension.showInfo']);

for (const command of iterator) {
  console.log(command);
}
```

#### **`src/exercise-4.ts`**
```typescript
function* commandGenerator(commands: string[]) {
  for (const command of commands) {
    yield command;
  }
}

const commands = ['extension.sayHello', 'extension.showInfo', 'extension.runTests'];

const commandArray = [...commandGenerator(commands)];

console.log(commandArray);
```

#### **`src/exercise-5.ts`**
```typescript
class CommandPalette {
  private commands: string[];
  
  constructor(commands: string[] = []) {
    this.commands = commands;
  }
  
  *getCommands() {
    for (const command of this.commands) {
      yield command;
    }
  }
}

const palette = new CommandPalette(['extension.sayHello', 'extension.showInfo']);

const commandIterator = palette.getCommands();
for (const command of commandIterator) {
  console.log(command);
}
```

#### **`src/exercise-6.ts`**
```typescript
class CommandPalette {
  private commands: string[];
  
  constructor(commands: string[] = []) {
    this.commands = commands;
  }
  
  *[Symbol.iterator]() {
    for (const command of this.commands) {
      yield command;
    }
  }
}

const palette = new CommandPalette(['extension.sayHello', 'extension.showInfo']);

for (const command of palette) {
  console.log(command);
}
```

---

### **Answers**

1.  **What are the two required properties of the object returned by `next()`?**
    The object must have a `value` property, which contains the current value in the sequence, and a `done` property, which is a boolean that is `false` if there are more values to come and `true` when the iteration is complete.
2.  **Difference between an "iterator" and an "iterable"?**
    *   An **iterator** is the object with the `next()` method that does the work of producing values.
    *   An **iterable** is an object that specifies it can be iterated over. It must have a method with the key `Symbol.iterator`. This method's job is to return a new iterator. The `for...of` loop, spread operator, and other constructs work with iterables, not directly with iterators.
3.  **Advantage of a generator function?**
    The primary advantage is that it eliminates the need to manually manage the state of the iteration (like an `index` variable). The generator function's execution is automatically paused and resumed by the JavaScript runtime with each call to `next()`, preserving its local variables and state. This makes the code drastically simpler, more readable, and less error-prone.
4.  **What does a generator method return?**
    When you call a generator function, it does not execute the code inside it immediately. Instead, it returns a special **Generator object**. This Generator object is both an *iterator* (it has a `next()` method) and an *iterable* (it has a `[Symbol.iterator]()` method that returns itself).
5.  **Why `Symbol.iterator`?**
    `Symbol.iterator` is a unique, built-in `Symbol` value. Using a `Symbol` as the property key prevents accidental name collisions. If the key was just a string like `"iterator"`, a developer might accidentally create a property with the same name on their object for a different purpose, which would break the iteration protocol. Using a `Symbol` guarantees that this key is unique and reserved for its specific purpose within the language.
6.  **Could the spread operator be used on the `palette` object in Exercise 5?**
    No, it could not. In Exercise 5, the `palette` object itself was not yet *iterable*. It had a method named `getCommands` that *returned* an iterable, but the `palette` object itself did not have a `[Symbol.iterator]` property. To use the spread operator, you would have had to write `[...palette.getCommands()]`. In Exercise 6, we fixed this by making the `[Symbol.iterator]` method the default iterator, which then allowed the much cleaner `[...palette]` syntax to work.