'use strict';

// Deklaracja zmiennych z html
const taskInput = document.querySelector('.input-new-task');
const btnAddTask = document.querySelector('.btn-add-task');
const modalMenu = document.querySelector('.modal-pop-up');
const overlay = document.querySelector('.overlay');
const inputModal = document.querySelector('.input-new-value');
const uncheckFinishedTasks = document.querySelector('.uncheck-done-task');
const checkAllTasks = document.querySelector('.check-all-tasks');
const deleteCheckedTasks = document.querySelector('.delete-checked-tasks');
const deleteList = document.querySelector('.delete-list');

//functionality of menu

// const editNameCategory = document.querySelector('.edit-name-list');

//ustawienie podstawowej funkcjonalności a więc dodawania tasków i odznaczania tasków jako zakończone

// Deklaracja zmiennych z html
const listOfTasks = document.querySelector('.list-of-tasks');
const nameActiveCategory = document.querySelector('.name-current-task');
const countOfTasksDone = document.querySelector('.count-of-tasks-done');
const countOfTasks = document.querySelector('.count-of-tasks');

//Add a todos variable in localStorage
let todos = JSON.parse(localStorage.getItem('todo-list')) || [];
let listOfCategory = JSON.parse(localStorage.getItem('todo-list-category')) || [];
//Lista kategorii tasków

let previousName;
let editId;
let isTaskNameEditing = false;
let activeCategory;

//zrobic co ma robic program przy braku zadnej listy

//Odświeżenie listy kategorii w menu
const reloadCategory = () => {
  const menuCategory = document.querySelector('.menu-category>ul>li>ul');
  let list = '';
  listOfCategory.forEach((e) => {
    list += `<li>
                <h3 onclick=updateActiveCategory(this)>${e}</h3>
              </li>`;
  });
  menuCategory.innerHTML = list;
};
reloadCategory();

//Aktualizacja aktywnej kategorii z menu
const updateActiveCategory = (category) => {
  activeCategory = category.innerHTML;
  nameActiveCategory.innerHTML = activeCategory;
  reloadTaskList();
};

const updateCountOfTasks = () => {
  if (typeof activeCategory != 'undefined') {
    let t1 = 0;
    let t2 = 0;
    t2 = todos.filter((e) => e.category === activeCategory);
    t1 = t2.filter((e) => e.isCompleted === true);
    countOfTasksDone.innerHTML = `${t1.length}/`;
    countOfTasks.innerHTML = t2.length;
  } else {
    countOfTasksDone.innerHTML = ``;
    countOfTasks.innerHTML = '';
  }
};
updateCountOfTasks();

const updateNameActiveCategory = () => {
  if (listOfCategory.length) {
    activeCategory = listOfCategory[0];
    nameActiveCategory.innerHTML = activeCategory;
  } else {
    activeCategory = undefined;
    nameActiveCategory.innerHTML = '';
  }
};

updateNameActiveCategory();

//Wpisywanie daty zakończenia taska
const dateFinishedTask = () => {
  const dateNow = new Date();
  const listOfDay = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
  const listOfMonth = ['st', 'lut', 'mrz', 'kw', 'maj', 'cz', 'lip', 'sier', 'wrz', 'paź', 'lis', 'gr'];
  //to co będzie wpisywane w zakończonym tasku
  const result = `Zakończone ${listOfDay[dateNow.getDay()]} ${dateNow.getDate()} ${
    listOfMonth[dateNow.getMonth()]
  } ${dateNow.getHours()}:${dateNow.getMinutes()}`;
  return result;
};

//Odświeżenie statusu dla taska zrobiony/niezrobiony
const updateStatus = (selectedTask) => {
  const nameElement = selectedTask.nextElementSibling.firstElementChild;
  const el = todos[selectedTask.parentElement.attributes.id.value];
  el.isCompleted ? (el.isCompleted = false) : (el.isCompleted = true);
  el.whenFinished ? (el.whenFinished = '') : (el.whenFinished = dateFinishedTask());
  reloadTaskList();
};

//Usuwanie taska
const deleteTask = (idTask) => {
  todos = todos.filter((e, i) => i != idTask);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  reloadTaskList();
};

//Zmiana nazwy dla taska
const editNameTask = (taskId, taskName) => {
  isTaskNameEditing = true;
  editId = taskId;
  previousName = taskName;
  taskInput.value = taskName;
  taskInput.classList.add('editing');
};

