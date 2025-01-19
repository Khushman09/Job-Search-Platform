// Get references to elements
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filterBtn');
const progressBar = document.getElementById('progressBar');

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskCategory = categoryInput.value;
    const taskDueDate = dueDateInput.value;

    if (taskText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText} <small>[${taskCategory}]</small> <em>${taskDueDate}</em></span>
            <button class="deleteBtn"><i class="fas fa-trash-alt"></i></button>
        `;
        taskList.appendChild(li);

        // Add event listeners
        li.addEventListener('click', () => li.classList.toggle('completed'));
        li.querySelector('.deleteBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            li.remove();
            updateProgressBar();
            saveTasksToLocalStorage();
        });

        taskInput.value = '';
        dueDateInput.value = '';
        updateProgressBar();
        saveTasksToLocalStorage();
    }
}

// Filter tasks by category
filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        const tasks = document.querySelectorAll('#taskList li');
        tasks.forEach((task) => {
            const category = task.querySelector('small').textContent.replace(/\[|\]/g, '');
            task.style.display = filter === 'all' || category === filter ? '' : 'none';
        });
    });
});

// Update the progress bar
function updateProgressBar() {
    const tasks = document.querySelectorAll('#taskList li');
    const completedTasks = document.querySelectorAll('#taskList li.completed');
    const progress = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;
    progressBar.style.width = `${progress}%`;
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach((task) => {
        const taskText = task.querySelector('span').textContent;
        const taskCategory = task.querySelector('small').textContent;
        const taskDueDate = task.querySelector('em').textContent;
        const isCompleted = task.classList.contains('completed');
        tasks.push({ taskText, taskCategory, taskDueDate, isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ taskText, taskCategory, taskDueDate, isCompleted }) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText} <small>${taskCategory}</small> <em>${taskDueDate}</em></span>
            <button class="deleteBtn"><i class="fas fa-trash-alt"></i></button>
        `;
        if (isCompleted) li.classList.add('completed');
        taskList.appendChild(li);

        // Add event listeners
        li.addEventListener('click', () => li.classList.toggle('completed'));
        li.querySelector('.deleteBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            li.remove();
            updateProgressBar();
            saveTasksToLocalStorage();
        });
    });
    updateProgressBar();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
