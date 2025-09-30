### **Lab: Object Manipulation Techniques**

**Time:** Approx. 45-60 minutes

---

### **Setup**

For these exercises, you will use a pre-configured starter project. This project is set up to allow you to work on and run each exercise in a separate file, which is ideal for focused learning.

1.  Clone or download the `starter-project-multi` project.
2.  Open the project in Visual Studio Code.
3.  Open a terminal and run `npm install` to install the necessary dependencies (`typescript`, `ts-node`).
4.  For each exercise, you will create a new file in the `src` directory (e.g., `src/exercise-1.ts`).
5.  To run and verify your solution for a specific exercise, you will use the following command in the terminal:

    ```bash
    npx ts-node src/exercise-1.ts 
    ```
    (Replace `exercise-1.ts` with the appropriate file name for each exercise.)

---

### **Part 1: Core Object Manipulation (Section 3.5.1)**

These exercises focus on the basic, mutable operations on objects: adding, updating, and deleting properties.

#### **Exercise 1: Activating a New Feature**

Imagine you are loading a default configuration for your extension. Your task is to add a new, dynamic property to this object to enable a feature that wasn't in the original settings.

In `src/exercise-1.ts`, start with the provided configuration object. Add a new property named `showWelcomeMessage` and set its value to `true`.

```typescript
// src/exercise-1.ts

const extensionConfig = {
  name: 'My Cool Extension',
  version: '1.0.0',
};

// TODO: Add a 'showWelcomeMessage' property with a value of true.


console.log(extensionConfig);
```

#### **Exercise 2: Toggling an Existing Setting**

A user has changed a setting for your extension. You need to update an existing property on a configuration object to reflect this change.

In `src/exercise-2.ts`, start with the editor settings object. The `formatOnSave` feature is currently enabled. Change its value to `false`.

```typescript
// src/exercise-2.ts

const editorSettings = {
  fontFamily: 'Fira Code',
  fontSize: 14,
  formatOnSave: true,
};

// TODO: Update the 'formatOnSave' property to be false.


console.log(editorSettings);
```

#### **Exercise 3: Reverting a Setting to its Default**

When a user unsets a configuration in VS Code, the property is often removed from the settings object, causing the editor to fall back to its default value. Your task is to simulate this by deleting a property.

In `src/exercise-3.ts`, a user has a specific `tabSize` configured. Remove the `tabSize` property from the `userSettings` object entirely.

```typescript
// src/exercise-3.ts

const userSettings = {
  theme: 'Dark+',
  tabSize: 2, // User has a specific override
};

// TODO: Delete the 'tabSize' property from the object.


console.log(userSettings);
```

---

### **Part 2: Spread and Rest Operators (Section 3.5.2)**

These exercises focus on immutable patterns for creating new objects from existing ones.

#### **Exercise 4: Creating a Production Configuration**

You have a base development configuration. Your task is to create a new production configuration object that includes all properties from the development config but adds a new `logLevel` property set to `'error'`. The original object must not be changed.

In `src/exercise-4.ts`, use the spread operator to create `productionConfig`.

```typescript
// src/exercise-4.ts

const devConfig = {
  apiEndpoint: 'http://localhost:3000/api',
  timeout: 5000,
};

// TODO: Create a new 'productionConfig' object using the spread operator.
// It should contain all properties from 'devConfig' plus a 'logLevel' property set to 'error'.
const productionConfig = {}; // Replace this

console.log('Original Dev Config:', devConfig);
console.log('Production Config:', productionConfig);
```

#### **Exercise 5: Overriding a Default Theme**

Your extension has a default theme. A user wants to create their own theme by overriding just one color. Create a new theme object that inherits all properties from the default but has a different `backgroundColor`.

In `src/exercise-5.ts`, use the spread operator to create the `userTheme`.

