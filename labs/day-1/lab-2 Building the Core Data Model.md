# Lab: Building the Core Data Model

**Module:** Day 1: Foundations & JavaScript Essentials
**Time:** Approx. 60 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Create and export TypeScript classes to model application data.
*   Utilize the concise constructor syntax to reduce boilerplate code.
*   Implement a collection class to manage and operate on data objects.
*   Refactor an implementation from an `Array` to a `Map` for more efficient data access.
*   Define and use a `type` alias to describe the shape of a simple data object.

### 2. Scenario

Every non-trivial VS Code extension needs a robust internal data model to manage its state. Before we can build any user interface (like a Tree View or a Quick Pick menu), we must first create the underlying logic that handles the data.

In this lab, we will build the core data model and business logic for a task management system. We will create classes to represent individual tasks (`TodoItem`) and a collection to manage them (`TodoCollection`). This logic will run in a pure Node.js environment, serving as a test harness for the "engine" of our future extension.

### 3. Prerequisites

*   Completion of the "Lab: Setting Up the Development Environment".
*   Completion of the "Lab: Creating a VS Code Debug Configuration".
*   You must have the `vscode-ext-logic` copy in your `todo-app` folder and the project open in VS Code.

### 4. Steps

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Create the `TodoItem` Data Class**
    First, we need a class to represent a single to-do item. We will start with a more verbose syntax and then refactor it to the standard, concise TypeScript syntax.

    Create a new file `src/todoItem.ts`. Add the following verbose class definition:
    ```typescript
    // src/todoItem.ts
    export class TodoItem {
        public id: number;
        public task: string;
        public complete: boolean = false;
    
        public constructor(id: number, task: string, complete: boolean = false) {
            this.id = id;
            this.task = task;
            this.complete = complete;
        }
    
        public printDetails(): void {
            console.log(`${this.id}\t${this.task} ${this.complete ? "\t(complete)": ""}`);
        }
    }
    ```
    Now, refactor this class to use TypeScript's concise constructor syntax, which automatically creates properties for constructor parameters that have access modifiers (like `public`).

    Replace the content of `src/todoItem.ts` with this improved version:
    ```typescript
    // src/todoItem.ts
    export class TodoItem {
        constructor(
            public id: number,
            public task: string,
            public complete: boolean = false
        ) {
            // no statements required
        }
    
        printDetails(): void {
            console.log(`${this.id}\t${this.task} ${this.complete ? "\t(complete)": ""}`);
        }
    }
    ```
    *Insight:* This concise syntax is the professional standard. It significantly reduces boilerplate code and the risk of errors from manually assigning properties.

2.  **Create the Initial `TodoCollection` Class**
    Next, we'll create a class to manage a collection of `TodoItem` objects. Initially, it will use a simple array for storage.

    Create a new file `src/todoCollection.ts` with the following content:
    ```typescript
    // src/todoCollection.ts
    import { TodoItem } from "./todoItem";
    
    export class TodoCollection {
        private nextId: number = 1;
    
        constructor(public userName: string, public todoItems: TodoItem[] = []) {
            // no statements required
        }
    
        addTodo(task: string): number {
            while (this.getTodoById(this.nextId)) {
                this.nextId++;
            }
            this.todoItems.push(new TodoItem(this.nextId, task));
            return this.nextId;
        }
    
        getTodoById(id: number): TodoItem | undefined {
            return this.todoItems.find(item => item.id === id);
        }
    
        markComplete(id: number, complete: boolean): void {
            const todoItem = this.getTodoById(id);
            if (todoItem) {
                todoItem.complete = complete;
            }
        }
    }
    ```
    *Insight:* Note that `getTodoById` returns `TodoItem | undefined`. Our `strict` compiler setting forces us to acknowledge that `find` might not return a result.

