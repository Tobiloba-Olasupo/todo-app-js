let form = document.getElementById("form");
let input = document.getElementById("input");
let uncompletedTasksContainer = document.getElementById("uncompleted-tasks");
let completedTasksContainer = document.getElementById("completed-tasks");
let tasksContainer = document.getElementById("tasks-container");

let tasks = [];
let completedTasks = [];
let currentTaskIndex = null;
let currentCompletedTaskIndex = null;
let editingIndex = null;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

const formValidation = () => {
    if (input.value === "") {
        alert("Task cannot be empty!");
    } else if (editingIndex !== null) {
        saveEdit();
    } else {
        addTask();
    }
};

const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

const getTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompletedTasks = localStorage.getItem('completedTasks');

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    };

    if (completedTasks) {
        completedTasks = JSON.parse(savedCompletedTasks);
    }
}

const addTask = () => {
    let task = {};
    task["title"] = input.value;
    tasks.push(task);
    input.value = "";
    renderTasks();
    saveToLocalStorage();
};

const isCompleted = (index) => {
    currentTaskIndex = index;
    let completedTask = tasks[currentTaskIndex];
    completedTasks.push(completedTask);
    tasks.splice(currentTaskIndex, 1);
    renderTasks();
    saveToLocalStorage();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
    saveToLocalStorage();
};

const deleteCompletedTask = (index) => {
    completedTasks.splice(index, 1);
    renderTasks();
    saveToLocalStorage();
};

const returnTask = (index) => {
    currentCompletedTaskIndex = index;
    let returningTask = completedTasks[currentCompletedTaskIndex];
    tasks.push(returningTask);
    completedTasks.splice(currentCompletedTaskIndex, 1);
    renderTasks();
    saveToLocalStorage();
};

const editTask = (index) => {
    editingIndex = index;
    input.value = tasks[editingIndex].title;
    input.scrollIntoView({behavior: "smooth", block: "center"});
    renderTasks();
};

const saveEdit = () => {
    tasks[editingIndex].title = input.value;
    editingIndex = null;
    input.value = "";
    renderTasks();
    saveToLocalStorage();
};


const renderTasks = () => {

    uncompletedTasksContainer.innerHTML = tasks.map((item, index) => {
        return `
            <div class="task"">
                <div class="task-content">
                    <p class="task-title">
                        ${editingIndex === index ?
                        `<span style="color: grey; font-style: italic;">Editing...</span>` :
                        item.title}
                    </p>
                </div>
                <div class="options">
                    <i onclick="isCompleted(${index})" class="fas fa-check-square"></i>
                    <i onclick="editTask(${index})" class="fas fa-pencil-alt"></i>
                    <i onclick="deleteTask(${index})" class="fas fa-trash"></i>
                </div>
            </div>
        `
    }).join('');
    

    completedTasksContainer.innerHTML = completedTasks.map((item, index) => {
        return `
            <div class="task">
                <div class="task-content">
                    <p class="task-title">${item.title}</p>
                </div>
                <div class="options">
                    <i onclick="returnTask(${index})" class="fas fa-reply"></i>
                    <i onclick="deleteCompletedTask(${index})" class="fas fa-trash"></i>
                </div>
            </div>
        `
    }).join('');

};

document.addEventListener("DOMContentLoaded", ()=>{
    getTasksFromLocalStorage();
    renderTasks();
});