```typescript
// src/exercise-5.ts

const defaultTheme = {
  backgroundColor: '#222222',
  textColor: '#DDDDDD',
  highlightColor: '#00AAFF',
};

// TODO: Create a 'userTheme' object that is a copy of 'defaultTheme'
// but with the 'backgroundColor' overridden to '#FFFFFF'.
const userTheme = {}; // Replace this

console.log(userTheme);
```

#### **Exercise 6: Separating Core Data from Metadata**

You receive a command object that contains core data (`commandId`, `args`) and extra metadata (`source`, `timestamp`). Your task is to create a new object that contains *only* the metadata, for logging purposes.

In `src/exercise-6.ts`, use object destructuring with the rest operator to extract the metadata.

```typescript
// src/exercise-6.ts

const commandPayload = {
  commandId: 'extension.runQuery',
  args: ['SELECT * FROM users;'],
  source: 'TreeView',
  timestamp: Date.now(),
};

// TODO: Use destructuring and the rest operator to create a 'metadata' object
// that contains only the 'source' and 'timestamp' properties.
const { } = commandPayload; // Modify this line
const metadata = {}; // Assign the rest properties here

console.log(metadata);
```

---

### **Part 3: Getters and Setters (Section 3.5.3)**

These exercises explore computed properties and encapsulating logic behind property access.

#### **Exercise 7: Creating a Computed Full Path**

You have an object representing a file in the workspace. It has `directory` and `fileName` properties. Your task is to add a `fullPath` getter that computes and returns the combined path.

In `src/exercise-7.ts`, add a `get fullPath()` to the `fileInfo` object.

```typescript
// src/exercise-7.ts

const fileInfo = {
  directory: '/home/user/project',
  fileName: 'index.ts',

  // TODO: Add a getter named 'fullPath' that returns the combined path.
  // Example: '/home/user/project/index.ts'
};

console.log(fileInfo.fullPath);
```

#### **Exercise 8: Validating a Setting with a Setter**

Your extension has a setting for the number of history items to keep, which must be a positive integer. Your task is to create a setter that validates the input value.

In `src/exercise-8.ts`, complete the `config` object. The `historySize` setter should only update the private `_historySize` property if the new value is a positive number.

```typescript
// src/exercise-8.ts

const config = {
  _historySize: 100,

  // TODO: Add a setter for 'historySize'.
  // It should check if the new value is greater than 0.
  // If it is, update '_historySize'. Otherwise, do nothing.
  set historySize(value: number) {
    // ... your logic here
  },

  get historySize() {
    return this._historySize;
  }
};

console.log(`Initial history size: ${config.historySize}`);
config.historySize = -5; // Try to set an invalid value
console.log(`After invalid update: ${config.historySize}`);
config.historySize = 200; // Set a valid value
console.log(`After valid update: ${config.historySize}`);
```

#### **Exercise 9: Unit Conversion**

Your extension's internal logic works with temperatures in Kelvin, but you want to expose the setting to the user in Celsius. Your task is to create a getter and setter for `temperatureCelsius` that correctly converts to and from a private `_kelvin` property. (Formula: K = C + 273.15)

In `src/exercise-9.ts`, implement the getter and setter.

```typescript
// src/exercise-9.ts

const sensorReading = {
  _kelvin: 293.15, // Internal state is in Kelvin (20°C)

  // TODO: Implement a getter for 'temperatureCelsius' that converts from Kelvin.
  get temperatureCelsius(): number {
    return 0; // Replace this
  },

  // TODO: Implement a setter for 'temperatureCelsius' that converts to Kelvin.
  set temperatureCelsius(value: number) {
    // ... your logic here
  }
};

console.log(`Initial Celsius: ${sensorReading.temperatureCelsius.toFixed(2)}`);
sensorReading.temperatureCelsius = 25;
console.log(`New Celsius: ${sensorReading.temperatureCelsius.toFixed(2)}`);
console.log(`Internal Kelvin: ${sensorReading._kelvin}`);
```

---

### **Part 4: Defining Methods (Section 3.5.4)**

These exercises focus on adding behavior (functions) to your data objects.

#### **Exercise 10: Formatting a Log Entry**

