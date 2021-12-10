const SeedData = require("./seed-data");
const deepCopy = require("./deep-copy");
const { sortTodoLists, sortTodos } = require("./sort");

module.exports = class SessionPersistence {
  constructor(session) {
    this.username = session.username;
    this._todoLists = session.todoLists || deepCopy(SeedData);
    session.todoLists = this._todoLists;
  }

  // Returns a copy of the todo list with the indicated ID. Returns `undefined`
  // if not found. Note that `todoListId` must be numeric.
  loadTodoList(todoListId) {
    let todoList = this._findTodoList(todoListId);
    return deepCopy(todoList);
  }

  // Returna a copy of the todo with the indicated ID in the indicated todo list.
  // Returns `undefined` if not found. Note that both `todoListId` and `todoId`
  // must be numeric.
  loadTodo(todoListId, todoId) {
  let todo = this._findTodo(todoListId, todoId);
  return deepCopy(todo);
};

  // Are all of the todos in the todo list done? If the todo list has at least
  // one todo and all of its todos are marked as done, then the todo list is
  // done. Otherwise, it is undone.
  isDoneTodoList(todoList) {
    return todoList.todos.length > 0 && todoList.todos.every(todo => todo.done);
  }

  // Does the todo list have any undone todos? Returns true if yes, false if no.
  hasUndoneTodos(todoList) {
    return todoList.todos.some(todo => !todo.done);
  }

  // Returns `true` if a todo list with the specified title exists in the list
  // of todo lists, `false` otherwise.
  existsTodoListTitle(title) {
    return this._todoLists.some(todoList => todoList.title === title);
  }

  // Returns `true` if `error` seems to indicate a `UNIQUE` constraint
  // violation, `false` otherwise.
  isUniqueConstraintViolation(_error) {
    return false;
  }

  // Changes the title of the todo list with the specified id. Returns `undefined`
  // if there is no list with that id.
  changeListTitle(todoListId, title) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return undefined;
    todoList.title = title;
  }

  createList(title) {
    let todoLists = this._todoLists;
    let sortedLists = deepCopy(todoLists).sort((listA, listB) => listA.id - listB.id);
    let listId = sortedLists[sortedLists.length - 1].id + 1;
    todoLists.push({
      id: listId,
      title,
      todos: []
    });
  }

  // Deletes the todo list with the specified id. If there is no list with that id,
  // it returns `undefined`.
  deleteList(todoListId) {
    let listIdx = this._todoLists.findIndex(todoList => todoList.id === todoListId);
    if (listIdx === -1) return undefined;
    this._todoLists.splice(listIdx, 1);
  }

  // Marks all todos in the specified todo list as done. Returns `undefined`
  // if the todo list doesn't exist.
  markAllDone(todoListId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return undefined;
    todoList.todos.forEach(todo => todo.done = true);
  }

  // Marks an undone todo as done
  markDoneTodo(todoListId, todoId) {
    let todo = this._findTodo(todoListId, todoId);
    if (todo) todo.done = true;
  }

  // Marks a done todo as undone
  markUndoneTodo(todoListId, todoId) {
    let todo = this._findTodo(todoListId, todoId);
    if (todo) todo.done = false;
  }

  // Adds a new todo object to the specified todo list with the passed-in
  // title. If the todo list doesn't exist, it returns `undefined`.
  addTodo(todoListId, todoTitle) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return undefined;
    let todoId = todoList.todos[todoList.todos.length - 1].id + 1;
    todoList.todos.push({
      id: todoId,
      title: todoTitle,
      done: false,
    });
  }

  // Delete the specified todo from the specified todo list. Returns `undefined`
  // if the todo or todo list doesn't exist. The id arguments must both be numeric.
  removeTodoAt(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return undefined;

    let todoIndex = todoList.todos.findIndex(todo => todo.id = todoId);
    if (todoIndex === -1) return undefined;

    todoList.todos.splice(todoIndex, 1);
  }

  // Return the list of todo lists sorted by completion status and title (case-
  // insensitive).
  sortedTodoLists() {
    let todoLists = deepCopy(this._todoLists);
    let undone = todoLists.filter(todoList => !this.isDoneTodoList(todoList));
    let done = todoLists.filter(todoList => this.isDoneTodoList(todoList));
    return sortTodoLists(undone, done);
  }

  // Return the list of todos sorted by completion status and title (case-
  // insensitive).
  sortedTodos(todoList) {
    let todos = deepCopy(todoList.todos);
    let undone = todos.filter(todo => !todo.done);
    let done = todos.filter(todo => todo.done);
    return sortTodos(undone, done);
  }

  // Returns a reference to the todo list with the indicated ID. Returns
  // `undefined` if not found. Note that `todoListId` must be numeric.
  _findTodoList(todoListId) {
    return this._todoLists.find(todoList => {
      return todoList.id === todoListId && username === this.username;
    });
  }

  // Returns a reference to the indicated todo in the indicated todo list.
  // Returns `undefined` if either the todo list or the todo is not found. Note
  // that both IDs must be numeric.
  _findTodo(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return undefined;

    return todoList.todos.find(todo => todo.id === todoId && username === this.username);
  }
};