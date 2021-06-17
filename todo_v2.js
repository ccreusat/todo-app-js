(function () {
	"use strict";

	window.todoApp = function () {
		let todos = useLocalStorage.getItem("todos") || [
			{
				id: 1,
				text: "up",
				isCompleted: false,
			},
			{
				id: 2,
				text: "up",
				isCompleted: false,
			},
			{
				id: 3,
				text: "down",
				isCompleted: false,
			},
			{
				id: 4,
				text: "down",
				isCompleted: false,
			},
			{
				id: 5,
				text: "left",
				isCompleted: false,
			},
			{
				id: 6,
				text: "right",
				isCompleted: false,
			},
			{
				id: 7,
				text: "left",
				isCompleted: false,
			},
			{
				id: 8,
				text: "right",
				isCompleted: false,
			},
			{
				id: 9,
				text: "B",
				isCompleted: false,
			},
			{
				id: 10,
				text: "A",
				isCompleted: false,
			},
		];

		var app = {
			config: {
				inputTrigger: document.getElementById("add-todo"),
				checkboxTrigger: document.getElementById("add-checkbox"),
				formTrigger: document.getElementById("todo-form"),
				todoListTrigger: document.getElementById("todoList"),
				filterByCompletedTrigger:
					document.getElementById("filter-completed"),
				filterByActiveTrigger: document.getElementById("filter-active"),
				clearTrigger: document.getElementById("clear"),
				filterByAllTrigger: document.getElementById("filter-all"),
				countTrigger: document.getElementById("count"),
				footerTrigger: document.getElementById("footer"),
			},
			init: function () {
				// PREvENT DEFAULT FORM SUBMIT
				app.config.formTrigger.onsubmit = e => e.preventDefault();

				// If Todos exists, create every todo and show footer element
				if (todos) {
					todos.forEach(todo => {
						app.createAndUpdateTodo(
							todo.id,
							todo.text,
							todo.isCompleted
						);
					});
					app.showHideFooter(todos);
				}
				// init sortableJS
				app.sortableTodos();

				// Handlers to add todo
				app.config.inputTrigger.addEventListener("keyup", function (e) {
					if (e.key === 13 || e.key === "Enter") {
						app.addNewTodo(e);
					}
				});

				app.config.checkboxTrigger.onclick = e => app.addNewTodo(e);

				// Handles to filter By
				app.config.filterByCompletedTrigger.onclick = () =>
					app.filterCompleted();
				app.config.filterByActiveTrigger.onclick = () =>
					app.filterActive();
				app.config.filterByAllTrigger.onclick = () => app.filterAll();
				app.config.clearTrigger.onclick = () => app.clearTodo();

				// Display todos left
				app.countItems(todos);
			},
			createAndUpdateTodo: function (id, value, isCompleted) {
				const todoElement = document.createElement("div");
				const labelElement = document.createElement("label");
				const checkboxElement = document.createElement("input");
				const textElement = document.createElement("span");
				const deleteTodoButton = document.createElement("span");

				// We create each element of a todo, assign class, type, value, etc
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

				// handle click on label to complete or not a todo
				labelElement.addEventListener("click", function () {
					if (checkboxElement.checked === true) {
						checkboxElement.checked = true;
						app.updateTodo(value, true);
						todoElement.className += " completed";
					} else {
						checkboxElement.checked = false;
						app.updateTodo(value, false);
						todoElement.className = "todo";
					}

					useLocalStorage.setItem("todos", todos);
					app.countItems(todos);
					app.showHideFooter(todos);
				});

				// handle remove todo from array and list
				deleteTodoButton.addEventListener("click", function (e) {
					e.target.parentElement.remove();
					todos = todos.filter(todo => todo.text !== value);

					if (todos.length === 0) {
						useLocalStorage.removeItem("todos");
						app.showHideFooter();
					}
				});

				// we add all the elements to the list
				todoElement.appendChild(labelElement);
				todoElement.appendChild(deleteTodoButton);
				labelElement.appendChild(checkboxElement);
				labelElement.appendChild(textElement);

				app.config.todoListTrigger.appendChild(todoElement);
			},
			addNewTodo: function (e) {
				e.preventDefault();
				// We check if the input to add a todo is not empty
				// We create the todo with the function
				// We add the new todo object to the Array
				// We count the items left,
				// We show the footer
				// We save the new array to the storage
				// We put back the initial value to empty
				if (app.config.inputTrigger.value !== "") {
					let target = app.config.inputTrigger.value;
					let id = app.generateRandomID();

					app.createAndUpdateTodo(id, target);

					todos = [
						...todos,
						{
							id: id,
							text: target,
							isCompleted: false,
						},
					];

					app.countItems(todos);
					app.showHideFooter(todos);

					useLocalStorage.setItem("todos", todos);
					app.config.inputTrigger.value = "";
				}
			},
			updateTodo: function (text, isCompleted) {
				const index = todos.findIndex(todo => todo.text === text);
				// handle completed task and update it by true or false
				todos[index].isCompleted = isCompleted;
			},
			showHideFooter: function (arr) {
				// If Array is empty we hide the footer
				// otherwise we show it.
				if (arr.length === 0 || !arr) {
					app.config.footerTrigger.style.display = "none";
				} else {
					app.config.footerTrigger.style.display = "flex";
				}
			},
			generateRandomID: function () {
				return Math.random().toString(36).substr(2, 9);
			},
			filterCompleted: function () {
				// We filter the todo to show the completed ones.
				let completedTodos = todos.filter(
					todo => todo.isCompleted === true
				);

				// If we haven't completed todos, we show a text
				if (!completedTodos.length) {
					const text = document.createElement("p");
					text.textContent = "No todo completed yet!";
					text.className = "none-completed";
					app.config.todoListTrigger.appendChild(text);
				}

				todoList.querySelectorAll(".todo").forEach(todo => {
					if (!todo.querySelector("input").checked) {
						todo.style.display = "none";
					} else {
						todo.style.display = "flex";
					}
				});
			},
			filterActive: function () {
				// We filter the todo to show the ative ones.

				if (document.querySelector(".none-completed")) {
					document.querySelector(".none-completed").remove();
				}

				app.config.todoListTrigger
					.querySelectorAll(".todo")
					.forEach(todo => {
						todo.style.display = "none";
						if (!todo.querySelector("input").checked) {
							todo.style.display = "flex";
						}
					});
			},
			filterAll: function () {
				// We reset the filter and show all the todos

				if (document.querySelector(".none-completed")) {
					document.querySelector(".none-completed").remove();
				}

				app.config.todoListTrigger
					.querySelectorAll(".todo")
					.forEach(todo => {
						todo.style.display = "flex";
					});
			},
			clearTodo: function () {
				// We clear all the completed todos
				let activeTodos = todos.filter(
					todo => todo.isCompleted === false
				);

				todos = activeTodos;
				app.config.todoListTrigger.innerHTML = "";
				todos.forEach(todo => {
					app.createAndUpdateTodo(
						todo.id,
						todo.text,
						todo.isCompleted
					);
				});

				// We save the new state of Todos Array
				useLocalStorage.setItem("todos", todos);
				app.sortableTodos();
				app.config.filterByCompletedTrigger.checked = false;
				app.config.filterByAllTrigger.checked = true;

				app.showHideFooter(todos);
			},
			countItems: function (arr) {
				const countTodoLeft = arr.filter(
					todo => todo.isCompleted === false
				);

				app.config.countTrigger.innerHTML =
					countTodoLeft.length + " items left";
			},
			sortableTodos: function () {
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
			},
		};

		if (app) {
			app.init();
		}
	};
})();
