# Lab: Advanced Generic Types

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

### **Introduction: Programming with Types**

Beyond basic generics, TypeScript provides a powerful set of tools for manipulating and creating types from other types. These advanced features—including index types (`keyof`), mapped types, and conditional types—allow you to write highly dynamic and reusable utility functions and types that can adapt to the shape of your data. This is the foundation of modern type-level programming in TypeScript.

---

### **Part 1: Index Types (`keyof` and Lookup Types)**

#### **Exercise 1: The `keyof` Operator**

The `keyof` operator takes an object type and produces a string or numeric literal union of its keys. This is incredibly useful for ensuring that a function parameter is a valid property name of an object.

In `src-exercise-1.ts`, create a `getProperty` function that safely accesses a property on an object. Use `keyof` to constrain the key parameter.

```typescript
// src/exercise-1.ts

const user = {
  name: 'Gabor',
  role: 'Admin',
  isActive: true,
};

// TODO: Create a generic function `getProperty<T, K extends keyof T>`.
// It should accept an object `obj` of type `T` and a `key` of type `K`.
// It should return the value of the property, which will have the type `T[K]` (a lookup type).
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  // ... your implementation
}

const userName = getProperty(user, 'name');
const userRole = getProperty(user, 'role');

console.log(`Name: ${userName}, Role: ${userRole}`);

// This call should produce a compile-time error because 'email' is not a key of the user object.
// getProperty(user, 'email');
```

---

### **Part 2: Mapped Types**

Mapped types allow you to create new types by transforming the properties of an existing type.

#### **Exercise 2: Creating a Read-Only Type**

Let's create a utility type that takes a type `T` and makes all of its properties `readonly`. This is useful for representing an immutable snapshot of an object's state.

In `src/exercise-2.ts`, implement the `Frozen<T>` mapped type.

```typescript
// src/exercise-2.ts

type MutableUser = {
  name: string;
  age: number;
};

// TODO: Create a mapped type `Frozen<T>`.
// It should iterate over all properties `P` in `keyof T`.
// It should add the `readonly` modifier to each property.
type Frozen<T> = {
  // ... your implementation
};

const john: MutableUser = { name: 'John', age: 30 };
const frozenJohn: Frozen<MutableUser> = john;

console.log('Original user can be modified:');
john.age = 31; // This is allowed.
console.log(john);

// This line should cause a compile-time error because properties on `frozenJohn` are readonly.
// frozenJohn.age = 32;
```
*Insight:* TypeScript has a built-in utility type for this: `Readonly<T>`.

#### **Exercise 3: Using the Built-in `Partial<T>` Type**

A very common use case is to create a type where all properties of an existing type are made optional. This is useful for representing an "update" object, where a user can provide only the fields they want to change. TypeScript provides the `Partial<T>` utility type for this.

In `src/exercise-3.ts`, create a function that updates a user object. It should accept a `Partial<User>` object for the updates.

```typescript
// src/exercise-3.ts

type User = {
  id: number;
  name: string;
  email: string;
};

function updateUser(user: User, updates: Partial<User>) {
  return { ...user, ...updates };
}

const user: User = { id: 1, name: 'Gabor', email: 'gabor@example.com' };

// TODO: Call `updateUser` to change only the user's email.
// The `updates` object should only contain the `email` property.
const updatedUser = {}; // Replace this

console.log(updatedUser);
```

#### **Exercise 4: Using the Built-in `Pick<T, K>` Type**

Sometimes you only need a subset of an object's properties. The `Pick<T, K>` utility type constructs a new type by picking a set of properties `K` (a union of keys) from a type `T`.

In `src/exercise-4.ts`, a function needs to log a summary of a VS Code `TextDocument`. Create a type that only includes the `fileName` and `languageId` properties.

```typescript
// src/exercise-4.ts

// A simplified version of a VS Code TextDocument
interface TextDocument {
  uri: string;
  fileName: string;
  languageId: string;
  lineCount: number;
  isDirty: boolean;
}

// TODO: Create a type alias `DocumentSummary` using `Pick`.
// It should pick only the `fileName` and `languageId` properties from `TextDocument`.
type DocumentSummary = {}; // Replace this

function logSummary(summary: DocumentSummary) {
  console.log(`File: ${summary.fileName}, Language: ${summary.languageId}`);
}

const myDocument: TextDocument = {
  uri: 'file:///src/app.ts',
  fileName: '/src/app.ts',
  languageId: 'typescript',
  lineCount: 150,
  isDirty: true,
};

// This works because `myDocument` has the required properties.
logSummary(myDocument);
```

---

### **Part 3: Conditional Types**

