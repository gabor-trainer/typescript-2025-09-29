# Lab: Working with Object Types

**Time:** Approx. 60 minutes

---

### **Setup**

These exercises use the `starter-project-multi` project.

1.  Open the `starter-project-multi` project in Visual Studio Code.
2.  If you haven't already, run `npm install`.
3.  For each exercise, create a new file in the `src` directory (e.g., `src/exercise-1.ts`).
4.  To run and verify your solution for a specific exercise, use the command:
    ```bash
    npx ts- ૨ode src/exercise-1.ts
    ```

---

### **Introduction: Describing Object Shapes**

In JavaScript, objects are flexible collections of key-value pairs. TypeScript's primary goal when working with objects is to provide a way to describe and enforce their "shape"—the combination of their property names and the types of their values. This allows us to catch errors when an object doesn't have the properties we expect. This lab explores TypeScript's powerful features for working with object shapes, including unions and intersections.

---

### **Part 1: Shape Types and Aliases**

#### **Exercise 1: Defining an Object's Shape with a Type Alias**

A `type` alias is the standard way to give a name to an object shape. This makes the shape reusable and your code more readable.

In `src/exercise-1.ts`, create a `type` alias to describe a VS Code `Configuration` object. Then, create an object that conforms to this shape.

```typescript
// src/exercise-1.ts

// TODO: Create a type alias `VSCodeConfig` for an object with these properties:
// - `editor`: an object with a `fontSize` (number) and `fontFamily` (string)
// - `terminal`: an object with an `integratedShell` (string)

type VSCodeConfig = {}; // Replace this

const myConfig: VSCodeConfig = {
  editor: {
    fontSize: 14,
    fontFamily: 'Fira Code',
  },
  terminal: {
    integratedShell: 'bash',
  },
};

console.log('My font size:', myConfig.editor.fontSize);
```

#### **Exercise 2: Optional Properties in a Shape Type**

Properties in a shape can be marked as optional with a `?`. This is useful for settings that a user might not have configured.

In `src/exercise-2.ts`, define a `Theme` type where the `colors` property is optional. Create two theme objects, one with `colors` and one without.

```typescript
// src/exercise-2.ts

// TODO: Create a type alias `Theme`. It should have:
// - `name`: a required `string`
// - `colors`: an optional object with `primary` (string) and `secondary` (string) properties.
type Theme = {}; // Replace this

const darkTheme: Theme = {
  name: 'Dark+',
  colors: {
    primary: '#FFFFFF',
    secondary: '#888888',
  },
};

const lightTheme: Theme = {
  name: 'Light+',
};

function logThemeName(theme: Theme) {
  console.log(`Theme name: ${theme.name}`);
}

logThemeName(darkTheme);
logThemeName(lightTheme);
```

---

### **Part 2: Unions of Object Types and Type Guards**

#### **Exercise 3: Creating a Union of Object Shapes**

A type union can be used to represent a value that could be one of several different object shapes. This is common when handling different kinds of events or data items from an API.

In `src/exercise-3.ts`, create types for a `FileEvent` and a `CommandEvent`. Then, create an array that can hold either type.

```typescript
// src/exercise-3.ts

type FileEvent = {
  type: 'file';
  filePath: string;
};

type CommandEvent = {
  type: 'command';
  commandId: string;
};

// TODO: Create a type alias `ExtensionEvent` that is a union of `FileEvent` and `CommandEvent`.
type ExtensionEvent = {}; // Replace this

const events: ExtensionEvent[] = [
  { type: 'file', filePath: '/src/index.ts' },
  { type: 'command', commandId: 'extension.sayHello' },
];

// This will work because `type` is a common property.
events.forEach(event => {
  console.log(`Event type: ${event.type}`);
});

```

#### **Exercise 4: Discriminating Unions with a `switch` Statement**

A **discriminating union** is a special kind of union where all member types share a common, literal-typed property (the "discriminant"). This allows TypeScript to perform powerful type narrowing inside a `switch` statement.

In `src/exercise-4.ts`, create a function that processes an `ExtensionEvent`. Use a `switch` statement on the `type` property to safely access the specific properties of each event type.

```typescript
// src/exercise-4.ts

// ... (copy the type aliases from Exercise 3)
type FileEvent = { type: 'file'; filePath: string; };
type CommandEvent = { type: 'command'; commandId: string; };
type ExtensionEvent = FileEvent | CommandEvent;

function processEvent(event: ExtensionEvent) {
  // TODO: Use a `switch` statement on `event.type`.
  // In the 'file' case, log the `filePath`.
  // In the 'command' case, log the `commandId`.
  // TypeScript will correctly narrow the type in each case block.
}

processEvent({ type: 'file', filePath: '/src/app.ts' });
processEvent({ type: 'command', commandId: 'extension.runTests' });
```

#### **Exercise 5: Type Guarding with the `in` Operator**

