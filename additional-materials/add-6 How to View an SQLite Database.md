### **Option 1: The Raw SQLite CLI (via the `sqlite3` package)**

The `sqlite3` npm package, a popular driver for Node.js, bundles the standard SQLite command-line shell.

*   **How to Install & Run:**
    You can install it globally, but the recommended professional approach is to use `npx` to run it directly against your database file without a permanent global installation.

    ```bash
    # From your project root, where todos.db is located:
    npx sqlite3 todos.db
    ```

*   **What it Does:**
    This command drops you directly into the powerful but spartan SQLite command-line interface. You interact with it by typing SQL queries or special "dot-commands".

    ```
    sqlite> .tables
    todos
    sqlite> .schema todos
    CREATE TABLE todos (id INTEGER PRIMARY KEY, task TEXT, complete INTEGER);
    sqlite> SELECT * FROM todos;
    1|Buy Flowers|0
    2|Get Shoes|1
    ...
    sqlite> .exit
    ```

*   **Pros:**
    *   **Zero Extra Dependencies:** If a project were using the `sqlite3` driver, this tool would already be available in `node_modules`.
    *   **Direct & Powerful:** You are interacting directly with the SQLite engine. There is no abstraction.
    *   **Good for Scripting:** Excellent for automated tasks.

*   **Cons:**
    *   **Not User-Friendly:** It is not a "viewer." It's a shell. It requires knowledge of SQL and SQLite's specific dot-commands (`.tables`, `.schema`, etc.).
    *   **High Cognitive Load:** For a quick verification during a lab, it's overkill and can be intimidating for those not deeply familiar with SQL CLIs.

---

### **Option 2: A Web-Based Viewer Launched from the CLI (`datasette`)**

`Datasette` is a open-source tool that takes a SQLite database file and instantly generates a web-based, browsable API and user interface for it.

*   **How to Install & Run:**
    The best way to use it for our purpose is with `npx`.

    ```bash
    # From your project root, where todos.db is located:
    npx datasette todos.db
    ```

*   **What it Does:**
    This command starts a local web server. You will see output like `INFO:     Uvicorn running on http://127.0.0.1:8001`. You then open that URL in your web browser to get a clean, modern, and user-friendly interface to explore your database tables, sort, and filter data. To stop the server, you press `Ctrl+C` in the terminal.

*   **Pros:**
    *   **Extremely User-Friendly:** Provides a full graphical interface in the browser. It's perfect for visually inspecting data without writing any SQL.
    *   **Simple Command:** Still uses a single, simple `npx` command to launch, fitting our requirement perfectly.
    *   **Powerful Features:** Allows for filtering, sorting, and even running custom SQL queries if desired, all from the browser UI.

*   **Cons:**
    *   **Requires a Browser:** It is not a pure terminal-based tool.
    *   **Slightly Heavier:** It downloads a few packages and spins up a web server, so it's not as instantaneous as a native CLI.

---

### **Alternative: The Professional GUI Standard (DB Browser for SQLite)**

While not an npm-based tool, it's important to be aware of the most common tool used by professionals for this task.

*   **How to Install & Run:**
    This is a standalone desktop application you download and install from [https://sqlitebrowser.org/](https://sqlitebrowser.org/). You run it like any other application and use its "Open Database" menu to select your `todos.db` file.

*   **Pros:**
    *   **The Gold Standard:** This is the most feature-rich and widely used GUI for managing SQLite databases.
    *   **Full Database Management:** Allows you to browse data, modify schemas, run complex queries, and manage database pragmas.

*   **Cons:**
    *   **Not NPM-Based:** It requires a separate installation process outside of the project's tooling, which adds an extra step to the environment setup lab.

---

We can add a simple step to the "Verification" section of the SQLite lab:

**5. (Optional) Visually Inspect the Database**
To visually confirm the data was written correctly, you can use the `datasette` tool. From your terminal, run the following command:
```bash
 npx datasette todos.db
```
This will start a local web server. Open the URL it provides (e.g., `http://127.0.0.1:8001`) in your browser to explore the `todos` table. Press `Ctrl+C` in the terminal to stop the server when you are finished.