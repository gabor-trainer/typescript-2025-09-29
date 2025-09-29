# Lab: Persistently Storing Data

**Module:** Day 2: Core TypeScript & Static Typing
**Time:** Approx. 45 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Install and use a third-party package (`lowdb`) that includes its own TypeScript type definitions.
*   Use inheritance (`extends`) to create a specialized subclass that adds new functionality.
*   Override methods to augment the behavior of a superclass.
*   Make a class property `protected` to allow access from subclasses.
*   Persist the application's state to the file system as a JSON file.

### 2. Scenario

Our interactive to-do application is now functionally complete, but it has a critical flaw: all data is ephemeral. Every time the application is closed and reopened, all user changes are lost, and the application reverts to its initial hard-coded state. To be useful, the application must be able to save its state and load it again on subsequent runs.

In this lab, we will implement persistence by storing the to-do list in a local JSON file. We will use `lowdb`, a lightweight JSON file database, to handle the file I/O. We will create a `JsonTodoCollection` class that inherits from our existing `TodoCollection` and overrides key methods to ensure that any change to the data is immediately written to the disk.

### 3. Prerequisites

*   Completion of the "Lab: Implementing User Commands". The final code from that lab is the starting point for this one.
*   You must have the `vscode-ext-logic` project open in VS Code.

### 4. Steps

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Install the `lowdb` Package**
    `lowdb` is a simple JSON file database. A key feature of this modern package is that it ships with its own TypeScript type definitions, so we do not need to install a separate `@types` package.

    From your terminal, install `lowdb`:
    ```bash
    npm install lowdb@5.1.0
    ```

2.  **Prepare the Superclass for Extension**
    Our new `JsonTodoCollection` needs to access the `itemMap` property from its parent, `TodoCollection`. Currently, `itemMap` is `private`, which restricts access to the `TodoCollection` class itself. We must change it to `protected` to allow access from subclasses.

    In `src/todoCollection.ts`, modify the access modifier for `itemMap`:
    ```typescript
    // src/todoCollection.ts
    // ...
    export class TodoCollection {
        private nextId: number = 1;
        protected itemMap = new Map<number, TodoItem>(); // <-- CHANGE `private` to `protected`
        // ...
    }
    ```

