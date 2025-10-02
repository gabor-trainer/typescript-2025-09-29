# Lab: Using Generic Types

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

### **Introduction: Writing Reusable, Type-Safe Code**

Often, we need to write a class or function that performs the same logic on different types of data. Without generics, our options are limited: we could duplicate code for each type (which is not maintainable) or use `any` (which sacrifices type safety). **Generic types** solve this problem by allowing us to write a class or function that can work over a variety of types, rather than a single one, while preserving type safety. They are placeholders for types that are specified when the code is used.

---

### **Part 1: The Problem and The Generic Solution**

#### **Exercise 1: The Problem - A Type-Specific Cache**

Imagine our extension needs to cache different types of items, like user information and workspace settings. Without generics, we'd start by writing a specific cache for one type.

In `src/exercise-1.ts`, create a `UserCache` class that is hard-coded to work only with `User` objects.

```typescript
// src/exercise-1.ts

type User = { id: number, name: string };

// TODO: Create a class `UserCache`.
// 1. It should have a private property `data` of type `Map<number, User>`.
// 2. Its `constructor` should initialize the `data` map.
// 3. It should have a method `add(user: User)` that adds a user to the map, using `user.id` as the key.
// 4. It should have a method `get(id: number): User | undefined` that retrieves a user.
class UserCache {
  // ... your implementation
}

const userCache = new UserCache();
userCache.add({ id: 1, name: 'Gabor' });
const user = userCache.get(1);
console.log(`Found user: ${user?.name}`);
```
*Insight:* This works perfectly, but if we now need a `SettingsCache`, we would have to duplicate this entire class, which is not a scalable solution.

#### **Exercise 2: The Solution - A Generic Cache Class**

Let's convert the `UserCache` into a generic `ItemCache` that can work with any type of item. We will use a generic type parameter, conventionally named `T`, as a placeholder for the item type.

In `src/exercise-2.ts`, refactor the `UserCache` into a generic `ItemCache<T>`.

```typescript
// src/exercise-2.ts

type User = { id: number, name: string };
type Setting = { key: string, value: any };

// TODO: Create a generic class `ItemCache<T>`.
// `T` will be the placeholder for the type of item in the cache.
// 1. It should have a private property `data` of type `Map<any, T>`.
// 2. Its `constructor` should initialize the map.
// 3. It should have a method `add(item: T, key: any)` that adds an item to the map.
// 4. It should have a method `get(key: any): T | undefined` that retrieves an item.
class ItemCache<T> {
  // ... your implementation
}

// Instantiate the generic cache for `User` objects.
const userCache = new ItemCache<User>();
userCache.add({ id: 1, name: 'Gabor' }, 1);
console.log(`Found user: ${userCache.get(1)?.name}`);

// TODO: Instantiate the same generic cache for `Setting` objects.
// Add a setting and then retrieve and log its value.
```

---

### **Part 2: Constraining Generic Types**

#### **Exercise 3: Constraining a Generic Type Parameter**

Our `ItemCache` in the previous exercise is a bit unsafe because the `key` is `any`. A better design would be to ensure that any item added to the cache has an `id` property that we can use as the key. We can enforce this with a generic constraint using the `extends` keyword.

In `src/exercise-3.ts`, refactor `ItemCache` to only accept types that have an `id` property of type `string | number`.

```typescript
// src/exercise-3.ts

type User = { id: number, name: string };
type Product = { id: string, price: number };
type Configuration = { theme: string }; // This type does NOT have an `id`

// TODO: Define a shape that our generic type must conform to.
// e.g., type WithId = { id: string | number };
// Then, create a generic class `ItemCache<T extends WithId>`.
// 1. The `data` property should now be `Map<string | number, T>`.
// 2. The `add` method should only take one argument, `item: T`, and use `item.id` as the key.
// 3. The `get` method should accept an `id` of type `string | number`.
class ItemCache<T extends { id: string | number }> {
  // ... your implementation
}

const userCache = new ItemCache<User>();
userCache.add({ id: 1, name: 'Gabor' });

const productCache = new ItemCache<Product>();
productCache.add({ id: 'abc-123', price: 99.99 });

// The following line should now cause a compile-time error
// because `Configuration` does not have an `id` property.
// const configCache = new ItemCache<Configuration>();
```

---

### **Part 3: Generic Functions and Interfaces**

#### **Exercise 4: Creating a Generic Function**

Functions can also be generic. This is useful for creating utility functions that operate on values of different types while preserving the relationship between the input and output types.

In `src/exercise-4.ts`, create a generic function `wrapInArray` that takes a single argument of any type and returns an array of that same type.

```typescript
// src/exercise-4.ts

// TODO: Create a generic function `wrapInArray<T>`.
// It should accept one argument `item` of type `T`.
// It should return an array of type `T[]`.

const stringArray = wrapInArray('hello'); // Type of stringArray should be string[]
const numberArray = wrapInArray(123);     // Type of numberArray should be number[]

console.log(stringArray);
console.log(numberArray);
```

