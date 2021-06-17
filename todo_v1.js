const addTodoInput = document.getElementById("add-todo");
const todoList = document.getElementById("todoList");
// PREvENT DEFAULT FORM SUBMIT
const formElement = document.getElementById("todo-form");
formElement.onsubmit = e => e.preventDefault();

//useLocalStorage.removeItem("todos");

function generateRandomID() {
	return Math.random().toString(36).substr(2, 9);
}

let todos = useLocalStorage.getItem("todos") || [
	{ id: generateRandomID(), text: "up", isCompleted: false },
	{ id: generateRandomID(), text: "up", isCompleted: false },
	{ id: generateRandomID(), text: "down", isCompleted: false },
	{ id: generateRandomID(), text: "down", isCompleted: false },
	{ id: generateRandomID(), text: "left", isCompleted: false },
	{ id: generateRandomID(), text: "right", isCompleted: false },
	{ id: generateRandomID(), text: "left", isCompleted: false },
	{ id: generateRandomID(), text: "right", isCompleted: false },
	{ id: generateRandomID(), text: "B", isCompleted: false },
	{ id: generateRandomID(), text: "A", isCompleted: false },
];

const createAndUpdateTodo = (id, value, isCompleted) => {
	const todoElement = document.createElement("div");
	const labelElement = document.createElement("label");
	const checkboxElement = document.createElement("input");
	const textElement = document.createElement("span");
	const deleteTodoButton = document.createElement("span");

	todoElement.className = "todo";
	todoElement.setAttribute("data-id", id);
	checkboxElement.type = "checkbox";
	checkboxElement.name = "checkbox";
	checkboxElement.value = value + "_" + id;
	checkboxElement.checked = isCompleted || false;
	checkboxElement.className = "todo__checkbox";
	textElement.className = "todo__text";
	textElement.textContent = value;
	deleteTodoButton.className = "todo__delete";
	labelElement.className = "todo__label";

	if (checkboxElement.checked === true) {
		todoElement.className += " completed";
	} else {
		todoElement.className = "todo";
	}

	labelElement.addEventListener("click", function () {
		if (checkboxElement.checked === true) {
			checkboxElement.checked = true;
			updateTodo(value, true);
			todoElement.className += " completed";
		} else {
			checkboxElement.checked = false;
			updateTodo(value, false);
			todoElement.className = "todo";
		}

		useLocalStorage.setItem("todos", todos);
		countItems(todos);
		showHideFooter(todos);
	});

	deleteTodoButton.addEventListener("click", function (e) {
		e.target.parentElement.remove();
		todos = todos.filter(todo => todo.text !== value);

		if (todos.length === 0) {
			useLocalStorage.removeItem("todos");
			showHideFooter();
		}
	});

	todoElement.appendChild(labelElement);
	todoElement.appendChild(deleteTodoButton);
	labelElement.appendChild(checkboxElement);
	labelElement.appendChild(textElement);

	todoList.appendChild(todoElement);
};

const updateTodo = (text, isCompleted) => {
	const index = todos.findIndex(todo => todo.text === text);

	todos[index].isCompleted = isCompleted;
};

const showHideFooter = arr => {
	if (arr.length === 0 || !arr) {
		document.getElementById("todos-footer").style.display = "none";
	} else {
		document.getElementById("todos-footer").style.display = "flex";
	}
};

window.addEventListener("load", () => {
	if (todos) {
		todos.forEach(todo => {
			createAndUpdateTodo(todo.id, todo.text, todo.isCompleted);
		});
		showHideFooter(todos);
	}
	sortableTodos();
});

// Add Todo
const addCheckbox = document.getElementById("add-checkbox");

function addNewTodo(e) {
	e.preventDefault();

	if (addTodoInput.value !== "") {
		let target = addTodoInput.value;
		let id = generateRandomID();

		createAndUpdateTodo(id, target);

		todos = [
			...todos,
			{
				id: id,
				text: target,
				isCompleted: false,
			},
		];

		countItems(todos);
		showHideFooter(todos);

		useLocalStorage.setItem("todos", todos);
		addTodoInput.value = "";
	}
}

addTodoInput.addEventListener("keyup", function (e) {
	if (e.key === 13 || e.key === "Enter") {
		addNewTodo(e);
	}
});

addCheckbox.onclick = e => addNewTodo(e);

// Filter Todos
const filterByCompletedButton = document.getElementById("filter-completed");
const filterByActiveButton = document.getElementById("filter-active");
const clearButton = document.getElementById("clear");
const filterByAllButton = document.getElementById("filter-all");

// Filter Todo BY Completed
function filterCompleted() {
	let completedTodos = todos.filter(todo => todo.isCompleted === true);

	if (!completedTodos.length) {
		const text = document.createElement("p");
		text.textContent = "No todo completed yet!";
		text.className = "none-completed";
		todoList.appendChild(text);
	}

	todoList.querySelectorAll(".todo").forEach(todo => {
		if (!todo.querySelector("input").checked) {
			todo.style.display = "none";
		} else {
			todo.style.display = "flex";
		}
	});
}

// Filter Todo BY Active
function filterActive() {
	let activeTodos = todos.filter(todo => todo.isCompleted === false);

	if (document.querySelector(".none-completed")) {
		document.querySelector(".none-completed").remove();
	}

	todoList.querySelectorAll(".todo").forEach(todo => {
		todo.style.display = "none";
		if (!todo.querySelector("input").checked) {
			todo.style.display = "flex";
		}
	});
}

// Filter Todo BY All
function filterAll() {
	let activeTodos = todos.filter(todo => todo.isCompleted === false);

	if (document.querySelector(".none-completed")) {
		document.querySelector(".none-completed").remove();
	}

	todoList.querySelectorAll(".todo").forEach(todo => {
		todo.style.display = "flex";
	});
}

// Clear Completed Todo
function clearTodo() {
	let activeTodos = todos.filter(todo => todo.isCompleted === false);

	todos = activeTodos;
	todoList.innerHTML = "";
	todos.forEach(todo => {
		createAndUpdateTodo(todo.id, todo.text, todo.isCompleted);
	});

	useLocalStorage.setItem("todos", todos);
	sortableTodos();
	filterByCompletedButton.checked = false;
	filterByAllButton.checked = true;

	showHideFooter(todos);
}

filterByCompletedButton.onclick = () => filterCompleted();
filterByActiveButton.onclick = () => filterActive();
filterByAllButton.onclick = () => filterAll();
clearButton.onclick = () => clearTodo();

// Count Items
const countItemsText = document.getElementById("count");
function countItems(arr) {
	const countTodoLeft = arr.filter(todo => todo.isCompleted === false);
	countItemsText.innerHTML = countTodoLeft.length + " items left";
}
countItems(todos);

function sortableTodos() {
	Sortable.create(todoList, {
		store: {
			/**
			 * Get the order of elements. Called once during initialization.
			 * @param   {Sortable}  sortable
			 * @returns {Array}
			 */
			get: function (sortable) {
				var order = useLocalStorage.getItem(
					sortable.options.group.name
				);
				return order ? order.split("|") : [];
			},

			/**
			 * Save the order of elements. Called onEnd (when the item is dropped).
			 * @param {Sortable}  sortable
			 */
			set: function (sortable) {
				var order = sortable.toArray();
				useLocalStorage.setItem(
					sortable.options.group.name,
					order.join("|")
				);
			},
		},
	});
}
