var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#task-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler  = function() {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if inputs are empty ( validate)
    if (taskNameInput === "" || taskTypeInput === "") {
        alert("You need to fill out the task form!");
        return false;
    }

      // reset form fields for next task to be entered
     document.querySelector("input[name='task-name']").value = "";
     document.querySelector("select[name='task-type']").selectedIndex = 0;
      
     // check if task is new pr one being edited by seeing if it has data-task-id attribute 
     var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to compete edit process 
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute , so create object as normal and pass createTaskEl function
    else {
        // Package up data as an object 
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    // send it as an argument to createTaskEL
    createTaskEl(taskDataObj);
   }  
};

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = 'task-item';
     // add task id as a custom attribute 
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    // add HTML content to div 
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
     listItemEl.appendChild(taskInfoEl);

    // create task action (buttons and select) for task
     var taskActionsEl = createTaskActions(taskIdCounter);
     listItemEl.appendChild(taskActionsEl);

    // add entire list items to list 
    tasksToDoEl.appendChild(listItemEl); 
    // increase task counter for next unique id 
    taskIdCounter++;
};


var createTaskActions = function(taskId) {
    // create container to hold elements
     var actionContainerEl = document.createElement("div");
     actionContainerEl.className = "task-action";
        // create edit button
        var editButtonEL = document.createElement("button");
        editButtonEL.textContent = "Edit";
        editButtonEL.className = "btn edit-btn";
        editButtonEL.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(editButtonEL);

        // create delete button
        var deleteButtonEL = document.createElement("button");
        deleteButtonEL.textContent = "Delete";
        deleteButtonEL.className = "btn delete-btn";
        deleteButtonEL.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(deleteButtonEL);
        // create change status dropdown
        var statusSelectEl = document.createElement("select");
        statusSelectEl.setAttribute("name", "status-change");
        statusSelectEl.setAttribute("data-task-is", taskId);
        statusSelectEl.className = "select-status";
        actionContainerEl.appendChild(statusSelectEl);

        // create status option

        var statusChoices = ["To DO", "In Progress", "Completed"];

        for (var i = 0; i < statusChoices.length; i++) {
            // create option element 
            var statusOptionEl = document.createElement("option");
            statusOptionEl.setAttribute("value", statusChoices[i]);
            statusOptionEl.textContent = statusChoices[i];
            

            //append to select
            statusSelectEl.appendChild(statusOptionEl);
        }

        return actionContainerEl;
    };


 var completeEditTask = function(taskName, taskType, taskId) {
        // find t task list item  with taskId value
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
        //set new values 
        taskSelected.querySelector("h3.task-name").textContent = taskName;
        taskSelected.querySelector("span.task-type").textContent = taskType;
    
        alert("Task Updated!");
        formEl.removeAttribute("data-task-id");
        document.querySelector("#save-task").textContent = "Add Task";
    };

var taskButtonHandler = function(event) {
        // get target element from event
        var targetEl = event.target;
   
        // edit button was clicked 
        if (targetEl.matches(".edit-btn")) {
            console.log("edit", targetEl);
            var taskId = targetEl.getAttribute("data-task-id");
            editTask(taskId);
        }
        else if (targetEl.matches(".delete-btn")) {
            console.log("delete", targetEl)
           // get the element's task id 
           var taskId = event.target.getAttribute("data-task-id");
           deleteTask(taskId);
       }
   };

var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);
    
    // find task list item based on event.target's data -task-id attribute
    var taskId = event.target.getAttribute("data-task-id");


    // get the currently selected option's value and convert to lowercase (convert)
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
      } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
      } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
      }
};

var editTask = function(taskId) {
    console.log(taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);
    
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // write values of taskName and taskType tp form to be edited 
    document.querySelector("input[name='task-name'").value = taskName;
    document.querySelector("select[name='task-type'").value = taskType;

    //set data attribute to the form with a value of the task's id sp it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);

    // update form's button to reflect editing a task rather than creating a new one
    formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function(taskId) {
    console.log(taskId);
    // find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

// create new task 
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

