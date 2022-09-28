export function renderTodo(todo) {
    const li = document.createElement('li');

    // if the todo is complete
    if (todo.complete) {
        li.classList.add('complete');
    }
    // > Part C: Conditionally add a "complete" class to the li

    const p = document.createElement('p');
    p.textContent = todo.description;
    li.append(p);

    return li;
}
