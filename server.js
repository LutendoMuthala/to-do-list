const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public"))); // Serve static files 

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

  // Save to the file (acting like localStorage)
  fs.writeFileSync(todoFilePath, JSON.stringify(todo, null, 2), "utf-8");

  res.status(201).json({ message: "Todo item Created Successfully!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