3.  **Implement Initial Application Logic**
    Now, let's use these classes. We will create some sample data and test the basic functionality.

    Replace the content of `src/index.ts` with the following:
    ```typescript
    // src/index.ts
    import { TodoItem } from './todoItem';
    import { TodoCollection } from './todoCollection';
    
    let todos: TodoItem[] = [
      new TodoItem(1, 'Buy Flowers'),
      new TodoItem(2, 'Get Shoes'),
      new TodoItem(3, 'Collect Tickets'),
      new TodoItem(4, 'Call Joe', true),
    ];
    
    let collection: TodoCollection = new TodoCollection('Adam', todos);
    
    console.clear();
    console.log(`${collection.userName}'s Todo List`);
    
    let newId: number = collection.addTodo('Go for run');
    let todoItem = collection.getTodoById(newId);
    
    if (todoItem) {
        todoItem.printDetails();
    }
    ```
    **Verification:** Compile and run the code (`npx tsc` then `node dist/index.js`). The output should be:
    ```text
    Adam's Todo List
    5       Go for run
    ```

4.  **Refactor `TodoCollection` to Use a `Map`**
    Using an array for `getTodoById` requires scanning the entire list (O(n) complexity). A `Map` provides much more efficient key-based lookups (O(1) complexity). Let's refactor our collection.

    Modify `src/todoCollection.ts`. We will change the storage property and update the methods that interact with it.
    ```typescript
    // src/todoCollection.ts
    // ...
    export class TodoCollection {
        private nextId: number = 1;
        private itemMap = new Map<number, TodoItem>(); // <-- CHANGE THIS
    
        constructor(public userName: string, todoItems: TodoItem[] = []) {
            todoItems.forEach(item => this.itemMap.set(item.id, item)); // <-- CHANGE THIS
        }
    
        addTodo(task: string): number {
            while (this.getTodoById(this.nextId)) {
                this.nextId++;
            }
            this.itemMap.set(this.nextId, new TodoItem(this.nextId, task)); // <-- CHANGE THIS
            return this.nextId;
        }
    
        getTodoById(id: number): TodoItem | undefined {
            return this.itemMap.get(id); // <-- CHANGE THIS
        }
        // ... markComplete remains the same
    }
    ```
    *Insight:* We use TypeScript's generics (`Map<number, TodoItem>`) to ensure the map is strongly typed for both its keys and values.

5.  **Extend `TodoCollection` with Business Logic**
    Let's add more features to our collection class, including filtering, removing completed items, and getting item counts. This step also introduces a `type` alias for a custom shape.

    Add the following methods and type alias to `src/todoCollection.ts`:
    ```typescript
    // src/todoCollection.ts
    import { TodoItem } from "./todoItem";
    
    type ItemCounts = { // <-- ADD THIS TYPE ALIAS
        total: number,
        incomplete: number
    }
    
    export class TodoCollection {
        // ... existing properties and methods
    
        getTodoItems(includeComplete: boolean): TodoItem[] { // <-- ADD THIS METHOD
            return [...this.itemMap.values()]
                .filter(item => includeComplete || !item.complete);
        }
    
        removeComplete(): void { // <-- ADD THIS METHOD
            this.itemMap.forEach(item => {
                if (item.complete) {
                    this.itemMap.delete(item.id);
                }
            })
        }
    
        getItemCounts(): ItemCounts { // <-- ADD THIS METHOD
            return {
                total: this.itemMap.size,
                incomplete: this.getTodoItems(false).length
            };
        }
    }
    ```

6.  **Update Application Logic to Use New Features**
    Finally, update `src/index.ts` to test all the new functionality of our `TodoCollection`.

    Replace the contents of `src/index.ts` with this final version:
    ```typescript
    // src/index.ts
    import { TodoItem } from './todoItem';
    import { TodoCollection } from './todoCollection';
    
    let todos: TodoItem[] = [
      new TodoItem(1, 'Buy Flowers'),
      new TodoItem(2, 'Get Shoes'),
      new TodoItem(3, 'Collect Tickets'),
      new TodoItem(4, 'Call Joe', true),
    ];
    
    let collection: TodoCollection = new TodoCollection('Adam', todos);
    
    console.clear();
    console.log(
      `${collection.userName}'s Todo List ` +
        `(${collection.getItemCounts().incomplete} items to do)`
    );
    
    collection.removeComplete();
    
    collection.getTodoItems(true).forEach((item) => item.printDetails());
    ```

### 5. Verification
1.  **Compile the code.**
    From your terminal, run the TypeScript compiler. It should complete without errors.
    ```bash
    npx tsc
    ```
2.  **Run the application.**
    Execute the compiled JavaScript entry point using Node.js.
    ```bash
    node dist/index.js
    ```
3.  **Check the output.**
    The console output should be identical to the following:
    ```text
    Adam's Todo List (3 items to do)
    1       Buy Flowers
    2       Get Shoes
    3       Collect Tickets
    ```

### 6. Discussion
You have successfully created a robust, object-oriented data model. This lab demonstrated several core TypeScript concepts:
*   **Classes and Encapsulation:** We created `TodoItem` and `TodoCollection` to encapsulate data and related behavior. `private` properties like `itemMap` hide implementation details from the consumer of the class.
*   **Refactoring with Confidence:** TypeScript's static type checking allowed us to refactor the internal storage of `TodoCollection` from an `Array` to a `Map` with a high degree of confidence, as the compiler would immediately flag any part of our code that was not updated correctly.
*   **Type Aliases for Data Shapes:** The `ItemCounts` type alias provided a clear, reusable name for the shape of the object returned by `getItemCounts()`, improving code readability and maintainability.

This well-defined, self-contained logic is now ready to be consumed by other parts of an application, such as the UI layer of a VS Code extension.

### 7. Questions
1.  Why is the concise constructor syntax (`constructor(public id: number, ...)` a significant improvement over the verbose version?
2.  What was the primary technical advantage of refactoring the `todoItems` storage from an `Array` to a `Map`?
3.  In `todoCollection.ts`, what is the difference in purpose between the `class TodoCollection` and the `type ItemCounts`?
4.  What would the TypeScript compiler do if you tried to add a `string` to the `todos` array in `index.ts`, for example: `new TodoItem(5, 'Test'), "a random string"`?
5.  The `getTodoById` method returns `TodoItem | undefined`. Why is this `| undefined` part important, and how does it help prevent bugs?

---

### 8. Solution

#### 8.1. Final Code Artifacts
**`src/todoItem.ts`**
```typescript
export class TodoItem {
    constructor(
        public id: number,
        public task: string,
        public complete: boolean = false
    ) {
        // no statements required
    }