Conditional types allow you to create types that change based on a type-level condition. They use a ternary syntax: `T extends U ? X : Y`.

#### **Exercise 5: Creating a Simple Conditional Type**

Let's create a utility type `Unwrap<T>` that unwraps a value from a container type. If `T` is an array, it should return the type of the elements in the array; otherwise, it should just return `T`.

In `src/exercise-5.ts`, implement the `Unwrap<T>` conditional type.

```typescript
// src/exercise-5.ts

// TODO: Create a conditional type `Unwrap<T>`.
// If `T` extends an array of some inferred type `U` (`(infer U)[]`), then the type should be `U`.
// Otherwise, the type should be `T`.
type Unwrap<T> = T; // Replace this

type UnwrappedStringArray = Unwrap<string[]>; // Should be `string`
type UnwrappedNumber = Unwrap<number>;         // Should be `number`

// Dummy variables to check the types
const a: UnwrappedStringArray = 'hello';
const b: UnwrappedNumber = 123;

console.log(typeof a, typeof b);
```

#### **Exercise 6: Using the Built-in `Exclude<T, U>` Type**

Conditional types are powerful for filtering union types. `Exclude<T, U>` constructs a type by excluding from `T` all union members that are assignable to `U`.

In `src/exercise-6.ts`, you have a set of possible status values for an extension. You want to create a new type that represents only the "active" statuses, excluding `'pending'` and `'error'`.

```typescript
// src/exercise-6.ts

type ExtensionStatus = 'loading' | 'active' | 'pending' | 'error' | 'disposed';

// TODO: Create a type alias `ActiveStatus` using `Exclude`.
// It should exclude `'pending'` and `'error'` from `ExtensionStatus`.
type ActiveStatus = ''; // Replace this

const currentStatus: ActiveStatus = 'active'; // This should be valid.
// const errorStatus: Active-Status = 'error';   // This should cause a compile-time error.

console.log(`Current status: ${currentStatus}`);
```

#### **Exercise 7: Using the Built-in `ReturnType<T>` Type**

The `ReturnType<T>` utility type uses an `infer` conditional type behind the scenes to extract the return type of a function type `T`. This is extremely useful for working with functions in a generic way.

In `src/exercise-7.ts`, you have a function that creates a data provider. You want to create a variable that can hold the data returned by this provider, without manually re-typing it.

```typescript
// src/exercise-7.ts

function createDataProvider() {
  return {
    getUsers: () => Promise.resolve([{ id: 1, name: 'Gabor' }]),
    getCommands: () => ['cmd1', 'cmd2'],
  };
}

// TODO: Use `ReturnType<T>` to get the type of the object returned by `createDataProvider`.
type DataProviderType = any; // Replace this

// TODO: Now, use a lookup type to get the return type of the `getUsers` method specifically.
// The `getUsers` property on `DataProviderType` is a function type.
// You can use `ReturnType` on this property type.
type UsersPromiseType = any; // Replace this

// We can use this for a variable declaration.
let users: UsersPromiseType;

console.log('Types defined successfully.');
```

---

### **Questions**

1.  What is the difference between `keyof T` and `keyof any`?
2.  What is the purpose of the `infer` keyword in a conditional type?
3.  The built-in `Omit<T, K>` type is the opposite of `Pick<T, K>`. How could you implement your own version of `Omit` using `Pick` and `Exclude`?
4.  In a mapped type `[P in keyof T]`, what does `P` represent in each iteration?
5.  What does the built-in conditional type `NonNullable<T>` do?
6.  Could you implement a utility type `FunctionProperties<T>` that creates a new type containing only the properties of `T` that are functions?
7.  Why is `ReturnType<typeof createDataProvider>` used in the answer for Exercise 7, and not just `ReturnType<createDataProvider>`?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
const user = {
  name: 'Gabor',
  role: 'Admin',
  isActive: true,
};

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const userName = getProperty(user, 'name');
const userRole = getProperty(user, 'role');

console.log(`Name: ${userName}, Role: ${userRole}`);
```

#### **`src/exercise-2.ts`**
```typescript
type MutableUser = {
  name: string;
  age: number;
};

type Frozen<T> = {
  readonly [P in keyof T]: T[P];
};

const john: MutableUser = { name: 'John', age: 30 };
const frozenJohn: Frozen<MutableUser> = john;

console.log('Original user can be modified:');
john.age = 31;
console.log(john);

// frozenJohn.age = 32; // This correctly causes a compile-time error.
console.log('Frozen user cannot be modified.');
```

#### **`src/exercise-3.ts`**
```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const user: User = { id: 1, name: 'Gabor', email: 'gabor@example.com' };

