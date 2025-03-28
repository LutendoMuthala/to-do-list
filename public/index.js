
// Get references to the HTML elements
const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("addButton"); // The "Add task" button

// Fetch the current todo list when the page loads
window.onload = function() {
    fetchTodos();
};

// Fetch the tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

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
        tasks.push({ item: taskText, status: false });

        // Save updated tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));

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
    listItems.innerHTML = ""; // Clear the list

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        // Create a checkbox for each task
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox"; // Set checkbox type
        checkbox.checked = task.status; // Set task completion based on status

        // Adding event listener to handle marking the task as complete
        checkbox.addEventListener("change", function () {
            task.status = checkbox.checked; // Update status in task
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated status
            li.style.textDecoration = checkbox.checked ? "line-through" : "none"; // Strike-through on completion
        });

        // Task text
        const taskContent = document.createElement("span");
        taskContent.textContent = task.item;

        // Task actions for Edit and Delete buttons
        const taskActions = document.createElement("div");
        taskActions.classList.add("task-actions");

        // Edit icon
        const editIcon = document.createElement("i");
        editIcon.classList.add("fas", "fa-edit", "edit-icon");
        editIcon.onclick = function() { editTask(taskContent, task.item, index); };

        // Delete icon
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash", "delete-icon");
        deleteIcon.onclick = function() { deleteTask(index); };

        taskActions.appendChild(editIcon);
        taskActions.appendChild(deleteIcon);

        // Append checkbox, task content, and actions to the <li>
        li.appendChild(checkbox);
        li.appendChild(taskContent);
        li.appendChild(taskActions);

        // Add the <li> element to the list
        listItems.appendChild(li);

        // Strike-through if the task is completed
        if (task.status) {
            li.style.textDecoration = "line-through";
        }
    });
}

// Function to edit a task
function editTask(taskContent, oldText, index) {
    const newText = prompt("Edit your task:", oldText);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].item = newText.trim(); // Update the task text in the array
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage
        taskContent.textContent = newText.trim(); // Update the task display
    }
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1); // Remove the task from the tasks array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks to localStorage
    updateTaskList(); // Update the list display
}

// Function to fetch and display the todo list from localStorage
function fetchTodos() {
    updateTaskList(); // Directly update the task list from localStorage
}