When you don't have a discriminant property, you can use the `in` operator to check for the existence of a property on an object. This also acts as a type guard.

In `src/exercise-5.ts`, you have two unrelated types. Write a function that uses the `in` operator to determine which type of object it has received.

```typescript
// src/exercise-5.ts

type FileInfo = {
  path: string;
  size: number;
};

type FolderInfo = {
  path: string;
  childCount: number;
};

function logItemInfo(item: FileInfo | FolderInfo) {
  // TODO: Use the `in` operator to check if `childCount` exists in `item`.
  // If it does, log it as a folder.
  // Otherwise, log it as a file.
}

logItemInfo({ path: '/a.txt', size: 1024 });
logItemInfo({ path: '/src', childCount: 5 });
```

---

### **Part 3: Type Intersections**

A type intersection (`&`) combines multiple types into one. The new type has all the properties of all the combined types.

#### **Exercise 6: Creating a Type Intersection**

Imagine you want to create a type for an "active editor" that has both information about the text document and the view column it's in.

In `src/exercise-6.ts`, create a `TextDocument` type and a `ViewColumn` type. Then, create an `ActiveEditor` type by intersecting them.

```typescript
// src/exercise-6.ts

type TextDocument = {
  uri: string;
  languageId: string;
};

type ViewColumn = {
  column: number;
  isActive: boolean;
};

// TODO: Create a type alias `ActiveEditor` that is an intersection of `TextDocument` and `ViewColumn`.
type ActiveEditor = {}; // Replace this

const activeEditor: ActiveEditor = {
  uri: 'file:///src/index.ts',
  languageId: 'typescript',
  column: 1,
  isActive: true,
};

// TODO: Log a message that uses properties from BOTH original types.
// e.g., "The active editor in column 1 is a typescript file."
```

#### **Exercise 7: Using Intersections to Add Behavior**

Intersections are powerful for "mixing in" functionality. Let's define a shape for any object that can be logged, and intersect it with a data object.

In `src/exercise-7.ts`, create a `Loggable` type with a `log()` method. Then create a `SerializableUser` type that is an intersection of a `User` type and `Loggable`.

```typescript
// src/exercise-7.ts

type User = {
  id: number;
  name: string;
};

type Loggable = {
  log(message: string): void;
};

// TODO: Create a type alias `SerializableUser` that is an intersection of `User` and `Loggable`.
type SerializableUser = {}; // Replace this

const user: SerializableUser = {
  id: 1,
  name: 'Gabor',
  log(message: string) {
    console.log(`[User ${this.id}]: ${message}`);
  },
};

user.log('User created successfully.');
```

---

### **Questions**

1.  What is the difference in purpose between a `type` alias and an `interface` for defining object shapes?
2.  In a discriminating union (Exercise 4), why is it important that the discriminant property (e.g., `type`) has a literal type (`'file'`) rather than just `string`?
3.  When would you choose to use the `in` operator for a type guard versus a `switch` on a discriminant property?
4.  What happens if you create an intersection of two types that both have a property with the same name but different types (e.g., `id: string` and `id: number`)?
5.  How does a type union (`A | B`) differ from a type intersection (`A & B`) in terms of the properties available on the resulting type?
6.  Could you create an object that satisfies the `ActiveEditor` type (Exercise 6) by using the spread operator on a `TextDocument` and a `ViewColumn` object?
7.  In Exercise 7, `this.id` is used inside the `log` method. Does this behave as expected? Why?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
type VSCodeConfig = {
  editor: {
    fontSize: number;
    fontFamily: string;
  };
  terminal: {
    integratedShell: string;
  };
};

const myConfig: VSCodeConfig = {
  editor: {
    fontSize: 14,
    fontFamily: 'Fira Code',
  },
  terminal: {
    integratedShell: 'bash',
  },
};

console.log('My font size:', myConfig.editor.fontSize);
```

#### **`src/exercise-2.ts`**

```typescript
type Theme = {
  name: string;
  colors?: {
    primary: string;
    secondary: string;
  };
};

const darkTheme: Theme = {
  name: 'Dark+',
  colors: {
    primary: '#FFFFFF',
    secondary: '#888888',
  },
};

const lightTheme: Theme = {
  name: 'Light+',
};

function logThemeName(theme: Theme) {
  console.log(`Theme name: ${theme.name}`);
}

logThemeName(darkTheme);
logThemeName(lightTheme);
```

#### **`src/exercise-3.ts`**
```typescript
type FileEvent = {
  type: 'file';
  filePath: string;
};

type CommandEvent = {
  type: 'command';
  commandId: string;
};

type ExtensionEvent = FileEvent | CommandEvent;

const events: ExtensionEvent[] = [
  { type: 'file', filePath: '/src/index.ts' },
  { type: 'command', commandId: 'extension.sayHello' },
];