You have a log entry object. Your task is to add a `format()` method that returns a standardized log string.

In `src/exercise-10.ts`, add the `format` method to the `logEntry` object.

```typescript
// src/exercise-10.ts

const logEntry = {
  timestamp: new Date(),
  level: 'INFO',
  message: 'User logged in',

  // TODO: Add a method named 'format'.
  // It should return a string in the format: "[LEVEL] (YYYY-MM-DD HH:MM:SS): message"
  // Hint: Use `this.timestamp.toISOString()` and string manipulation.
};

console.log(logEntry.format());
```

#### **Exercise 11: Updating an Item's State**

You have an object representing an item in a VS Code Tree View. It has a state (`'collapsed'` or `'expanded'`). Your task is to add a `toggle()` method that flips its state.

In `src/exercise-11.ts`, implement the `toggle` method.

```typescript
// src/exercise-11.ts

const treeViewItem = {
  label: 'My Project',
  state: 'collapsed',

  // TODO: Add a method named 'toggle'.
  // It should change 'state' from 'collapsed' to 'expanded' or vice-versa.
  // Use 'this.state' to access the current state.
};

console.log(`Initial state: ${treeViewItem.state}`);
treeViewItem.toggle();
console.log(`After toggle: ${treeViewItem.state}`);
treeViewItem.toggle();
console.log(`After second toggle: ${treeViewItem.state}`);
```

#### **Exercise 12: Creating a Serializable Object**

You have a `Diagnostic` object that represents a problem in the code. Your task is to add a `toJSON()` method. This is a special method name that `JSON.stringify()` will automatically call to get a "clean" version of the object for serialization, allowing you to control what gets stringified.

In `src/exercise-12.ts`, implement the `toJSON` method to return an object with only the `line`, `severity`, and `message` properties.

```typescript
// src/exercise-12.ts

const diagnostic = {
  line: 42,
  severity: 'error',
  message: "Unexpected token ';'",
  source: 'MyLinter', // Internal property, should not be serialized
  
  // TODO: Add a method named 'toJSON'.
  // It should return a new object containing only 'line', 'severity', and 'message'.
  // Use 'this' to access the properties.
};

const jsonString = JSON.stringify(diagnostic);
console.log(jsonString);
```

---

### **Questions**

#### **Part 1: Core Object Manipulation**

1.  What is the main difference between adding a new property to an object and updating an existing one in JavaScript/TypeScript?
2.  What would happen if you tried to access a property immediately after using the `delete` operator on it?
3.  Why is directly mutating objects (as done in these exercises) sometimes discouraged in more complex applications?

#### **Part 2: Spread and Rest Operators**

1.  In Exercise 4, what is the key benefit of using the spread operator to create `productionConfig` instead of modifying `devConfig` directly?
2.  If two objects being spread into a new object have a property with the same name, which one "wins"?
3.  What is the difference in purpose between the spread operator (`...`) when used inside an object literal `{}` and the rest operator (`...`) when used in object destructuring `const {} = obj`?

#### **Part 3: Getters and Setters**

1.  What is a "backing property" (like `_historySize` in Exercise 8), and why is it necessary when you define both a getter and a setter for the same public property name?
2.  Can you have a getter for a property without a corresponding setter? What would be the effect?
3.  In Exercise 9, if the `temperatureCelsius` setter received a non-numeric value (e.g., a string), what would happen at runtime?

#### **Part 4: Defining Methods**

1.  In Exercise 11, what does the `this` keyword refer to inside the `toggle` method?
2.  What is the advantage of defining a `toJSON()` method (Exercise 12) instead of manually creating a clean object every time you need to serialize it?
3.  Could an arrow function (`format = () => { ... }`) be used to define a method on an object literal? What is a key consideration when doing so?

---

### **Solution**

#### **`src/exercise-1.ts`**
```typescript
const extensionConfig = {
  name: 'My Cool Extension',
  version: '1.0.0',
};

extensionConfig['showWelcomeMessage'] = true;

console.log(extensionConfig);
```

