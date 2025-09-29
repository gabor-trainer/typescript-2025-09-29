# Lab: Implementing User Commands

**Module:** Day 1: Foundations & JavaScript Essentials
**Time:** Approx. 45 minutes

---

### 1. Objective(s)

By the end of this lab, you will be able to:
*   Extend an `enum` to define a set of application commands.
*   Use a `switch` statement to route user input to the correct handler function.
*   Implement application logic to add new data and modify existing data based on user input.
*   Use different `inquirer` prompt types (e.g., `input`, `checkbox`) to gather varied user input.
*   Apply a type assertion (`as`) when TypeScript cannot infer a specific type from a third-party library.

### 2. Scenario

Our application is now interactive, but functionally limited. To make it a useful task manager, we need to implement the core features: filtering the view, adding new tasks, marking tasks as complete, and clearing completed tasks from the list. Each of these features will be exposed to the user as a distinct command.

In this lab, we will expand our command-line interface by implementing the full set of CRUD-like (Create, Read, Update, Delete) operations for our to-do list. This will involve creating handler functions for each command and using `inquirer` to prompt the user for any additional information needed, such as the text for a new task.

### 3. Prerequisites

*   Completion of the "Lab: Integrating a Third-Party Package". The final code from that lab is the starting point for this one.
*   You must have the `vscode-ext-logic` project open in VS Code.

### 4. Steps

_**Note:** In this section, you will be provided with only the code fragments that need to be added or modified. The complete, final code for each file is available in the "Solution" section._

1.  **Implement the "Toggle Completed" Command**
    Our first new command will allow the user to show or hide completed tasks. This involves introducing a state variable and updating the display logic.

    In `src/index.ts`, add a new state variable, a new `Commands` enum member, and the logic to handle it.
    ```typescript
    // src/index.ts
    // ... imports and initial data
    
    let collection: TodoCollection = new TodoCollection('Adam', todos);
    let showCompleted = true; // <-- ADD THIS STATE VARIABLE
    
    function displayTodoList(): void {
        console.log(`${collection.userName}'s Todo List ` +
            `(${collection.getItemCounts().incomplete} items to do)`);
        collection.getTodoItems(showCompleted).forEach((item) => item.printDetails()); // <-- USE THE VARIABLE
    }
    
    enum Commands {
        Toggle = "Show/Hide Completed", // <-- ADD THIS COMMAND
        Quit = "Quit"
    }
    
    function promptUser(): void {
        // ...
        inquirer.prompt({
            // ...
        }).then(answers => {
            switch (answers["command"]) { // <-- CHANGE to a switch statement
                case Commands.Toggle:
                    showCompleted = !showCompleted;
                    promptUser();
                    break;
            }
        })
    }
    
    // ...
    ```
    *Insight:* The `switch` statement is a much more scalable pattern for handling commands than a series of `if/else` statements.

2.  **Implement the "Add New Task" Command**
    This command requires a new handler function that uses an `input` prompt to get the task description from the user.

    In `src/index.ts`, add the new command and its handler function.
    ```typescript
    // src/index.ts
    // ...
    enum Commands {
        Add = "Add New Task", // <-- ADD THIS COMMAND
        Toggle = "Show/Hide Completed",
        Quit = "Quit"
    }
    
    function promptAdd(): void { // <-- ADD THIS ENTIRE FUNCTION
        console.clear();
        inquirer.prompt({ type: "input", name: "add", message: "Enter task:"})
            .then(answers => {
                if (answers["add"] !== "") {
                    collection.addTodo(answers["add"]);
                }
                promptUser();
            })
    }
    
    function promptUser(): void {
        // ...
        inquirer.prompt({
            // ...
        }).then(answers => {
            switch (answers["command"]) {
                case Commands.Toggle:
                    // ...
                    break;
                case Commands.Add: // <-- ADD THIS CASE
                    promptAdd();
                    break;
            }
        })
    }
    // ...
    ```

3.  **Implement the "Complete Task" Command**
    This is the most complex command. It will present a `checkbox` prompt to the user, allowing them to toggle the completion status of multiple tasks at once.

    In `src/index.ts`, add the new command and its handler. This step introduces a type assertion.
    ```typescript
    // src/index.ts
    // ...
    enum Commands {
        Add = "Add New Task",
        Complete = "Complete Task", // <-- ADD THIS COMMAND
        Toggle = "Show/Hide Completed",
        Quit = "Quit"
    }
    
    // ... (promptAdd function)
    
    function promptComplete(): void { // <-- ADD THIS ENTIRE FUNCTION
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
        // ...
        inquirer.prompt({
            // ...
        }).then(answers => {
            switch (answers["command"]) {
                // ... other cases
                case Commands.Add:
                    promptAdd();
                    break;
                case Commands.Complete: // <-- ADD THIS CASE
                    if (collection.getItemCounts().incomplete > 0) {
                        promptComplete();
                    } else {
                        promptUser();
                    }
                    break;
            }
        })
    }
    // ...
    ```
    *Insight:* The line `answers["complete"] as number[]` is a type assertion. We are telling TypeScript to trust us that this value will be an array of numbers, because the type definitions for `inquirer` cannot know the specific `value` types we provided in the `choices` array.

4.  **Implement the "Purge Completed" Command**
    The final command will remove all completed tasks from the collection.

    In `src/index.ts`, add the final command and its simple handler logic.
    ```typescript
    // src/index.ts
    // ...
    enum Commands {
        Add = "Add New Task",
        Complete = "Complete Task",
        Toggle = "Show/Hide Completed",
        Purge = "Remove Completed Tasks", // <-- ADD THIS COMMAND
        Quit = "Quit"
    }
    
    // ... (promptComplete function)
    
    function promptUser(): void {
        // ...
        inquirer.prompt({
            // ...
        }).then(answers => {
            switch (answers["command"]) {
                // ... other cases
                case Commands.Complete:
                    // ...
                    break;
                case Commands.Purge: // <-- ADD THIS CASE
                    collection.removeComplete();
                    promptUser();
                    break;
            }
        })
    }
    // ...
    ```

### 5. Verification
1.  **Compile and Run:** Ensure there are no compiler errors (`npx tsc`), then run the application (`node dist/index.js`).
2.  **Test Toggle:** Select the `Show/Hide Completed` command. The task "Call Joe" should appear and disappear from the list.
3.  **Test Add:** Select `Add New Task`, type `Test new task`, and press Enter. The new task should appear in the list with ID 5.
4.  **Test Complete:** Select `Complete Task`. Use the arrow keys and spacebar to check the "Buy Flowers" task. Press Enter. The list will now show "Buy Flowers" as complete.
5.  **Test Purge:** Select `Remove Completed Tasks`. The list will refresh, and both "Buy Flowers" and "Call Joe" will be gone.
6.  **Quit:** Select `Quit` to exit.

### 6. Discussion
You have now implemented a full command-driven application loop. This lab demonstrated a scalable pattern for adding functionality to an interactive tool:
*   **Enums for Commands:** Using an `enum` for commands provides a single source of truth, preventing typos and making the code more readable and maintainable.
*   **Command Routing:** A `switch` statement in a central `promptUser` loop is an effective way to delegate actions to dedicated handler functions (`promptAdd`, `promptComplete`), keeping the main loop clean.
*   **State Management:** The `showCompleted` boolean is a simple example of UI state. Changes to this state trigger a re-render of the display by calling `promptUser()` again.
*   **Type Assertions:** You learned that when working with dynamic libraries like `inquirer`, you sometimes need to use a type assertion (`as`) to provide the compiler with more specific type information than it can infer on its own.

This architecture is a microcosm of how many larger applications, including VS Code extensions, are structured: a main loop listens for events (user commands) and dispatches them to specific handlers that modify the application's state.

### 7. Questions
1.  Why is using a `switch` statement in `promptUser` generally a better design than using a series of `if...else if` statements?
2.  In `promptComplete`, the `choices` array is generated dynamically using `.map()`. What is the purpose of the `value` property in each choice object (e.g., `value: item.id`)?
3.  Explain the logic of this line in `promptComplete`: `completedTasks.find(id => id === item.id) != undefined`. What is it checking?
4.  What would happen at runtime if you removed the `as number[]` type assertion? Would the code still work? And what would you lose?
5.  The `promptComplete` function is only called if `collection.getItemCounts().incomplete > 0`. Why is this check important?

---

### 8. Solution

#### 8.1. Final Code Artifacts
**`src/index.ts`**
```typescript
import { TodoItem } from './todoItem.js';
import { TodoCollection } from './todoCollection.js';
import inquirer from 'inquirer';

