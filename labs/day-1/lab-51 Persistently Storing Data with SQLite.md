# Lab: Persistently Storing Data with SQLite

**Module:** Day 2: Core TypeScript & Static Typing
**Time:** Approx. 50 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Install and use a native database driver (`better-sqlite3`) and its type definitions.
*   Use inheritance (`extends`) to create a specialized database-backed collection class.
*   Implement the constructor to handle database connection, schema creation, and initial data loading.
*   Override methods to execute SQL statements (`INSERT`, `UPDATE`, `DELETE`) for data persistence.
*   Persist the application's state to a structured SQLite database file.

### 2. Scenario

Our interactive application requires a persistent storage solution. While a simple JSON file is a good start, real-world applications often need the data integrity, structure, and performance of a true database. SQLite is a lightweight, serverless, transactional SQL database engine that is perfect for local application storage, including in VS Code extensions.

In this lab, we will replace our ephemeral, in-memory data store with one backed by an SQLite database. We will create a `SqliteTodoCollection` class that inherits from our existing `TodoCollection`. This new class will override the data modification methods to translate in-memory changes into SQL statements, ensuring that our application's state is saved robustly to a `.db` file on the disk.

### 3. Prerequisites

*   Completion of the "Lab: Implementing User Commands". The final code from that lab is the starting point for this one.
*   You must have the `vscode-ext-logic` project open in VS Code.

### 4. Steps

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Install the SQLite Driver and its Type Definitions**
    We will use `better-sqlite3`, a high-performance Node.js driver for SQLite. We also need its corresponding type definitions for TypeScript.

    From your terminal, run the following commands:
    ```bash
    npm install better-sqlite3@8.4.0
    npm install --save-dev @types/better-sqlite3@7.6.4
    ```

2.  **Prepare the Superclass for Extension**
    Our new `SqliteTodoCollection` needs to access the `itemMap` property from `TodoCollection`. We must change its visibility from `private` to `protected`.

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

3.  **Create the `SqliteTodoCollection` Subclass**
    This class will manage the database connection and the initial data load. It will create the database schema if it doesn't exist and then load all existing tasks into the in-memory `itemMap`.

    Create a new file `src/sqliteTodoCollection.ts` with the following content:
    ```typescript
    // src/sqliteTodoCollection.ts
    import { TodoItem } from "./todoItem.js";
    import { TodoCollection } from "./todoCollection.js";
    import Database from "better-sqlite3";

    export class SqliteTodoCollection extends TodoCollection {
        private database: Database.Database;

        constructor(public userName: string, todoItems: TodoItem[] = []) {
            super(userName, []);
            this.database = new Database("todos.db");

            const createTable = "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, task TEXT, complete INTEGER)";
            this.database.exec(createTable);

            const stmt = this.database.prepare("SELECT COUNT(*) as count FROM todos");
            let result = stmt.get() as { count: number };

            if (result.count === 0) {
                const insert = this.database.prepare("INSERT INTO todos (id, task, complete) VALUES (?, ?, ?)");
                const transaction = this.database.transaction((items) => {
                    for (const item of items) insert.run(item.id, item.task, item.complete ? 1 : 0);
                });
                transaction(todoItems);
                todoItems.forEach(item => this.itemMap.set(item.id, item));
            } else {
                const select = this.database.prepare("SELECT * FROM todos");
                let dbItems = select.all() as any[];
                dbItems.forEach(item => this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete === 1)));
            }
        }
    }
    ```
    *Insight:* The constructor handles all database initialization. It uses a transaction for the initial seed data, which is much more performant for multiple inserts than running them individually.

4.  **Override Methods to Execute SQL Statements**
    Now we override the data modification methods. Each override will first call the superclass's method to update the in-memory state, and then execute the corresponding SQL statement to update the database.

    Add the following overridden methods to the `SqliteTodoCollection` class in `src/sqliteTodoCollection.ts`:
    ```typescript
    // src/sqliteTodoCollection.ts
    // ...
    export class SqliteTodoCollection extends TodoCollection {
        // ... (constructor)

        addTodo(task: string): number {
            let result = super.addTodo(task);
            const stmt = this.database.prepare("INSERT INTO todos (id, task, complete) VALUES (?, ?, ?)");
            stmt.run(result, task, 0);
            return result;
        }

        markComplete(id: number, complete: boolean): void {
            super.markComplete(id, complete);
            const stmt = this.database.prepare("UPDATE todos SET complete = ? WHERE id = ?");
            stmt.run(complete ? 1 : 0, id);
        }

        removeComplete(): void {
            const idsToRemove = [...this.itemMap.values()].filter(item => item.complete).map(item => item.id);
            super.removeComplete();
            const stmt = this.database.prepare("DELETE FROM todos WHERE id = ?");
            const transaction = this.database.transaction((ids) => {
                for (const id of ids) stmt.run(id);
            });
            transaction(idsToRemove);
        }
    }
    ```
    *Insight:* SQLite does not have a native boolean type. The standard practice is to store booleans as integers (`1` for true, `0` for false), which we handle in our `UPDATE` statement.

