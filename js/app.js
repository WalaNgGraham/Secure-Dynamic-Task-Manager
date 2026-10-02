const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 0;

function generateTaskId() {
  taskCounter += 1;
  return "task-" + taskCounter;
}

function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);

  return li;
}

function updateTaskCounts() {
  const items = taskList.querySelectorAll(".task-item");
  let total = 0;
  let pending = 0;
  let completed = 0;

  items.forEach(function (item) {
    total += 1;
    if (item.dataset.state === "completed") {
      completed += 1;
    } else {
      pending += 1;
    }
  });

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

function addTask(taskText) {
  const trimmed = taskText.trim();
  if (trimmed === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  const id = generateTaskId();
  const taskItem = createTaskElement(trimmed, id);
  taskList.appendChild(taskItem);

  taskInput.value = "";
  taskMessage.textContent = "";
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  if (taskItem.dataset.state === "completed") {
    taskItem.dataset.state = "pending";
  } else {
    taskItem.dataset.state = "completed";
  }
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const span = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!span || !editBtn) return;

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-input");
  input.value = span.textContent;

  taskItem.replaceChild(input, span);
  editBtn.textContent = "Save";
  input.focus();
}

function saveTaskEdit(taskItem) {
  const input = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!input || !editBtn) return;

  const trimmed = input.value.trim();
  if (trimmed === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = trimmed;

  taskItem.replaceChild(span, input);
  editBtn.textContent = "Edit";
  taskMessage.textContent = "";
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function handleTaskListClick(event) {
  const target = event.target;
  if (!target || !target.classList) return;

  const taskItem = target.closest(".task-item");
  if (!taskItem) return;

  if (target.classList.contains("complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.classList.contains("edit-btn")) {
    if (target.textContent === "Edit") {
      beginTaskEdit(taskItem);
    } else {
      saveTaskEdit(taskItem);
    }
  } else if (target.classList.contains("remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  const samples = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  samples.forEach(function (text) {
    const id = generateTaskId();
    const taskItem = createTaskElement(text, id);
    fragment.appendChild(taskItem);
  });

  taskList.appendChild(fragment);
  updateTaskCounts();
}

addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskList.addEventListener("click", handleTaskListClick);

updateTaskCounts();