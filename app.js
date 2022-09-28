/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
// Part A: import create todo
import {
    createTodo,
    // Part B: import get todos
    getTodos,
    // Part C: import complete todos
    completeTodo,
    // Part D: import delete all function
    deleteAllTodos,
} from '/fetch-utils.js';
import { renderTodo } from './render-utils.js';

/* Get DOM Elements */
const addTodoForm = document.getElementById('add-todo-form');
const removeButton = document.getElementById('remove-button');
const errorDisplay = document.getElementById('error-display');
const todoList = document.getElementById('todo-list');

/* State */
let todos = [];
let error = null;

/* Events */

window.addEventListener('load', async () => {
    // > Part B: Add a click event listener for the todoEl
    //      - call the async supabase function to get todos
    const response = await getTodos();
    //      - set the todos and error state from the response
    todos = response.data;
    error = response.error;
    //      - if there's an error call displayError
    if (error) {
        displayError();
    }
    //      - otherwise, display the todos
    if (todos) {
        displayTodos();
    }
});

addTodoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addTodoForm);
    const newTodo = {
        description: formData.get('description'),
    };

    // > Part A: Call the function to create a todo, passing in "newTodo":
    const response = await createTodo(newTodo);
    error = response.error;
    const todo = response.data;

    if (error) {
        displayError();
    } else {
        todos.push(todo);
        displayTodos();
        addTodoForm.reset();
    }
});

removeButton.addEventListener('click', async () => {
    // > Part D: Call the async supabase function to delete all todos
    const response = await deleteAllTodos();
    error = response.error;

    if (error) {
        displayError();
    } else {
        // > Part D: reset todos state to an empty array:
        todos = [];
        displayTodos();
    }
});

/* Display Functions */

function displayError() {
    if (error) {
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}

function displayTodos() {
    todoList.innerHTML = '';

    for (const todo of todos) {
        const todoEl = renderTodo(todo);
        todoList.append(todoEl);

        // > Part C: Add a click event listener for the todoEl
        //      - call the async supabase function to delete all todos
        //        and get the response
        todoEl.addEventListener('click', async () => {
            const response = await completeTodo(todo.id);
            error = response.error;
            const updateTodo = response.data;

            //      - if there's an error, set error state and call displayError
            if (error) {
                displayError();
                //      - otherwise:
            } else {
                //          - find the index of todo in todos
                const index = todos.indexOf(todo);
                //          - update that index of todos with the response data
                todos[index] = updateTodo;
                //          - redisplay the todos
                displayTodos();
            }
        });
    }
}