#### **`src/exercise-2.ts`**
```typescript
const editorSettings = {
  fontFamily: 'Fira Code',
  fontSize: 14,
  formatOnSave: true,
};

editorSettings.formatOnSave = false;

console.log(editorSettings);
```

#### **`src/exercise-3.ts`**
```typescript
const userSettings = {
  theme: 'Dark+',
  tabSize: 2,
};

delete userSettings.tabSize;

console.log(userSettings);
```

#### **`src/exercise-4.ts`**

```typescript
const devConfig = {
  apiEndpoint: 'http://localhost:3000/api',
  timeout: 5000,
};

const productionConfig = {
  ...devConfig,
  logLevel: 'error',
};

console.log('Original Dev Config:', devConfig);
console.log('Production Config:', productionConfig);
```

#### **`src/exercise-5.ts`**
```typescript
const defaultTheme = {
  backgroundColor: '#222222',
  textColor: '#DDDDDD',
  highlightColor: '#00AAFF',
};

const userTheme = {
  ...defaultTheme,
  backgroundColor: '#FFFFFF',
};

console.log(userTheme);
```

#### **`src/exercise-6.ts`**
```typescript
const commandPayload = {
  commandId: 'extension.runQuery',
  args: ['SELECT * FROM users;'],
  source: 'TreeView',
  timestamp: Date.now(),
};

const { commandId, args, ...metadata } = commandPayload;

console.log(metadata);```

#### **`src/exercise-7.ts`**
```typescript
const fileInfo = {
  directory: '/home/user/project',
  fileName: 'index.ts',
  get fullPath(): string {
    return `${this.directory}/${this.fileName}`;
  },
};

console.log(fileInfo.fullPath);
```

#### **`src/exercise-8.ts`**
```typescript
const config = {
  _historySize: 100,
  set historySize(value: number) {
    if (value > 0) {
      this._historySize = value;
    }
  },
  get historySize() {
    return this._historySize;
  },
};

console.log(`Initial history size: ${config.historySize}`);
config.historySize = -5;
console.log(`After invalid update: ${config.historySize}`);
config.historySize = 200;
console.log(`After valid update: ${config.historySize}`);
```

#### **`src/exercise-9.ts`**
```typescript
const sensorReading = {
  _kelvin: 293.15,
  get temperatureCelsius(): number {
    return this._kelvin - 273.15;
  },
  set temperatureCelsius(value: number) {
    this._kelvin = value + 273.15;
  },
};

console.log(`Initial Celsius: ${sensorReading.temperatureCelsius.toFixed(2)}`);
sensorReading.temperatureCelsius = 25;
console.log(`New Celsius: ${sensorReading.temperatureCelsius.toFixed(2)}`);
console.log(`Internal Kelvin: ${sensorReading._kelvin}`);
```

#### **`src/exercise-10.ts`**
```typescript
const logEntry = {
  timestamp: new Date(),
  level: 'INFO',
  message: 'User logged in',
  format(): string {
    const time = this.timestamp.toISOString().slice(0, 19).replace('T', ' ');
    return `[${this.level}] (${time}): ${this.message}`;
  },
};

console.log(logEntry.format());
```

#### **`src/exercise-11.ts`**
```typescript
const treeViewItem = {
  label: 'My Project',
  state: 'collapsed' as 'collapsed' | 'expanded',
  toggle(): void {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  },
};

console.log(`Initial state: ${treeViewItem.state}`);
treeViewItem.toggle();
console.log(`After toggle: ${treeViewItem.state}`);
treeViewItem.toggle();
console.log(`After second toggle: ${treeViewItem.state}`);
```

#### **`src/exercise-12.ts`**

```typescript
const diagnostic = {
  line: 42,
  severity: 'error',
  message: "Unexpected token ';'",
  source: 'MyLinter',
  toJSON() {
    return {
      line: this.line,
      severity: this.severity,
      message: this.message,
    };
  },
};

const jsonString = JSON.stringify(diagnostic);
console.log(jsonString);
```