3.  **Create the `JsonTodoCollection` Subclass**
    This new class will contain all the logic for loading from and saving to a JSON file. It will `extend` our existing `TodoCollection` to inherit all the in-memory data management logic.

    Create a new file `src/jsonTodoCollection.ts` with the following content:
    ```typescript
    // src/jsonTodoCollection.ts
    import { TodoItem } from "./todoItem.js";
    import { TodoCollection } from "./todoCollection.js";
    import { LowSync } from "lowdb";
    import { JSONFileSync } from "lowdb/node";
    
    type schemaType = {
        tasks: { id: number; task: string; complete: boolean; }[]
    };
    
    export class JsonTodoCollection extends TodoCollection {
        private database: LowSync<schemaType>;
    
        constructor(public userName: string, todoItems: TodoItem[] = []) {
            super(userName, []);
            this.database = new LowSync(new JSONFileSync("Todos.json"));
            this.database.read();
    
            if (this.database.data == null) {
                this.database.data = { tasks : todoItems };
                this.database.write();
                todoItems.forEach(item => this.itemMap.set(item.id, item));
            } else {
                this.database.data.tasks.forEach(item => 
                    this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete))
                );
            }
        }
    
        private storeTasks() {
            this.database.data.tasks = [...this.itemMap.values()];
            this.database.write();
        }
    }
    ```
    *Insight:* The constructor logic is key here. It either initializes the JSON file with the seed data (if the file doesn't exist) or loads the existing data from the file into the `itemMap` inherited from the superclass.

4.  **Override Methods to Trigger Persistence**
    To ensure data is saved, we must override the methods in the superclass that modify the collection. In each override, we will first call the superclass's implementation using `super` and then call our new `storeTasks` method.

    Add the following overridden methods to the `JsonTodoCollection` class in `src/jsonTodoCollection.ts`:
    ```typescript
    // src/jsonTodoCollection.ts
    // ...
    export class JsonTodoCollection extends TodoCollection {
        // ... (constructor and storeTasks)
    
        addTodo(task: string): number { // <-- ADD THIS OVERRIDE
            let result = super.addTodo(task);
            this.storeTasks();
            return result;
        }
    
        markComplete(id: number, complete: boolean): void { // <-- ADD THIS OVERRIDE
            super.markComplete(id, complete);
            this.storeTasks();
        }
    
        removeComplete(): void { // <-- ADD THIS OVERRIDE
            super.removeComplete();
            this.storeTasks();
        }
    }
    ```
    *Insight:* This `super.method()` pattern is a powerful way to extend functionality without duplicating logic. We are "decorating" the original methods with our new persistence behavior.

5.  **Update the Application to Use the New Class**
    The final step is to swap out our in-memory `TodoCollection` with our new persistent `JsonTodoCollection` in the main application file. Because `JsonTodoCollection` is a subclass of `TodoCollection`, the rest of the application logic can remain unchanged.

    Modify `src/index.ts` to use `JsonTodoCollection`:
    ```typescript
    // src/index.ts
    import { TodoItem } from './todoItem.js';
    // import { TodoCollection } from './todoCollection.js'; // <-- REMOVE THIS
    import { JsonTodoCollection } from './jsonTodoCollection.js'; // <-- ADD THIS
    import inquirer from 'inquirer';
    
    let todos: TodoItem[] = [
      // ... (initial todos data)
    ];
    
    // The type `TodoCollection` is still valid due to inheritance, but we instantiate the subclass.
    let collection: JsonTodoCollection = new JsonTodoCollection('Adam', todos);
    
    // ... (the rest of the file remains unchanged)
    ```

### 5. Verification
1.  **Compile and Run:** Ensure there are no compiler errors (`npx tsc`), then run the application (`node dist/index.js`).
2.  **Check for `Todos.json`:** A new file named `Todos.json` should have been created in the root of your project directory. Its content should reflect the initial seed data.
3.  **Add a New Task:** Use the `Add New Task` command to add a task named "Check persistence".
4.  **Verify File Update:** Open `Todos.json`. You should see the new task has been added to the `tasks` array.
5.  **Quit and Relaunch:** Use the `Quit` command. Now, run the application again (`node dist/index.js`).
6.  **Confirm Persistence:** The to-do list displayed should include your "Check persistence" task, confirming that the application successfully loaded its state from the JSON file.

### 6. Discussion
You have successfully implemented a persistence layer for the application. This lab demonstrated key object-oriented and integration concepts:
*   **Inheritance (`extends`):** We created a specialized class that inherited a rich set of features from a more general superclass. This is a primary mechanism for code reuse in object-oriented programming.
*   **Method Overriding:** We augmented the behavior of the superclass by overriding methods. The use of `super` allowed us to execute the original logic before adding our new persistence logic, avoiding code duplication.
*   **Access Modifiers (`protected`):** You saw how changing a property from `private` to `protected` is a deliberate architectural decision to open up a class for extension by its subclasses.
*   **Integrated Type Definitions:** The `lowdb` package provided its own types, simplifying the integration process. As TypeScript has become the standard, more packages are adopting this "batteries-included" approach, which is a significant developer experience improvement.

This architecture effectively separates concerns: the `TodoCollection` class is responsible for in-memory data logic, while the `JsonTodoCollection` subclass is responsible for persistence.

### 7. Questions
1.  What is the key difference between the `private` and `protected` access modifiers? Why was the change necessary for `itemMap`?
2.  In the `JsonTodoCollection` constructor, what does the `super(userName, []);` call do? Why is an empty array `[]` passed?
3.  How does TypeScript know the type of the `database` property and its `data` member (e.g., `this.database.data.tasks`)?
4.  If you added a new data-modifying method to `TodoCollection` (e.g., `renameTask(id: number, newTask: string)`), what would you need to do in `JsonTodoCollection` to ensure it was also persistent?
5.  What are the potential drawbacks of using a single JSON file for data storage in a large, multi-user, or high-performance application compared to a traditional database?

---

### 8. Solution

#### 8.1. Final Code Artifacts
**`src/todoCollection.ts`** (Note the `protected` keyword)
```typescript
import { TodoItem } from "./todoItem.js";

type ItemCounts = {
    total: number,
    incomplete: number
}

export class TodoCollection {
    private nextId: number = 1;
    protected itemMap = new Map<number, TodoItem>();

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

**`src/jsonTodoCollection.ts`**
```typescript
import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

type schemaType = {
    tasks: { id: number; task: string; complete: boolean; }[]
};

export class JsonTodoCollection extends TodoCollection {
    private database: LowSync<schemaType>;

    constructor(public userName: string, todoItems: TodoItem[] = []) {
        super(userName, []);
        this.database = new LowSync(new JSONFileSync("Todos.json"));
        this.database.read();

        if (this.database.data == null) {
            this.database.data = { tasks : todoItems };
            this.database.write();
            todoItems.forEach(item => this.itemMap.set(item.id, item));
        } else {
            this.database.data.tasks.forEach(item => 
                this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete))
            );
        }
    }

    addTodo(task: string): number {
        let result = super.addTodo(task);
        this.storeTasks();
        return result;
    }

    markComplete(id: number, complete: boolean): void {
        super.markComplete(id, complete);
        this.storeTasks();
    }

    removeComplete(): void {
        super.removeComplete();
        this.storeTasks();
    }

    private storeTasks() {
        this.database.data.tasks = [...this.itemMap.values()];
        this.database.write();
    }
}
```

**`src/index.ts`**
```typescript
import { TodoItem } from './todoItem.js';
import { JsonTodoCollection } from './jsonTodoCollection.js';
import inquirer from 'inquirer';