events.forEach(event => {
  console.log(`Event type: ${event.type}`);
});
```

#### **`src/exercise-4.ts`**
```typescript
type FileEvent = { type: 'file'; filePath: string; };
type CommandEvent = { type: 'command'; commandId: string; };
type ExtensionEvent = FileEvent | CommandEvent;

function processEvent(event: ExtensionEvent) {
  switch (event.type) {
    case 'file':
      console.log(`File event for path: ${event.filePath}`);
      break;
    case 'command':
      console.log(`Command event for ID: ${event.commandId}`);
      break;
  }
}

processEvent({ type: 'file', filePath: '/src/app.ts' });
processEvent({ type: 'command', commandId: 'extension.runTests' });
```

#### **`src/exercise-5.ts`**
```typescript
type FileInfo = {
  path: string;
  size: number;
};

type FolderInfo = {
  path: string;
  childCount: number;
};

function logItemInfo(item: FileInfo | FolderInfo) {
  if ('childCount' in item) {
    console.log(`Folder: ${item.path} has ${item.childCount} children.`);
  } else {
    console.log(`File: ${item.path} is ${item.size} bytes.`);
  }
}

logItemInfo({ path: '/a.txt', size: 1024 });
logItemInfo({ path: '/src', childCount: 5 });
```

#### **`src/exercise-6.ts`**
```typescript
type TextDocument = {
  uri: string;
  languageId: string;
};

type ViewColumn = {
  column: number;
  isActive: boolean;
};

type ActiveEditor = TextDocument & ViewColumn;

const activeEditor: ActiveEditor = {
  uri: 'file:///src/index.ts',
  languageId: 'typescript',
  column: 1,
  isActive: true,
};

console.log(`The active editor in column ${activeEditor.column} is a ${activeEditor.languageId} file.`);
```

#### **`src/exercise-7.ts`**
```typescript
type User = {
  id: number;
  name: string;
};

type Loggable = {
  log(message: string): void;
};

type SerializableUser = User & Loggable;

const user: SerializableUser = {
  id: 1,
  name: 'Gabor',
  log(message: string) {
    console.log(`[User ${this.id}]: ${message}`);
  },
};

user.log('User created successfully.');
```

---

### **Answers**

1.  **`type` vs. `interface`?**
    For defining object shapes, they are often interchangeable. The key differences are:
    *   An `interface` can be "re-opened" and added to by multiple declarations, a feature known as "declaration merging." A `type` alias cannot.
    *   A `type` alias is more versatile and can be used to name any type, including primitives, unions, tuples, etc. (e.g., `type MyString = string;`). An `interface` can only describe an object shape.
    The professional standard is to use `interface` for public-facing API contracts (like shapes for classes) and `type` for all other scenarios.

2.  **Why is a literal type important for a discriminant?**
    If the discriminant property (`type`) was just `string`, TypeScript wouldn't know the specific possible values. The check `case 'file':` would only tell the compiler that `event.type` is a `string`, but it wouldn't know that *only* `FileEvent` has that specific string value. By using a literal type (`type: 'file'`), TypeScript knows that if `event.type` is equal to `'file'`, then the `event` object *must* be of type `FileEvent`, allowing it to safely narrow the type.

3.  **`in` operator vs. `switch` on a discriminant?**
    You should prefer a `switch` on a discriminant property whenever your types are designed to support it. It is generally safer, more explicit, and TypeScript can check for exhaustiveness (i.e., did you handle all possible cases?). You would use the `in` operator as a fallback when the object shapes you are working with do not share a common discriminant property, and you have to rely on checking for the existence of unique properties instead.

4.  **What happens with intersecting properties of different types?**
    The resulting property type becomes `never`. For example, `( { id: string } & { id: number } )` results in a type `{ id: never }`. It is impossible to create a value that is both a `string` and a `number` at the same time, so the type becomes uninhabitable. This will usually lead to a compile-time error when you try to create an object of that intersected type.

5.  **Union (`|`) vs. Intersection (`&`)?**
    *   A **union** (`A | B`) creates a type that can be *either* A *or* B. You can only access properties that are **common to both** A and B.
    *   An **intersection** (`A & B`) creates a type that is *both* A *and* B. You can access the properties of **both** A and B. The resulting type has all properties from all intersected types.

6.  **Could you create `ActiveEditor` with the spread operator?**
    Yes, absolutely. This is a very common and practical use case for both intersections and the spread operator.
    ```typescript
    const doc: TextDocument = { uri: '...', languageId: '...' };
    const view: ViewColumn = { column: 1, isActive: true };
    const activeEditor: ActiveEditor = { ...doc, ...view };
    ```

7.  **Does `this.id` work in Exercise 7?**
    Yes, it behaves as expected. The `log` method is a regular function defined on the object literal. When it is called as `user.log(...)`, the object to the left of the dot (`user`) becomes the `this` context for the duration of the call, so `this.id` correctly resolves to `1`.