5.  **Update the Application to Use the New Class**
    Finally, we swap our in-memory `TodoCollection` with the new `SqliteTodoCollection` in our main application file.

    Modify `src/index.ts` to use `SqliteTodoCollection`:
    ```typescript
    // src/index.ts
    import { TodoItem } from './todoItem.js';
    import { SqliteTodoCollection } from './sqliteTodoCollection.js'; // <-- CHANGE THIS
    import inquirer from 'inquirer';
    
    // ... (initial todos data)
    
    let collection: SqliteTodoCollection = new SqliteTodoCollection('Adam', todos); // <-- CHANGE THIS
    
    // ... (the rest of the file remains unchanged)
    ```

### 5. Verification
1.  **Compile and Run:** Ensure there are no compiler errors (`npx tsc`), then run the application (`node dist/index.js`).
2.  **Check for `todos.db`:** A new file named `todos.db` (and possibly `todos.db-journal`) should have been created in the root of your project.
3.  **Add a New Task:** Use the `Add New Task` command to add a task named "Check SQLite persistence".
4.  **Mark a Task Complete:** Use the `Complete Task` command to mark "Get Shoes" as complete.
5.  **Quit and Relaunch:** Use the `Quit` command. Now, run the application again (`node dist/index.js`).
6.  **Confirm Persistence:** The to-do list displayed should include your "Check SQLite persistence" task, and "Get Shoes" should still be marked as complete, confirming that the state was loaded from the database.

### 6. Discussion
You have successfully implemented a robust persistence layer using SQLite. This lab reinforced key object-oriented principles while introducing professional database practices:
*   **Polymorphism:** The core application logic in `index.ts` was able to use `SqliteTodoCollection` without any changes because it conforms to the public contract of its superclass, `TodoCollection`.
*   **Separation of Concerns:** The responsibility of database interaction is now cleanly encapsulated within `SqliteTodoCollection`, separating persistence logic from in-memory business logic.
*   **Structured Data Storage:** Unlike a free-form JSON file, SQLite uses a defined schema (`CREATE TABLE`). This enforces data integrity and provides a foundation for more complex queries, indexing, and performance optimizations.
*   **Transactional Integrity:** Using transactions for multiple database writes (like the initial seed data or removing completed items) ensures that the operations are atomic—they either all succeed or all fail, preventing the database from being left in a partially updated, inconsistent state.

This architecture is a significant step up from simple file I/O and is a far more scalable and reliable approach for managing application state.

### 7. Questions
1.  What is the purpose of the `CREATE TABLE IF NOT EXISTS` statement in the constructor? Why is `IF NOT EXISTS` important?
2.  In the `addTodo` override, we first call `super.addTodo(task)` and then run the `INSERT` statement. Why is it important to do it in this order?
3.  The `removeComplete` override is more complex than the other overrides. Why does it first collect the IDs to remove before calling `super.removeComplete()`?
4.  How could you use SQL to get only the incomplete tasks directly from the database, without loading all tasks into memory first?
5.  What are the advantages of using prepared statements (e.g., `this.database.prepare(...)`) instead of building SQL strings with template literals?

---

### 8. Solution

#### 8.1. Final Code Artifacts
**`src/todoCollection.ts`**
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