let todos: TodoItem[] = [
  new TodoItem(1, 'Buy Flowers'), new TodoItem(2, 'Get Shoes'),
  new TodoItem(3, 'Collect Tickets'), new TodoItem(4, 'Call Joe', true)
];

let collection: TodoCollection = new TodoCollection('Adam', todos);
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
npx tsc
node dist/index.js
```

### 9. Answers

#### 9.1. Answers to Questions
1.  **Why `switch` over `if...else if`?**
    A `switch` statement is generally preferred for routing based on a single value (like a command string) because it is often more readable and expresses the intent of "dispatching" more clearly. As more commands are added, you simply add more `case` blocks. An `if...else if` chain can become long and harder to read. Furthermore, some JavaScript engines can optimize `switch` statements with many cases more effectively than an equivalent `if/else` chain.

2.  **Purpose of the `value` property in `choices`?**
    In `inquirer`, the `name` property of a choice object is what is displayed to the user (e.g., "Buy Flowers"). The `value` property is the actual data that is returned in the `answers` object when that choice is selected. By setting `value: item.id`, we ensure that when the user checks a box, we receive the task's unique numerical ID, which is a much more reliable identifier to work with than its potentially non-unique task string.

3.  **Explain the logic of the `.find()` line.**
    The line checks if a task's ID exists within the array of IDs that the user selected. `completedTasks` is the array of IDs the user checked (e.g., `[1, 3]`). For every `item` in the entire collection, we call `.find()` on the `completedTasks` array. If the `item.id` is found in `completedTasks`, `find` returns that ID (a truthy value). If it's not found, `find` returns `undefined` (a falsy value). The `!= undefined` converts this result into a clear `true` or `false`, which is then passed to `collection.markComplete`.

4.  **What if the `as number[]` assertion was removed?**
    *   **Would the code still work?** Yes, at runtime, the code would likely behave identically. The `answers["complete"]` value from `inquirer`'s checkbox prompt is, in fact, an array of the `value` properties we provided, which are numbers.
    *   **What would you lose?** You would lose compile-time type safety. Without the assertion, TypeScript would infer the type of `completedTasks` as `any[]`. This means the compiler could no longer help you. If you made a typo like `id.toStrang()` inside the `.find()` callback, the compiler wouldn't catch it. Autocompletion on the `id` variable would not work. The assertion is our way of restoring type safety by providing the compiler with knowledge it couldn't infer on its own.

5.  **Why check `collection.getItemCounts().incomplete > 0`?**
    This check provides a better user experience. If there are no incomplete tasks to be marked as complete, showing the "Mark Tasks Complete" prompt would present the user with an empty, useless list. This conditional logic prevents that by checking the state of the application first. If there are no actionable items, it simply re-prompts the user with the main menu, avoiding a confusing and unnecessary step.