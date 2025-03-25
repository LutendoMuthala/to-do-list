
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
let tasks = [];

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
        li.classList.add("task-item");

        // Create a checkbox for each task
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox"; // Set checkbox type
        checkbox.classList.add("task-checkbox"); 
        
        // Add event listener to handle marking the task as complete
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                li.style.textDecoration = "line-through"; // Mark as complete 
            } else {
                li.style.textDecoration = "none"; // Unmark 
            }
        });
        
        // Task text
        const taskContent = document.createElement("span");
        taskContent.textContent = task;

        // Task actions  for Edit and Delete buttons
        const taskActions = document.createElement("div");
        taskActions.classList.add("task-actions");

        // Edit icon
        const editIcon = document.createElement("i");
        editIcon.classList.add("fas", "fa-edit", "edit-icon");
        editIcon.onclick = function() { editTask(taskContent, task); };

        // Delete icon
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash", "delete-icon");
        deleteIcon.onclick = function() { deleteTask(li, index); };

        taskActions.appendChild(editIcon);
        taskActions.appendChild(deleteIcon);

        // Append checkbox, task content, and actions to the <li>
        li.appendChild(checkbox);
        li.appendChild(taskContent);
        li.appendChild(taskActions);

        // Add the <li> element to the list
        listElement.appendChild(li);
    });
}

// Function to edit a task
function editTask(taskContent, oldText) {
    const newText = prompt("Edit your task:", oldText);
    if (newText !== null && newText.trim() !== "") {
        taskContent.textContent = newText.trim();
    }
}

// Function to delete a task
function deleteTask(taskItem, index) {
    tasks.splice(index, 1); // Remove the task from the tasks array
    taskItem.remove(); // Remove the task from the interface
}

// Function to fetch and display the todo list from the backend
/
function fetchTodos() {
    fetch("/todos")
        .then((response) => response.json())
        .then((todos) => {
            listItems.innerHTML = ''; // Clear the list before displaying updated tasks
            todos.forEach((todo, index) => {
                const li = document.createElement("li");
                li.classList.add("task-item");

                // Create the checkbox
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = todo.status; // Set task completion based on status
                checkbox.addEventListener("change", () => {
                    updateTaskStatus(index, checkbox.checked); // Update status in backend
                    li.style.textDecoration = checkbox.checked ? "line-through" : "none"; // Strike-through on completion
                });

                // Task text
                const taskContent = document.createElement("span");
                taskContent.textContent = todo.item;

                // Task actions (Edit and Delete buttons)
                const taskActions = document.createElement("div");
                taskActions.classList.add("task-actions");

                // Edit icon
                const editIcon = document.createElement("i");
                editIcon.classList.add("fas", "fa-edit", "edit-icon");
                editIcon.onclick = function() { editTask(taskContent, todo.item, index); };

                // Delete icon
                const deleteIcon = document.createElement("i");
                deleteIcon.classList.add("fas", "fa-trash", "delete-icon");
                deleteIcon.onclick = function() { deleteTask(index); };

                taskActions.appendChild(editIcon);
                taskActions.appendChild(deleteIcon);

                // Append checkbox, task content, and actions
                li.appendChild(checkbox);
                li.appendChild(taskContent);
                li.appendChild(taskActions);

                listItems.appendChild(li);
            });
        })
        .catch((error) => {
            todoAlert.innerText = "Error loading todo list!";
        });
}


// Function to create a new todo item using backend
function createToDoItems() {
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
                // Add new task to the interface and clear the input field
                fetchTodos(); // Re-fetch the tasks to update the user interface
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