*Insight:* TypeScript's type inference is powerful here. You don't need to write `wrapInArray<string>('hello')`; the compiler infers `T` from the argument.

#### **Exercise 5: Creating a Generic Interface**

An `interface` can be generic. This is the standard professional pattern for defining a contract for a generic data structure or service.

In `src/exercise-5.ts`, define a generic `ICache<T>` interface.

```typescript
// src/exercise-5.ts

type WithId = { id: string | number };

// TODO: Create a generic interface `ICache<T extends WithId>`.
// It should define the contract for our cache:
// - `add(item: T): void`
// - `get(id: string | number): T | undefined`
// - `has(id: string | number): boolean`
interface ICache<T extends WithId> {
  // ...
}

// We will implement this in the next exercise.
```

#### **Exercise 6: Implementing a Generic Interface**

A class can `implement` a generic interface. The class must either be generic itself (passing the type parameter through) or fix the generic type to a specific type.

In `src/exercise-6.ts`, create a `MemoryCache<T>` class that implements the `ICache<T>` interface from the previous exercise.

```typescript
// src/exercise-6.ts

type WithId = { id: string | number };
interface ICache<T extends WithId> {
  add(item: T): void;
  get(id: string | number): T | undefined;
  has(id: string | number): boolean;
}

// TODO: Create a generic class `MemoryCache<T extends WithId>` that implements `ICache<T>`.
// Use a `Map` internally to store the data.
class MemoryCache<T extends WithId> implements ICache<T> {
  // ... your implementation for add, get, and has
}

type User = { id: number, name: string };
const userCache: ICache<User> = new MemoryCache<User>();
userCache.add({ id: 1, name: 'Gabor' });
console.log(`Has user 1: ${userCache.has(1)}`);
```

#### **Exercise 7: Extending a Generic Class**

A class can `extend` another generic class. The subclass can either remain generic or fix the generic type parameter.

In `src/exercise-7.ts`, create a `PersistentMemoryCache` that extends `MemoryCache`. This subclass will remain generic but will override the `add` method to add logging.

```typescript
// src/exercise-7.ts

// ... (copy the MemoryCache class and its dependencies from Exercise 6)
class MemoryCache<T extends { id: string | number }> {
    // ...
}

// TODO: Create a class `PersistentMemoryCache<T extends { id: string | number }>`
// that extends `MemoryCache<T>`.
// 1. Its constructor should call `super()`.
// 2. It should override the `add` method.
// 3. Inside the new `add` method, it should first log a message like "Persisting item...".
// 4. Then, it should call the parent class's `add` method using `super.add(item)`.
class PersistentMemoryCache<T extends { id: string | number }> extends MemoryCache<T> {
    // ... your implementation
}

type User = { id: number, name: string };
const persistentCache = new PersistentMemoryCache<User>();
persistentCache.add({ id: 1, name: 'Gabor' });
```

---

### **Questions**

1.  What is the primary problem that generic types solve?
2.  In a generic class `MyClass<T>`, what is the difference between the "type parameter" and the "type argument"?
3.  What is the purpose of a generic constraint (e.g., `T extends { id: string }`)?
4.  In Exercise 4, why is it unnecessary to call `wrapInArray<string>('hello')`? What is this TypeScript feature called?
5.  What is the difference between a generic class that implements a generic interface (`class MyCache<T> implements ICache<T>`) versus a non-generic class that implements it (`class UserCache implements ICache<User>`)?
6.  Can a static method in a generic class use the class's generic type parameter `T`? Why or why not?
7.  If you have a generic function `function process<T>(arg: T)`, what is the type of `T` inside the function if you don't provide a constraint?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
type User = { id: number, name: string };

class UserCache {
  private data = new Map<number, User>();

  add(user: User): void {
    this.data.set(user.id, user);
  }

  get(id: number): User | undefined {
    return this.data.get(id);
  }
}

const userCache = new UserCache();
userCache.add({ id: 1, name: 'Gabor' });
const user = userCache.get(1);
console.log(`Found user: ${user?.name}`);
```

#### **`src/exercise-2.ts`**
```typescript
type User = { id: number, name: string };
type Setting = { key: string, value: any };

class ItemCache<T> {
  private data = new Map<any, T>();

  add(item: T, key: any): void {
    this.data.set(key, item);
  }

  get(key: any): T | undefined {
    return this.data.get(key);
  }
}

const userCache = new ItemCache<User>();
userCache.add({ id: 1, name: 'Gabor' }, 1);
console.log(`Found user: ${userCache.get(1)?.name}`);

const settingCache = new ItemCache<Setting>();
const themeSetting = { key: 'theme', value: 'dark' };
settingCache.add(themeSetting, themeSetting.key);
console.log(`Found setting value: ${settingCache.get('theme')?.value}`);
```

#### **`src/exercise-3.ts`**
```typescript
type User = { id: number, name: string };
type Product = { id: string, price: number };
type Configuration = { theme: string };