let todos: TodoItem[] = [
  new TodoItem(1, 'Buy Flowers'), new TodoItem(2, 'Get Shoes'),
  new TodoItem(3, 'Collect Tickets'), new TodoItem(4, 'Call Joe', true)
];

let collection: JsonTodoCollection = new JsonTodoCollection('Adam', todos);
let showCompleted = true;

function displayTodoList(): void {
    console.log(`${collection.userName}'s Todo List ` +
        `(${collection.getItemCounts().incomplete} items to do)`);
    collection.getTodoItems(showCompleted).forEach((item) => item.printDetails());
}

enum Commands {
    Add = "Add New Task",
    Complete = "Complete Task",
    Toggle = "Show/Hide Completed",
    Purge = "Remove Completed Tasks",
    Quit = "Quit"
}

function promptAdd(): void {
    console.clear();
    inquirer.prompt({ type: "input", name: "add", message: "Enter task:"})
        .then(answers => {
            if (answers["add"] !== "") {
                collection.addTodo(answers["add"]);
            }
            promptUser();
        })
}

function promptComplete(): void {
    console.clear();
    inquirer.prompt({ 
        type: "checkbox", 
        name: "complete", 
        message: "Mark Tasks Complete",
        choices: collection.getTodoItems(showCompleted).map(item => ({
            name: item.task, value: item.id, checked: item.complete
        }))
    }).then(answers => {
        let completedTasks = answers["complete"] as number[];
        collection.getTodoItems(true).forEach(item => 
            collection.markComplete(
                item.id, 
                completedTasks.find(id => id === item.id) != undefined
            ));
        promptUser();
    })
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands)
    }).then(answers => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete();
                } else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    })
}

promptUser();
```

#### 8.2. Command Summary
```bash
npm install lowdb@5.1.0
npx tsc
node dist/index.js
```

### 9. Answers

#### 9.1. Answers to Questions
1.  **`private` vs. `protected`?**
    *   **`private`** restricts access to a property or method strictly to the class in which it is defined. No outside class, not even a subclass, can access it.
    *   **`protected`** restricts access to the defining class *and* any subclasses that extend it.
    This change was necessary because `JsonTodoCollection` needed to directly manipulate the `itemMap` to populate it with data loaded from the JSON file. If `itemMap` had remained `private`, this would have resulted in a compile-time error.

2.  **What does `super(userName, []);` do?**
    This line calls the constructor of the superclass (`TodoCollection`). In any subclass constructor, you must call `super()` before you can access `this`. We pass `userName` up to the parent, but we pass an empty array `[]` for the `todoItems`. This is because we don't want the superclass to perform its default in-memory initialization. The `JsonTodoCollection` has its own, more complex initialization logic: it will either load items from the database or, if the database is empty, initialize it with the seed data. Passing an empty array prevents the superclass from unnecessarily populating the `itemMap` before we've had a chance to check the database.

3.  **How does TypeScript know the type of `this.database.data.tasks`?**
    This is due to the power of generics. When we created the `lowdb` instance, we provided a generic type argument: `private database: LowSync<schemaType>;`. The `schemaType` is a type alias we defined as `{ tasks: { id: number; task: string; complete: boolean; }[] }`. The `lowdb` library is written in TypeScript, so its `LowSync` class uses this generic `schemaType` to strongly type its internal `data` property. This allows TypeScript to provide full type checking and autocompletion for `this.database.data.tasks`.

4.  **What if you added a new `renameTask` method?**
    If you added a `renameTask` method to `TodoCollection` that modified the `itemMap`, it would work correctly for the in-memory collection. However, the change would *not* be saved to the JSON file. To ensure persistence, you would have to override the `renameTask` method in `JsonTodoCollection`, call the superclass's implementation, and then call `this.storeTasks()`, just as we did for `addTodo`, `markComplete`, and `removeComplete`.

5.  **Drawbacks of using a single JSON file?**
    While simple and effective for small, single-user applications, this approach has significant drawbacks at scale:
    *   **Race Conditions:** If multiple processes or users tried to write to the file at the same time, the file could become corrupted. There is no built-in locking mechanism.
    *   **Performance:** The entire database (the whole JSON file) must be read into memory on startup and completely rewritten to disk on every single change. For a large dataset, this is extremely inefficient and slow.
    *   **Scalability:** It doesn't scale. A traditional database uses indexing, query languages, and transaction management to handle large datasets and high concurrency efficiently, none of which are available here.