    printDetails(): void {
        console.log(`${this.id}\t${this.task} ${this.complete ? "\t(complete)": ""}`);
    }
}
```

**`src/todoCollection.ts`**
```typescript
import { TodoItem } from "./todoItem";

type ItemCounts = {
    total: number,
    incomplete: number
}

export class TodoCollection {
    private nextId: number = 1;
    private itemMap = new Map<number, TodoItem>();

    constructor(public userName: string, todoItems: TodoItem[] = []) {
        todoItems.forEach(item => this.itemMap.set(item.id, item));
    }

    addTodo(task: string): number {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
        return this.nextId;
    }

    getTodoById(id: number): TodoItem | undefined {
        return this.itemMap.get(id);
    }
    
    getTodoItems(includeComplete: boolean): TodoItem[] {
        return [...this.itemMap.values()]
            .filter(item => includeComplete || !item.complete);
    }

    markComplete(id: number, complete: boolean): void {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
        }
    }

    removeComplete(): void {
        this.itemMap.forEach(item => {
            if (item.complete) {
                this.itemMap.delete(item.id);
            }
        })
    }

    getItemCounts(): ItemCounts {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }
}
```

**`src/index.ts`**
```typescript
import { TodoItem } from './todoItem';
import { TodoCollection } from './todoCollection';

let todos: TodoItem[] = [
  new TodoItem(1, 'Buy Flowers'),
  new TodoItem(2, 'Get Shoes'),
  new TodoItem(3, 'Collect Tickets'),
  new TodoItem(4, 'Call Joe', true),
];

let collection: TodoCollection = new TodoCollection('Adam', todos);

console.clear();
console.log(
  `${collection.userName}'s Todo List ` +
    `(${collection.getItemCounts().incomplete} items to do)`
);

collection.removeComplete();

collection.getTodoItems(true).forEach((item) => item.printDetails());
```

#### 8.2. Command Summary
```bash
npx tsc
node dist/index.js
```

### 9. Answers

#### 9.1. Answers to Questions
1.  **Why is the concise constructor syntax an improvement?**
    It reduces boilerplate code significantly. Instead of declaring a property, accepting a parameter in the constructor, and then assigning the parameter to the property (`this.id = id;`), the concise syntax does all three in one step. This makes the code cleaner, easier to read, and less prone to copy-paste errors or typos.

2.  **Advantage of refactoring to a `Map`?**
    The primary advantage is performance for lookups. When using an array, `getTodoById` must potentially iterate over every element to find a match (O(n) time complexity). A `Map` uses a hash table internally, allowing direct lookups by key in constant time (O(1) on average). For a collection that will grow large and require frequent lookups, a `Map` is a much more efficient data structure.

3.  **`class TodoCollection` vs. `type ItemCounts`?**
    *   **`class TodoCollection`** defines a blueprint for creating objects that have both *state* (data, like `itemMap`) and *behavior* (methods, like `addTodo`). It is a runtime construct that exists in the compiled JavaScript.
    *   **`type ItemCounts`** is a type alias that defines a "shape" or "contract" for an object. It has no behavior and is a compile-time-only construct. It is used for static type checking and is completely erased during compilation, leaving no trace in the final JavaScript.

4.  **What if you added a `string` to the `todos` array?**
    The TypeScript compiler would immediately raise a compile-time error. The `todos` array is typed as `TodoItem[]` through type inference. The error message would state: `Argument of type 'string' is not assignable to parameter of type 'TodoItem'`. This demonstrates TypeScript's core value: preventing type-related errors before the code is ever run.

5.  **Why is `| undefined` important in the return type?**
    This is a direct result of the `"strict": true` (specifically `"strictNullChecks": true`) setting in `tsconfig.json`. The `Array.prototype.find` method (and `Map.prototype.get`) returns the found item or `undefined` if no item matches the condition. By including `| undefined` in the return type, TypeScript forces the consumer of the `getTodoById` method to handle the case where no item is found. This prevents common runtime errors like "Cannot read property '...' of undefined" because the compiler will not allow you to access properties on a potentially `undefined` value without first checking if it exists.