---

### **Answers**

#### **Part 1: Core Object Manipulation**

1.  **What is the main difference between adding a new property and updating an existing one?**
    Syntactically, there is no difference; both use the assignment operator (`obj.prop = value`). The JavaScript runtime determines the behavior: if the property name does not exist on the object, it is created. If it already exists, its value is overwritten.
2.  **What happens if you access a property after deleting it?**
    Accessing a property that has been deleted will yield the value `undefined`. The `delete` operator completely removes the key/value pair from the object.
3.  **Why is direct mutation sometimes discouraged?**
    Directly mutating objects can lead to bugs that are hard to trace. When an object is passed by reference to multiple parts of an application, one part can change it unexpectedly, causing unintended side effects elsewhere. This makes the program's state unpredictable. Immutable patterns (like those in Part 2) create a new object for every change, which makes state management more explicit and predictable.

#### **Part 2: Spread and Rest Operators**

1.  **Benefit of using spread operator for new config?**
    The key benefit is **immutability**. The original `devConfig` object remains unchanged. This is a core principle of predictable state management. It prevents side effects where one part of the application might accidentally modify a shared configuration object that another part depends on.
2.  **Which property "wins" in a spread?**
    The property from the object that appears later (further to the right) in the new object literal wins. In Exercise 5, `{ ...defaultTheme, backgroundColor: '#FFFFFF' }`, the explicit `backgroundColor` comes after the spread `...defaultTheme`, so it overwrites the value from the original object.
3.  **Difference between spread and rest operators for objects?**
    *   **Spread (`...`):** Used during object creation (`{...obj}`). It "spreads out" the properties of an existing object into a *new* object. Its purpose is composition and cloning.
    *   **Rest (`...`):** Used during object destructuring (`const { a, ...rest } = obj`). It collects all the *remaining* properties that were not explicitly destructured into a new object. Its purpose is to partition or separate an object's properties.

#### **Part 3: Getters and Setters**

1.  **What is a "backing property" and why is it necessary?**
    A backing property is a private property used to store the actual data for a public getter/setter pair. It is necessary because if a getter and setter for `prop` tried to access `this.prop` directly, the getter would call itself, and the setter would call itself, leading to an infinite loop and a stack overflow error. The backing property (e.g., `_prop`) breaks this cycle.
2.  **Can you have a getter without a setter?**
    Yes, absolutely. This is a common pattern for creating a read-only computed property. If you define a `get` for a property but no `set`, any attempt to assign a value to that property will either do nothing in non-strict mode or throw a `TypeError` in strict mode.
3.  **What happens if a setter receives a non-numeric value?**
    At runtime, the JavaScript code would attempt to perform a mathematical operation on a non-numeric value. In Exercise 9, if `value` was the string `'abc'`, the expression `value + 273.15` would result in string concatenation, and `_kelvin` would become the string `'abc273.15'`, corrupting the internal state. This highlights why TypeScript's static type checking is so valuable, as it would prevent such a call from ever compiling (`(value: number)`).

#### **Part 4: Defining Methods**

1.  **What does `this` refer to in Exercise 11?**
    Inside the `toggle` method, `this` refers to the `treeViewItem` object itself. This allows the method to access and modify other properties of the same object, such as `this.state`.
2.  **Advantage of `toJSON()`?**
    Encapsulation and standardization. It allows the object itself to define its public, serializable representation. Any code, anywhere in the application, can simply call `JSON.stringify(myObject)` and trust that it will get the correct, "clean" JSON output without needing to know which properties are internal or should be excluded.
3.  **Can an arrow function be used for a method?**
    Yes, an arrow function can be used. The key consideration is the behavior of the `this` keyword. An arrow function does not have its own `this` binding; it lexically inherits `this` from its surrounding scope. For an object literal defined at the top level of a module, `this` would be `undefined` (in strict mode). A regular method (`myMethod() { ... }`) is generally safer for object literals because its `this` will correctly refer to the object itself when called as `myObject.myMethod()`.