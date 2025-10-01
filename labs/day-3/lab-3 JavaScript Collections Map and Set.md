# Lab: JavaScript Collections (`Map` and `Set`)

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

### **Introduction: Purpose-Built Collections**

While plain JavaScript objects and arrays can be used for storing data, they have limitations. Objects can only use strings (or symbols) as keys, and arrays can be inefficient for checking if an item exists. JavaScript provides purpose-built collection classes, `Map` and `Set`, that offer better performance and more flexibility for specific data management tasks. This lab explores these powerful collections.

---

### **Part 1: The `Map` Collection for Key-Value Storage**

A `Map` is a collection of key-value pairs where the key can be of **any data type**. It is the preferred choice over plain objects when you need more than just string keys or when you need a reliable ordering of elements.

#### **Exercise 1: Creating and Populating a `Map`**

Imagine your extension needs to cache `Diagnostic` objects for open files, using the full file path as the key.

In `src/exercise-1.ts`, create a `Map` to store diagnostic information for different files. Use the `.set()` method to add entries.

```typescript
// src/exercise-1.ts

// A simple representation of a diagnostic message
type Diagnostic = { message: string, line: number };

const diagnosticCache = new Map<string, Diagnostic[]>();

const file1Path = '/path/to/file1.ts';
const file2Path = '/path/to/file2.ts';

// TODO: Add an entry for `file1Path`. The value should be an array with one diagnostic.
// e.g., [{ message: 'Unexpected token', line: 10 }]

// TODO: Add an entry for `file2Path` with a different diagnostic.


console.log(`Cache size: ${diagnosticCache.size}`);
```

#### **Exercise 2: Accessing and Checking for `Map` Entries**

The `.get()` method retrieves a value by its key, and the `.has()` method checks for the existence of a key. This is more explicit and often safer than checking for `undefined` on a plain object.

In `src/exercise-2.ts`, use the `Map` from the previous exercise. Check if a file exists in the cache and, if so, retrieve and log its diagnostics.

```typescript
// src/exercise-2.ts

type Diagnostic = { message: string, line: number };
const diagnosticCache = new Map<string, Diagnostic[]>();
const file1Path = '/path/to/file1.ts';
diagnosticCache.set(file1Path, [{ message: 'Unexpected token', line: 10 }]);

const fileToCheck = file1Path;
const nonExistentFile = '/path/to/other.ts';

// TODO: Check if `diagnosticCache` has an entry for `fileToCheck`.
// If it does, get the value and log the message of the first diagnostic.

// TODO: Do the same check for `nonExistentFile`. Log a message if it's not in the cache.
```

#### **Exercise 3: Iterating Over a `Map`**

`Map` objects are directly iterable. You can iterate over their keys, values, or entries (`[key, value]` pairs). The `for...of` loop is the standard way to do this.

In `src/exercise-3.ts`, iterate over the `diagnosticCache` and log the file path and the number of diagnostics for each entry.

```typescript
// src/exercise-3.ts

type Diagnostic = { message: string, line: number };
const diagnosticCache = new Map<string, Diagnostic[]>();
diagnosticCache.set('/path/to/file1.ts', [{ message: 'Unexpected token', line: 10 }]);
diagnosticCache.set('/path/to/file2.ts', [
  { message: 'Missing semicolon', line: 25 },
  { message: 'Unused variable', line: 28 }
]);

// TODO: Iterate over the `diagnosticCache` using a `for...of` loop.
// The default iterator for a Map yields `[key, value]` pairs.
// Log a message like: "File: /path/to/file1.ts has 1 diagnostic(s)."
```

---

### **Part 2: The `Set` Collection for Unique Values**

A `Set` is a collection of **unique** values. It is highly optimized for adding items and, most importantly, for checking if a value is present in the collection.

#### **Exercise 4: Creating and Populating a `Set`**

Imagine your extension is analyzing a workspace and needs to keep track of all the unique file extensions it has encountered. A `Set` is perfect for this, as it will automatically handle duplicates.