type WithId = { id: string | number };

class ItemCache<T extends WithId> {
  private data = new Map<string | number, T>();

  add(item: T): void {
    this.data.set(item.id, item);
  }

  get(id: string | number): T | undefined {
    return this.data.get(id);
  }
}

const userCache = new ItemCache<User>();
userCache.add({ id: 1, name: 'Gabor' });

const productCache = new ItemCache<Product>();
productCache.add({ id: 'abc-123', price: 99.99 });
```

#### **`src/exercise-4.ts`**
```typescript
function wrapInArray<T>(item: T): T[] {
  return [item];
}

const stringArray = wrapInArray('hello');
const numberArray = wrapInArray(123);

console.log(stringArray);
console.log(numberArray);
```

#### **`src/exercise-5.ts`**

```typescript
type WithId = { id: string | number };

interface ICache<T extends WithId> {
  add(item: T): void;
  get(id: string | number): T | undefined;
  has(id: string | number): boolean;
}
```

#### **`src/exercise-6.ts`**
```typescript
type WithId = { id: string | number };
interface ICache<T extends WithId> {
  add(item: T): void;
  get(id: string | number): T | undefined;
  has(id: string | number): boolean;
}

class MemoryCache<T extends WithId> implements ICache<T> {
  private data = new Map<string | number, T>();

  add(item: T): void {
    this.data.set(item.id, item);
  }

  get(id: string | number): T | undefined {
    return this.data.get(id);
  }

  has(id: string | number): boolean {
    return this.data.has(id);
  }
}

type User = { id: number, name: string };
const userCache: ICache<User> = new MemoryCache<User>();
userCache.add({ id: 1, name: 'Gabor' });
console.log(`Has user 1: ${userCache.has(1)}`);
```

#### **`src/exercise-7.ts`**
```typescript
type WithId = { id: string | number };
class MemoryCache<T extends WithId> {
  protected data = new Map<string | number, T>();
  add(item: T): void {
    this.data.set(item.id, item);
  }
  // ...
}

class PersistentMemoryCache<T extends WithId> extends MemoryCache<T> {
  constructor() {
    super();
  }

  override add(item: T): void {
    console.log('Persisting item...', item);
    super.add(item);
  }
}

type User = { id: number, name: string };
const persistentCache = new PersistentMemoryCache<User>();
persistentCache.add({ id: 1, name: 'Gabor' });
```

---

### **Answers**

1.  **What problem do generics solve?**
    Generics solve the problem of code duplication for logic that needs to operate on different types. They allow you to write a single, reusable class or function (e.g., a collection, cache, or utility function) that is type-safe and works with any type you specify, instead of writing a separate implementation for each data type.

2.  **Type parameter vs. type argument?**
    *   The **type parameter** is the placeholder name you define in the generic class or function declaration (e.g., the `T` in `class MyCache<T> {}`).
    *   The **type argument** is the actual, concrete type you provide when you *use* the generic class or function (e.g., the `User` in `new MyCache<User>()`).

3.  **Purpose of a generic constraint?**
    A constraint narrows the range of types that can be used as a type argument. It ensures that any type provided for the generic parameter will have a certain shape or set of properties. This allows you to safely use those properties inside your generic class or function, as you have a compile-time guarantee that they will exist.

4.  **Why is `wrapInArray<string>('hello')` unnecessary?**
    This TypeScript feature is called **type inference**. The compiler is smart enough to look at the type of the argument being passed to the function (`'hello'` is a `string`) and automatically infer that `T` must be `string` for that specific call.

5.  **`MyCache<T> implements ICache<T>` vs. `UserCache implements ICache<User>`?**
    *   `class MyCache<T> implements ICache<T>` creates a **generic** class. It remains flexible and can be instantiated to cache any type that satisfies the `ICache` constraint. It "passes on" the generic nature of the interface.
    *   `class UserCache implements ICache<User>` creates a **non-generic, specific** class. It "fixes" the generic type parameter to `User`. This class can *only* be used to cache `User` objects.

6.  **Can a static method use the class's generic type `T`?**
    No. A class's generic type parameter `T` is tied to an *instance* of that class. `new MyClass<string>()` has a `T` of `string`, while `new MyClass<number>()` has a `T` of `number`. Static methods, however, belong to the class itself, not to any instance. Therefore, they have no instance-specific context from which to know what `T` is. A static method can, however, have its own generic type parameters (e.g., `static myMethod<U>(arg: U) {}`).

7.  **What is the type of `T` in `function process<T>(arg: T)`?**
    If there is no constraint (`extends ...`), the type of `T` inside the function is effectively **`unknown`**. This is a safety feature. TypeScript knows it could be any type, so it won't let you perform any operations on `arg` that aren't available on all possible types (like calling methods or accessing properties) without first using a type guard to prove what type it is.