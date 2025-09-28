
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const input = document.getElementById('todo-input');
  const ul = document.querySelector('.todo-list ul');
  const itemsLeftP = document.querySelector('.todo p'); 
  const filterButtons = document.querySelectorAll('.filters button');
  const clearBtn = document.getElementById('clear-completed');

  let currentFilter = 'all';

 
  function updateItemsLeft() {
    const remaining = ul.querySelectorAll('li:not(.completed)').length;
    itemsLeftP.textContent = `${remaining} items left`;
  }

  
  function createTodoItem(text) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.setAttribute('aria-label', 'Mark todo complete');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', 'Delete todo');
    deleteBtn.textContent = '✖';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
  }

  
  function applyFilter(filter) {
    const items = ul.querySelectorAll('li');
    items.forEach(li => {
      const isCompleted = li.classList.contains('completed');
      if (filter === 'all') {
        li.style.display = '';
      } else if (filter === 'active') {
        li.style.display = isCompleted ? 'none' : '';
      } else if (filter === 'completed') {
        li.style.display = isCompleted ? '' : 'none';
      }
    });
  }

 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) {
      alert('Please enter a todo');
    }
    const li = createTodoItem(value);
    ul.appendChild(li);
    input.value = '';
    updateItemsLeft();
    applyFilter(currentFilter); 
  });

 
  ul.addEventListener('click', function (e) {
    const li = e.target.closest('li');
    if (!li) return;

    // delete button clicked
    if (e.target.matches('.delete-btn')) {
      if (confirm('Delete this todo?')) {
        li.remove();
        updateItemsLeft();
      }
      return;
    }

    // checkbox toggled
    if (e.target.matches('.todo-checkbox')) {
      const checked = e.target.checked;
      li.classList.toggle('completed', checked);
      updateItemsLeft();
      applyFilter(currentFilter);
      return;
    }

    // clicking the text toggles the checkbox 
    if (e.target.matches('.todo-text')) {
      const cb = li.querySelector('.todo-checkbox');
      cb.checked = !cb.checked;
      li.classList.toggle('completed', cb.checked);
      updateItemsLeft();
      applyFilter(currentFilter);
      return;
    }
  });

  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      filterButtons.forEach(b => b.classList.remove('active')); // UI active state
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      applyFilter(currentFilter);
    });
  });

 
  clearBtn.addEventListener('click', function () {
    // remove all li.completed
    const completed = ul.querySelectorAll('li.completed');
    completed.forEach(li => li.remove());
    updateItemsLeft();
  });

  
  updateItemsLeft();
  const defaultBtn = document.querySelector('[data-filter="all"]');
  if (defaultBtn) defaultBtn.classList.add('active');
});