**`src/sqliteTodoCollection.ts`**
```typescript
import { TodoItem } from "./todoItem.js";
import { TodoCollection } from "./todoCollection.js";
import Database from "better-sqlite3";

export class SqliteTodoCollection extends TodoCollection {
    private database: Database.Database;

    constructor(public userName: string, todoItems: TodoItem[] = []) {
        super(userName, []);
        this.database = new Database("todos.db");

        const createTable = "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, task TEXT, complete INTEGER)";
        this.database.exec(createTable);

        const stmt = this.database.prepare("SELECT COUNT(*) as count FROM todos");
        let result = stmt.get() as { count: number };

        if (result.count === 0) {
            const insert = this.database.prepare("INSERT INTO todos (id, task, complete) VALUES (?, ?, ?)");
            const transaction = this.database.transaction((items) => {
                for (const item of items) insert.run(item.id, item.task, item.complete ? 1 : 0);
            });
            transaction(todoItems);
            todoItems.forEach(item => this.itemMap.set(item.id, item));
        } else {
            const select = this.database.prepare("SELECT * FROM todos");
            let dbItems = select.all() as any[];
            dbItems.forEach(item => this.itemMap.set(item.id, new TodoItem(item.id, item.task, item.complete === 1)));
        }
    }

    addTodo(task: string): number {
        let result = super.addTodo(task);
        const stmt = this.database.prepare("INSERT INTO todos (id, task, complete) VALUES (?, ?, ?)");
        stmt.run(result, task, 0);
        return result;
    }

    markComplete(id: number, complete: boolean): void {
        super.markComplete(id, complete);
        const stmt = this.database.prepare("UPDATE todos SET complete = ? WHERE id = ?");
        stmt.run(complete ? 1 : 0, id);
    }

    removeComplete(): void {
        const idsToRemove = [...this.itemMap.values()].filter(item => item.complete).map(item => item.id);
        super.removeComplete();
        const stmt = this.database.prepare("DELETE FROM todos WHERE id = ?");
        const transaction = this.database.transaction((ids) => {
            for (const id of ids) stmt.run(id);
        });
        transaction(idsToRemove);
    }
}
```

**`src/index.ts`**
```typescript
import { TodoItem } from './todoItem.js';
import { SqliteTodoCollection } from './sqliteTodoCollection.js';
import inquirer from 'inquirer';

let todos: TodoItem[] = [
  new TodoItem(1, 'Buy Flowers'), new TodoItem(2, 'Get Shoes'),
  new TodoItem(3, 'Collect Tickets'), new TodoItem(4, 'Call Joe', true)
];

let collection: SqliteTodoCollection = new SqliteTodoCollection('Adam', todos);
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

// ... rest of the inquirer logic from previous lab ...
function promptAdd() { /* ... */ }
function promptComplete() { /* ... */ }
function promptUser() { /* ... */ }
promptUser();
```

#### 8.2. Command Summary
```bash
npm install better-sqlite3@8.4.0
npm install --save-dev @types/better-sqlite3@7.6.4
npx tsc
node dist/index.js
```

### 9. Answers

#### 9.1. Answers to Questions
1.  **Why `CREATE TABLE IF NOT EXISTS`?**
    This SQL statement creates the `todos` table only if it doesn't already exist in the database file. The `IF NOT EXISTS` clause is crucial because it makes the constructor logic idempotent; you can run it multiple times without causing an error. On the first run, it creates the table. On all subsequent runs, it sees the table already exists and safely does nothing.

2.  **Why call `super.addTodo()` first?**
    The `super.addTodo()` method is responsible for managing the in-memory state. Specifically, it determines the `nextId` and adds the new `TodoItem` to the `itemMap`. We need to call it first to get the `id` of the newly created item, which is its return value. We then use that `id` in our `INSERT` statement to ensure the database record is perfectly synchronized with the in-memory object.

3.  **Why collect IDs before calling `super.removeComplete()`?**
    The `super.removeComplete()` method modifies the `itemMap` by deleting all completed items. We need to know which items *will be* deleted *before* they are actually gone from our in-memory collection. So, we first iterate over the current `itemMap` to get the IDs of all completed items. Then we call the superclass method to update the in-memory state. Finally, we use the list of IDs we collected to run our `DELETE` statements on the database.

4.  **How to get only incomplete tasks with SQL?**
    You would use a `WHERE` clause in your `SELECT` statement. This is a primary advantage of a real database. Instead of loading all records and filtering in JavaScript, you can ask the database to do the work efficiently. The SQL would be:
    ```sql
    SELECT * FROM todos WHERE complete = 0;
    ```

5.  **Advantages of prepared statements?**
    Using prepared statements (`db.prepare(...)`) is a professional standard for two critical reasons:
    *   **Security:** It prevents SQL injection attacks. The driver ensures that the values passed to `.run()` are treated as data, not as executable SQL code, so a user cannot enter malicious SQL (like `; DROP TABLE todos;`) as a task name.
    *   **Performance:** The database engine parses and plans the query for a prepared statement only once. Subsequent calls with different data (`.run(..., ?)`) are much faster because they reuse the pre-compiled execution plan.