const updatedUser = updateUser(user, { email: 'gabor.new@example.com' });

console.log(updatedUser);
```

#### **`src/exercise-4.ts`**
```typescript
interface TextDocument {
  uri: string;
  fileName: string;
  languageId: string;
  lineCount: number;
  isDirty: boolean;
}

type DocumentSummary = Pick<TextDocument, 'fileName' | 'languageId'>;

function logSummary(summary: DocumentSummary) {
  console.log(`File: ${summary.fileName}, Language: ${summary.languageId}`);
}

const myDocument: TextDocument = {
  uri: 'file:///src/app.ts',
  fileName: '/src/app.ts',
  languageId: 'typescript',
  lineCount: 150,
  isDirty: true,
};

logSummary(myDocument);
```

#### **`src/exercise-5.ts`**
```typescript
type Unwrap<T> = T extends (infer U)[] ? U : T;

type UnwrappedStringArray = Unwrap<string[]>; // string
type UnwrappedNumber = Unwrap<number>;         // number

const a: UnwrappedStringArray = 'hello';
const b: UnwrappedNumber = 123;

console.log(`Type of 'a' is string: ${typeof a === 'string'}`);
console.log(`Type of 'b' is number: ${typeof b === 'number'}`);
```

#### **`src/exercise-6.ts`**
```typescript
type ExtensionStatus = 'loading' | 'active' | 'pending' | 'error' | 'disposed';

type ActiveStatus = Exclude<ExtensionStatus, 'pending' | 'error'>;

const currentStatus: ActiveStatus = 'active';

console.log(`Current status: ${currentStatus}`);
```

#### **`src/exercise-7.ts`**
```typescript
function createDataProvider() {
  return {
    getUsers: () => Promise.resolve([{ id: 1, name: 'Gabor' }]),
    getCommands: () => ['cmd1', 'cmd2'],
  };
}

type DataProviderType = ReturnType<typeof createDataProvider>;

type UsersPromiseType = ReturnType<DataProviderType['getUsers']>;

let users: UsersPromiseType;

console.log('Types defined successfully.');
```

---

### **Answers**

1.  **`keyof T` vs. `keyof any`?**
    *   `keyof T` inspects the type `T` and returns a union of its known property keys. This is specific and type-safe.
    *   `keyof any` results in the type `string | number | symbol`. This is because an `any` value could be an object with any possible keys of those types. It is not specific and should be avoided if possible.

2.  **Purpose of the `infer` keyword?**
    The `infer` keyword is used within the `extends` clause of a conditional type. It declares a new generic type variable that TypeScript will attempt to "fill in" based on the structure of the type being checked. In Exercise 5, `T extends (infer U)[]`, we are asking TypeScript: "If `T` is an array, please figure out what the element type is and put it into the new type `U` for me to use."

3.  **How to implement `Omit`?**
    `Omit<T, K>` removes keys `K` from type `T`. You can implement it by `Pick`ing all the keys from `T` that are *not* in `K`. This requires using `Exclude` on the keys.
    ```typescript
    type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
    ```

4.  **What does `P` represent in a mapped type?**
    In `[P in keyof T]`, `P` is a type parameter that represents a single property key from the `keyof T` union in each iteration of the mapping. If `keyof T` is `'name' | 'age'`, the mapping will run once with `P` as the type `'name'` and a second time with `P` as the type `'age'`.

5.  **What does `NonNullable<T>` do?**
    `NonNullable<T>` is a built-in conditional type that constructs a new type by excluding `null` and `undefined` from the type `T`. For example, `NonNullable<string | null | undefined>` results in just `string`. It's a convenient shorthand for `Exclude<T, null | undefined>`.

6.  **How to implement `FunctionProperties<T>`?**
    You would use a mapped type with a conditional type to check if the property's type extends `Function`. If it doesn't, you can map its key to `never` and then use a lookup type to filter out the `never` keys.
    ```typescript
    type FunctionPropertyNames<T> = {
      [K in keyof T]: T[K] extends Function ? K : never;
    }[keyof T];
    type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
    ```

7.  **Why `ReturnType<typeof createDataProvider>`?**
    In TypeScript, there is a distinction between the **value** of a variable and the **type** of a variable.
    *   `createDataProvider` is a **value**—it's the function itself.
    *   `ReturnType` is a type operator that must operate on a **type**.
    The `typeof` operator in a type context bridges this gap. `typeof createDataProvider` asks TypeScript, "What is the *type* of the `createDataProvider` function value?" This gives `ReturnType` the function's type signature (`() => { getUsers: ..., getCommands: ... }`) to operate on. You cannot pass a value directly to a type operator.