In `src/exercise-4.ts`, create a `Set` and add several file extensions to it, including some duplicates. Observe the final size.

```typescript
// src/exercise-4.ts

const encounteredExtensions = new Set<string>();

// TODO: Add the following extensions to the set using the `.add()` method:
// 'ts', 'js', 'json', 'ts', 'md', 'js'


console.log(`Unique extensions found: ${encounteredExtensions.size}`);
console.log(encounteredExtensions);
```

#### **Exercise 5: Using a `Set` to Find Unique Items from an Array**

A common and powerful use case for `Set` is to quickly de-duplicate an array. You can create a `Set` directly from an array, and then convert it back to an array.

In `src/exercise-5.ts`, you are given an array of user-provided tags that contains duplicates. Your task is to produce a new array containing only the unique tags in their original order.

```typescript
// src/exercise-5.ts

const userTags = ['typescript', 'vscode', 'debug', 'typescript', 'eslint', 'debug'];

// TODO: Create a `Set` from the `userTags` array to get the unique values.
// Then, convert the Set back into an array using the spread operator `...`.
const uniqueTags: string[] = []; // Replace this

console.log(uniqueTags);
```

#### **Exercise 6: Checking for Membership in a `Set`**

The `.has()` method on a `Set` is extremely fast (O(1) complexity), making it far more performant for membership checking than an array's `.includes()` method (O(n) complexity), especially for large collections.

In `src/exercise-6.ts`, you have a `Set` of supported language IDs. Write a function that efficiently checks if a given language is supported.

```typescript
// src/exercise-6.ts

const supportedLanguageIds = new Set(['typescript', 'javascript', 'csharp', 'java', 'python']);

function isLanguageSupported(languageId: string): boolean {
  // TODO: Use the `.has()` method of the `Set` to return true if the language is supported, false otherwise.
  return false; // Replace this
}

console.log(`Is 'typescript' supported? ${isLanguageSupported('typescript')}`);
console.log(`Is 'go' supported? ${isLanguageSupported('go')}`);
```

---

### **Questions**

1.  What is the most significant advantage of using a `Map` over a plain JavaScript object for key-value storage?
2.  In Exercise 2, what does `diagnosticCache.get(nonExistentFile)` return? Why is using `.has()` before `.get()` a good practice?
3.  What are the three different iterators a `Map` provides, and what does each one yield?
4.  In Exercise 4, why is the final `.size` of the `Set` not equal to the number of `.add()` calls we made?
5.  In Exercise 5, does the final `uniqueTags` array guarantee the same order as the first appearance of each tag in the original `userTags` array?
6.  For a very large collection of items (e.g., 1 million strings), why would checking for an item's existence be dramatically faster with a `Set` than with an `Array`?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
type Diagnostic = { message: string, line: number };
const diagnosticCache = new Map<string, Diagnostic[]>();
const file1Path = '/path/to/file1.ts';
const file2Path = '/path/to/file2.ts';

diagnosticCache.set(file1Path, [{ message: 'Unexpected token', line: 10 }]);
diagnosticCache.set(file2Path, [{ message: 'Missing semicolon', line: 25 }]);

console.log(`Cache size: ${diagnosticCache.size}`);
```

#### **`src/exercise-2.ts`**
```typescript
type Diagnostic = { message: string, line: number };
const diagnosticCache = new Map<string, Diagnostic[]>();
const file1Path = '/path/to/file1.ts';
diagnosticCache.set(file1Path, [{ message: 'Unexpected token', line: 10 }]);

const fileToCheck = file1Path;
const nonExistentFile = '/path/to/other.ts';

if (diagnosticCache.has(fileToCheck)) {
  const diagnostics = diagnosticCache.get(fileToCheck);
  console.log(`Diagnostics for ${fileToCheck}: ${diagnostics[0].message}`);
}

