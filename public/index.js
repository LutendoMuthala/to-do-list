
// Get references to the HTML elements
const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("addButton"); // The "Add task" button

// Fetch the current todo list when the page loads
window.onload = function() {
    fetchTodos();
};

//Array to store tasks
let tasks = []

// Add event listener for the 'Add task' button
addUpdate.addEventListener("click", addTask);

// Function to add task
function addTask() {
    const taskText = todoValue.value.trim();
    const alertElement = todoAlert;

    if (taskText === "") {
        // Show alert if input is empty
        alertElement.textContent = "Please enter a task!";
    } else {
        // Add task to the list
        tasks.push(taskText);

        // Clear the input field
        todoValue.value = "";

        // Clear any previous alerts
        todoAlert.textContent = "";

        // Update the task list display
        updateTaskList();
    }
}

// Function to update the displayed task list
function updateTaskList() {
    const listElement = document.getElementById("list-items");
    listElement.innerHTML = ""; // Clear the list

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        
        // Create a checkbox for each task
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox"; // Set checkbox type
        checkbox.classList.add("task-checkbox"); // Optional: Add a class for styling
        
        // Add event listener to handle marking the task as complete
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                li.style.textDecoration = "line-through"; // Mark as complete (strike-through)
            } else {
                li.style.textDecoration = "none"; // Unmark (remove strike-through)
            }
        });
        
        // Append checkbox and task text to the <li>
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(task));

        // Append the <li> element to the list
        listElement.appendChild(li);

        // Create Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'button delete-button';
    deleteButton.onclick = function () {
        li.remove();
    };
    li.appendChild(deleteButton);

    });
}

// Call the updateTaskList function to display tasks
updateTaskList();


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

// Function to create a new todo item using backend
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