//Odświeżenie listy tasków
const reloadTaskList = () => {
  let list = '';
  todos.forEach((e, index) => {
    if (e.category === activeCategory) {
      let isCompleted = e.isCompleted === true ? 'checked' : '';
      list += `<div class="task" id=${index}>
        <input type="checkbox" onclick=updateStatus(this) ${isCompleted}>
        <div class="name-of-task">
          <h3 class="${isCompleted}">${e.name}</h3>
          <h4>${e.whenFinished}</h4>
        </div>
        <div class="settings">
          <i class="fa-solid fa-ellipsis"></i>
          <ul class="task-menu">
            <li onclick=editNameTask(${index},'${e.name}')><i class="fa-solid fa-pen"></i>Edytuj</li>
            <li onclick=deleteTask(${index})><i class="fa-solid fa-trash"></i>Usun</li>
          </ul>
        </div>
      </div>`;
    }
  });
  listOfTasks.innerHTML = list;
  updateCountOfTasks();
};
reloadTaskList();

//robocze
btnAddTask.addEventListener('click', reloadCategory);

//Adding tasks
const addTask = () => {
  let userTask = taskInput.value.trim();
  if (userTask && !isTaskNameEditing && typeof activeCategory != 'undefined') {
    taskInput.value = '';
    let taskInfo = { category: activeCategory, name: userTask, isCompleted: false, whenFinished: '' };
    todos.push(taskInfo);
  } else if (userTask && isTaskNameEditing) {
    isTaskNameEditing = false;
    taskInput.value = '';
    todos[editId].name = userTask;
    taskInput.classList.remove('editing');
  } else if (!userTask && isTaskNameEditing) {
    isTaskNameEditing = false;
    taskInput.value = '';
    todos[editId].name = previousName;
    taskInput.classList.remove('editing');
  }
  localStorage.setItem('todo-list', JSON.stringify(todos));

  reloadTaskList();
};

btnAddTask.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  e.key === 'Enter' ? addTask() : false;
});

//FUNKCJONALNOŚĆ DLA KAŻDEJ Z OPCJI W MENU

//Nowa lista
const btnAddNewCategory = document.querySelector('.add-new-list');

const showModal = () => {
  modalMenu.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const hideModal = () => {
  modalMenu.classList.add('hidden');
  overlay.classList.add('hidden');
};

overlay.addEventListener('click', hideModal);

btnAddNewCategory.addEventListener('click', () => {
  showModal();
  inputModal.focus();
  inputModal.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && inputModal.value.trim()) {
      let nameNewCategory = inputModal.value.trim();
      listOfCategory.push(nameNewCategory);
      localStorage.setItem('todo-list-category', JSON.stringify(listOfCategory));
      activeCategory = nameNewCategory;
      inputModal.value = '';
      hideModal();
      taskInput.focus();
      nameActiveCategory.innerHTML = activeCategory;
      reloadCategory();
      updateCountOfTasks();
      reloadTaskList();
    }
  });
});

//Closing modal window
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    inputModal.value = '';
    hideModal();
  }
  //dodoc koniec edycji nazwy taska po kliknieciu esc
  //dodac koniec edycji po nacisnieciu kursorem poza oknem
});

//Changing all task for uncompleted
uncheckFinishedTasks.addEventListener('click', () => {
  todos
    .filter((e) => e.category === activeCategory)
    .forEach((e) => {
      e.isCompleted = false;
      e.whenFinished = '';
    });
  reloadTaskList();
});

//Changing all task for completed
checkAllTasks.addEventListener('click', () => {
  todos
    .filter((e) => e.category === activeCategory)
    .forEach((e) => {
      e.isCompleted = true;
      e.whenFinished = dateFinishedTask();
    });
  reloadTaskList();
});

//Deleting finished tasks
deleteCheckedTasks.addEventListener('click', () => {
  todos = todos.filter((e, i) => e.category != activeCategory || (e.category === activeCategory && e.isCompleted === false));
  localStorage.setItem('todo-list', JSON.stringify(todos));
  reloadTaskList();
});

deleteList.addEventListener('click', () => {
  listOfCategory = listOfCategory.filter((e) => e != activeCategory);
  localStorage.setItem('todo-list-category', JSON.stringify(listOfCategory));
  todos = todos.filter((e) => e.category != activeCategory);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  updateNameActiveCategory();
  reloadCategory();
  reloadTaskList();
});
