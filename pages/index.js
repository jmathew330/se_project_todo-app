import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

// DOM elements
const addTodoButton = document.querySelector(".button_action_add");
const addTodoForm = document.forms["add-todo-form"];

// Instantiate TodoCounter
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

// Instantiate and configure the "Add Todo" popup form
const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (values) => {
    const name = values.name;
    const dateInput = values.date;

    // Ensure proper date formatting
    const date = new Date(dateInput);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const id = uuidv4();

    const newTodo = { name, date, id, completed: false };

    renderTodo(newTodo);
    addTodoForm.reset();
    newTodoValidator.resetValidation();
    addTodoPopup.close();

    // Update the todo counter
    todoCounter.updateTotal(true); // Increment the total count
  },
});

addTodoPopup.setEventListeners();

// Handle the completion of a todo
function handleCheck(completed) {
  todoCounter.updateCompleted(completed); // Pass the completion status
}

// Handle deletion of a todo
function handleDelete(completed) {
  if (completed) {
    todoCounter.updateCompleted(false); // Decrement the completed count if the todo was completed
  }
  todoCounter.updateTotal(false); // Decrement the total count when a todo is deleted
}

// Function to generate a todo item
const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", handleCheck, handleDelete);
  const todoElement = todo.getView();
  return todoElement;
};

// Section to hold todos
const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todo = generateTodo(item);
    section.addItem(todo);
  },
  containerSelector: ".todos__list",
});

section.renderItems();

// Open the add todo popup when the button is clicked
addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

// Function to render a new todo
const renderTodo = (item) => {
  if (!item.name || !item.date) {
    return;
  }
  const todo = generateTodo(item);
  section.addItem(todo);
  todoCounter.updateTotal(true); // Increment total count when a new todo is added
  todoCounter.updateCompleted(item.completed); // Update the completed count if necessary
};

// Instantiate and enable form validation
const newTodoValidator = new FormValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();
