const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public"))); 

let todo = [];
const todoFilePath = path.join(__dirname, "todo-list.json");

// Load todo list from file
try {
  const data = fs.readFileSync(todoFilePath);
  todo = JSON.parse(data);
} catch (err) {
  todo = [];
}

// Middleware to parse POST request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to get the current todo list
app.get("/todos", (req, res) => {
  res.json(todo);
});

// Route to add a new todo item
app.post("/todos", (req, res) => {
  const { todoText } = req.body;

  if (todoText === "") {
    return res.status(400).json({ message: "Please enter your task!" });
  }

  // Check if the item is already in the list
  let isPresent = todo.some((element) => element.item === todoText);
  if (isPresent) {
    return res.status(400).json({ message: "This item is already in the list!" });
  }

  // Add new item to the list
  const newItem = { item: todoText, status: false };
  todo.push(newItem);

  // Saving to the file 
  fs.writeFileSync(todoFilePath, JSON.stringify(todo, null, 2), "utf-8");

  res.status(201).json({ message: "Todo item Created Successfully!" });
});

// PUT route to update a task (edit task content or completion status)
app.put("/todos/:index", (req, res) => {
  const index = parseInt(req.params.index, 10); // Get the index from the URL
  const { item, status } = req.body; // Get the new item text and status from the request body

  // Check if the index is valid
  if (index < 0 || index >= todo.length) {
    return res.status(404).json({ message: "Task not found!" });
  }

  // Update the task content or status
  if (item !== undefined) {
    todo[index].item = item;
  }
  if (status !== undefined) {
    todo[index].status = status;
  }

  // Save updated tasks to the file
  fs.writeFileSync(todoFilePath, JSON.stringify(todo, null, 2), "utf-8");

  res.json({ message: "Task updated successfully!" });
});

// DELETE route to remove a task
app.delete("/todos/:index", (req, res) => {
  const index = parseInt(req.params.index, 10); // Get the index from the URL

  // Check if the index is valid
  if (index < 0 || index >= todo.length) {
    return res.status(404).json({ message: "Task not found!" });
  }

  // Remove the task from the array
  todo.splice(index, 1);

  // Save updated tasks to the file
  fs.writeFileSync(todoFilePath, JSON.stringify(todo, null, 2), "utf-8");

  res.json({ message: "Task deleted successfully!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
