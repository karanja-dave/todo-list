
document.addEventListener('DOMContentLoaded', function () { //executs JS code after HTML code are executed
    const form = document.querySelector('form'); //selects the first element labelled form
    const input = document.getElementById('todo-input'); //selects element whose label is an id called todo-list
    const ul = document.querySelector('.todo-list ul');
    const itemsLeftP = document.querySelector('.todo p'); 
    const filterButtons = document.querySelectorAll('.filters button');
    const clearBtn = document.getElementById('clear-completed');

    let currentFilter = 'all'; //tracks which todos to show, either all, active, or completed

    // function for success messages
    function showAlert(message, type = "success") {
        // create a <div> element
        const alertBox = document.createElement("div");
        // define the alert class as either success/error
        alertBox.className = `alert ${type}`;
        // stores message of the alert box
        alertBox.textContent = message;
        //adds alert box to the html page as the last item
        document.body.appendChild(alertBox); 

        // removes alert box after 2.5 seconds
        setTimeout(() => {
            alertBox.remove();
        }, 2500); 
}


    // function counts tasks not completed, active todo's
    function updateItemsLeft() {
        // selects all todo-list not of class complete-
        const remaining = ul.querySelectorAll('li:not(.completed)').length;
        // counts the incompleted tasks
        itemsLeftP.textContent = `${remaining} items left`;
    }

    // creates a new todo list item for the page:with checkbox, text, and delete button
    function createTodoItem(text) {
        // created a <li> element
        const li = document.createElement('li');
        // specifies the class of the list item
        li.className = 'todo-item';

        // create checkbox
        const checkbox = document.createElement('input');
        // specifies the kind of input as checkbox 
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.setAttribute('aria-label', 'Mark todo complete');
        // in html the checkbox code would be like: 
        // <input type="checkbox" class="todo-checkbox" aria-label="Mark todo complete"></input>

        // create the <span> element
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = text;

        // creates the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.type = 'button';
        deleteBtn.setAttribute('aria-label', 'Delete todo');
        // tells JS to execute the string (in quotations) as HTML element
        deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        // adds the checkbox, span and delete btn inside the <li> item
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li;

        /**
         * in html this whole function represents 
         * 
         * <li>
         *    <input type="checkbox" class="todo-checkbox" aria-label="Mark todo complete"></input>
         *    <span class="todo-list">text</span> 
         *    <button class="delete-btn" type="button"><i class="fa-solid fa-xmark"></i></button>
         * </li?
         */
    }

    // functions filterss task as all, active(undone) completed(done)
    function applyFilter(filter) {
        //selects all lists adn stores them in items object
        const items = ul.querySelectorAll('li'); 
        // loop through items object (loops through each task in <ul> element)
        items.forEach(li => {
            // selects element labelled completed and stores it in isCompleted object
        const isCompleted = li.classList.contains('completed');

        if (filter === 'all') {
            li.style.display = '';
            /**
             * display in css has 3 arguments; block, inline and none
             * display='' tell js to use an elements default display which can be either inline or block etc
             */
        } else if (filter === 'active') {
            li.style.display = isCompleted ? 'none' : '';
            /** the isCompleted ? 'none' : '' is just a compact if/else statement we can have us
             * if (isCompleted) {
                li.style.display = 'none';
                } else {
                li.style.display = '';
                }
             */
        } else if (filter === 'completed') {
            li.style.display = isCompleted ? '' : 'none';
        }
        });
    }

    // submit btn functionality
    /**
     *listens for a submit event(press enter or click submit btn)
     *js executes function when event happens
     */
    form.addEventListener('submit', function (e) {
        //prevent form from reloading page when submit btn is clicked
        e.preventDefault();
        // take user input on form and stores it in value
        // .trim() removes extra spaces user might have add at start/end or text
        const value = input.value.trim();
        // tell js to call and execute the createTodoItem and store its result in li obj
        const li = createTodoItem(value);
        // append the li object to the unordered list
        ul.appendChild(li);
        // clear form for next input
        input.value = '';
        // tell js to call the 'updateItemsLeft' function to ensure new task is counted as incomplete
        updateItemsLeft();
        // tell js to call the applyFilter function to categorize the task appropriately
        //in this case as active (incomplete)
        applyFilter(currentFilter); 
        // tell js to call the showAlert fun and execute the text in quotes as an alert message
        showAlert("Task added successfully!", "success");

    });

    // listens for clicks on the <ul> element 
    ul.addEventListener('click', function (e) {
        const li = e.target.closest('li');
        if (!li) return;

        // delete button functionality
        if (e.target.closest('.delete-btn')) {
            Swal.fire({
                title: 'Delete task?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete',
                confirmButtonColor:'red',
                cancelButtonText: 'Cancel',
                cancelButtonColor:'green'
            }).then((result) => {
                if (result.isConfirmed) {
                    li.remove();
                    updateItemsLeft();
                    showAlert("Task Deleted!", "error");
                }
            });
            return;
}

            

        // checkbox functionality
    if (e.target.matches('.todo-checkbox')) {
        const checked = e.target.checked;
        li.classList.toggle('completed', checked);
        updateItemsLeft();
        applyFilter(currentFilter);
        if (checked) {
            showAlert("Task marked as complete!", "success");
        } else {
            showAlert("Task unmarked", "error");
        }
        return;
    }

    // ✏️ Editable text functionality
    if (e.target.matches('.todo-text')) {
        const span = e.target;
        const currentText = span.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = currentText;

        // Replace span with input
        span.replaceWith(input);
        input.focus();

        const saveEdit = () => {
            const newText = input.value.trim();
            const newSpan = document.createElement('span');
            newSpan.className = 'todo-text';
            newSpan.textContent = newText || currentText; // Fallback to original if empty
            input.replaceWith(newSpan);
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                input.blur(); // Triggers blur to save
            }
        });

        return;
    }

        
    });

    // filter buttons functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active')); // UI active state
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        applyFilter(currentFilter);
        });
    });

    
    // clear btn functionality 
    clearBtn.addEventListener('click', function () {
    // get all completed tasks
    const completed = ul.querySelectorAll('li.completed');
    // if no completed tasks, show error alert
    if (completed.length === 0) {
        showAlert("No completed tasks to clear!", "error");
        return;
    }
    // confirm with SweetAlert2 before clearing
    Swal.fire({
        title: 'Are you sure?',
        text: "This will remove all completed tasks!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor:'red',
        cancelButtonText: 'Cancel',
        cancelButtonColor: 'green'
    }).then((result) => {
        if (result.isConfirmed) {
            completed.forEach(li => li.remove());
            updateItemsLeft();
            showAlert("All completed tasks cleared", "success");
        }
    });
});


    
    updateItemsLeft();
    const defaultBtn = document.querySelector('[data-filter="all"]');
    if (defaultBtn) defaultBtn.classList.add('active');

const switchBtn = document.getElementById("switch");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

// Check and apply saved theme on load
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.remove("light");
    themeIcon.src = "images/icon-sun.svg"; // shows sun when in dark mode (to switch to light)
} else {
    body.classList.add("light");
    themeIcon.src = "images/icon-moon.svg"; // shows moon when in light mode (to switch to dark)
}

// Toggle theme on button click
switchBtn.addEventListener("click", () => {
    body.classList.toggle("light");

    if (body.classList.contains("light")) {
        themeIcon.src = "images/icon-moon.svg";
        localStorage.setItem("theme", "light");
    } else {
        themeIcon.src = "images/icon-sun.svg";
        localStorage.setItem("theme", "dark");
    }
});
;
});
