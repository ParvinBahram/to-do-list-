
// global variables:

let filterValue = "all";

// select:
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list")
const selectFilter = document.querySelector(".filter-todos");  

// events:
todoForm.addEventListener("submit",addNewTodo);
selectFilter.addEventListener("change",(e)=>{
  filterValue = e.target.value;
  FilterTodos();
})

document.addEventListener("DOMContentLoaded",(e)=>{
  const todos = getAllTodos();
  CreateTodos(todos);
})

// functions:
function addNewTodo (e){
e.preventDefault();
if (!todoInput.value) return null;
const newTodo = {
    id : Date.now(),
    createdAt : new Date().toISOString(),
    title : todoInput.value,
    isCompleted : false,
};
saveTodo(newTodo);
FilterTodos()
}


function CreateTodos(todos){
let result = "";
todos.forEach((todo) => {
result+= `<li class="todo">
<p class="todo__title ${todo.isCompleted ? "completed" : ""} ">${todo.title}</p>
<span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString("fa-IR")}</span>
<button class="todo__check" data-todo-id=${todo.id} ><i class="far fa-check-square"></i></button>
<button class="todo__remove" data-todo-id=${todo.id} ><i class=" far fa-trash-alt"></i></button>
<button class ="todo__edit" data-todo-id=${todo.id} ><i class="fas fa-pen"></i></button>
</li>`;
});
  todoList.innerHTML = result;
   todoInput.value = "";
  const removeBtn = [...document.querySelectorAll(".todo__remove")];
  removeBtn.forEach((btn)=> btn.addEventListener("click", RemoveTodo));

  const checkBtn = [...document.querySelectorAll(".todo__check")];
  checkBtn.forEach((btn)=> btn.addEventListener("click", CheckTodo))

  const editBtn = [...document.querySelectorAll(".todo__edit")];
  editBtn.forEach((btn)=> btn.addEventListener("click", EditTodo));
}


function FilterTodos(){
 
  const todos = getAllTodos()
  switch(filterValue){
    case "all" :{
      CreateTodos(todos);
      break;
    }
    case "completed" : {
      const filteredTodos =todos.filter((todo)=> todo.isCompleted);
      CreateTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos =todos.filter((todo)=> !todo.isCompleted);
      CreateTodos(filteredTodos);
      break;  
    }
    default: CreateTodos(todos)
  }
}

function RemoveTodo(e){
  let todos = getAllTodos();
  const todoId= Number(e.target.dataset.todoId);
  todos = todos.filter((todo)=> todo.id !== todoId);
  saveAllTodos(todos);
  FilterTodos();
}

function CheckTodo (e){
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t)=> t.id === todoId );
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  FilterTodos();

}


function getAllTodos(){
  const savedTodos =JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo){
  const savedTodos = getAllTodos()
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodos(todos){
  localStorage.setItem("todos",JSON.stringify(todos));
}


function EditTodo(e){
  const todoId = Number(e.currentTarget.dataset.todoId);
  const todoItem = e.currentTarget.closest(".todo");

  if (!todoItem) return;

  const titleP = todoItem.querySelector(".todo__title");
    if (!titleP) return;

    const originalText = titleP.textContent.trim();
    const wasCompleted = titleP.classList.contains("completed");

    const input = document.createElement('input');
    input.type = 'text';

    input.className = "todo__title todo__edit-input" ;
    input.value = originalText ;
    input.setAttribute("aria-label" , "ویرایش عنوان تودو");

    titleP.replaceWith(input);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    let canceled = false ;

    const finishEdit = (save)=> {
      if(save && !canceled ){
        saveEditedTodo(todoId, input.value.trim())
      }else{
        const p = document.createElement('p');
        p.className = "todo__title" + (wasCompleted ? " completed " : "");
        p.textContent = originalText;
        input.replaceWith(p);
      }
    }

    input.addEventListener('keydown', (ev) => {
      if(ev.key === 'Escape'){
        canceled =true;
        finishEdit(false);
      } 
      else if(ev.key === 'Enter') finishEdit(true);
    });

    input.addEventListener('blur', ()=>{
      finishEdit(true);
    });
}

function saveEditedTodo(todoId, newTitle){
  if (!newTitle) return FilterTodos();

  const todos = getAllTodos();
  
  const todo = todos.find((t) => t.id === todoId);
  if(!todo) return ;

  todo.title = newTitle;

  saveAllTodos(todos);

  FilterTodos();
}