if (!diagnosticCache.has(nonExistentFile)) {
  console.log(`No diagnostics found for ${nonExistentFile}.`);
}
```

#### **`src/exercise-3.ts`**
```typescript
type Diagnostic = { message: string, line: number };
const diagnosticCache = new Map<string, Diagnostic[]>();
diagnosticCache.set('/path/to/file1.ts', [{ message: 'Unexpected token', line: 10 }]);
diagnosticCache.set('/path/to/file2.ts', [
  { message: 'Missing semicolon', line: 25 },
  { message: 'Unused variable', line: 28 }
]);

for (const [filePath, diagnostics] of diagnosticCache) {
  console.log(`File: ${filePath} has ${diagnostics.length} diagnostic(s).`);
}
```

#### **`src/exercise-4.ts`**
```typescript
const encounteredExtensions = new Set<string>();

encounteredExtensions.add('ts');
encounteredExtensions.add('js');
encounteredExtensions.add('json');
encounteredExtensions.add('ts'); // This is a duplicate and will be ignored
encounteredExtensions.add('md');
encounteredExtensions.add('js'); // This is also a duplicate

console.log(`Unique extensions found: ${encounteredExtensions.size}`);
console.log(encounteredExtensions);
```

#### **`src/exercise-5.ts`**
```typescript
const userTags = ['typescript', 'vscode', 'debug', 'typescript', 'eslint', 'debug'];

const uniqueTags: string[] = [...new Set(userTags)];

console.log(uniqueTags);
```

#### **`src/exercise-6.ts`**
```typescript
const supportedLanguageIds = new Set(['typescript', 'javascript', 'csharp', 'java', 'python']);

function isLanguageSupported(languageId: string): boolean {
  return supportedLanguageIds.has(languageId);
}

console.log(`Is 'typescript' supported? ${isLanguageSupported('typescript')}`);
console.log(`Is 'go' supported? ${isLanguageSupported('go')}`);```

---

### **Answers**

1.  **Advantage of `Map` over an object?**
    The most significant advantage is that a `Map` can use **any data type** as a key (including objects, numbers, booleans, etc.), whereas a plain object is limited to strings and symbols. `Map` also provides useful properties and methods like `.size`, `.has()`, and a guaranteed insertion order for its elements, which are not available on plain objects.
2.  **What does `.get()` return for a non-existent key?**
    `map.get(nonExistentKey)` returns `undefined`. Using `.has()` before `.get()` is good practice because it allows you to distinguish between a key that doesn't exist at all and a key that *does* exist but whose value is explicitly `undefined`. This makes your code more robust and its intent clearer.
3.  **What are the three iterators on a `Map`?**
    A `Map` provides three iterator methods:
    *   `map.keys()`: Yields each **key** in the map.
    *   `map.values()`: Yields each **value** in the map.
    *   `map.entries()`: Yields each **entry** as a `[key, value]` array. This is the default iterator used by `for...of`.
4.  **Why is the `.size` of the `Set` smaller than the number of `.add()` calls?**
    A `Set` can only store unique values. When we called `.add('ts')` and `.add('js')` the second time, the `Set` recognized that these values were already present in the collection and simply ignored the duplicate additions. The `.size` property reflects the count of unique items only.
5.  **Does the `uniqueTags` array preserve order?**
    Yes. When a `Set` is created from an iterable (like an array), it preserves the insertion order of the first time each unique element is encountered. When you convert that `Set` back to an array using the spread operator, that order is maintained. So, `uniqueTags` will be `['typescript', 'vscode', 'debug', 'eslint']`.
6.  **Why is `Set.has()` faster than `Array.includes()` for large collections?**
    The performance difference comes from their underlying data structures.
    *   **`Array.includes()`** must perform a linear search. It checks the first element, then the second, then the third, and so on, until it finds a match or reaches the end. In the worst case, it has to check all 1 million items (O(n) time complexity).
    *   **`Set.has()`** uses a hash table internally. It can compute a hash of the value it's looking for and go directly to the location where that value *should* be. This check is performed in constant time, on average (O(1) time complexity), regardless of how many items are in the set. For a large collection, the difference is massive—nanoseconds for a `Set` vs. potentially milliseconds or more for an `Array`.