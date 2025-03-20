// Get references to the HTML elements
const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("addButton");

// Fetch the current todo list when the page loads
window.onload = function() {
    fetchTodos();
};

let tasks = [];

// Function to add task
function addTask() {
    const taskText = document.getElementById("todoText").value.trim();
    const alertElement = document.getElementById("Alert");

    if (taskText === "") {
        // Show alert if input is empty
        alertElement.textContent = "Please enter a task!";
    } else {
        // Add task to the list
        tasks.push(taskText);

        // Clear the input field
        document.getElementById("todoText").value = "";

        // Update the task list display
        updateTaskList();
    }
}

// Function to update the displayed task list
function updateTaskList() {
    const listElement = document.getElementById("list-items");
    listElement.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task;
        listElement.appendChild(li);
    });
}

// Function to fetch and display the todo list from the backend
function fetchTodos() {
    fetch("/todos")
        .then((response) => response.json())
        .then((todos) => {
            listItems.innerHTML = ''; // Clear the list before displaying updated tasks
            todos.forEach((todo) => {
                const li = document.createElement("li");
                li.innerHTML = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todo.item}</div>
                                <div>
                                    <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" />
                                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" />
                                </div>`;
                listItems.appendChild(li);
            });
        })
        .catch((error) => {
            todoAlert.innerText = "Error loading todo list!";
        });
}

// Function to create a new todo item
function CreateToDoItems() {
    const todoText = todoValue.value.trim();

    if (todoText === "") {
        todoAlert.innerText = "Please enter your task!";
        todoValue.focus();
        return;
    }

    // Send the new todo item to the backend
    fetch("/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ todoText })
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Todo item Created Successfully!") {
                // Add new task to the UI and clear the input field
                fetchTodos(); // Re-fetch the tasks to update the UI
                todoValue.value = "";
                todoAlert.innerText = data.message;
            } else {
                todoAlert.innerText = data.message;
            }
        })
        .catch((error) => {
            todoAlert.innerText = "Error adding task!";
        });
}
