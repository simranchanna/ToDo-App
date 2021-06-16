var today = new Date();
let options = { weekday: 'long', month: 'long', day: 'numeric' };
var day = today.toLocaleDateString("en-US",options);  
var header = document.querySelector(".header");
header.innerHTML = day;

var allTasks = localStorage.getItem("allTasks");

if(allTasks != null){
    allTasks = JSON.parse(allTasks);
    deleteExpiredTasks();
    var count0 = 0;
    var count1 = 0;
    var count2 = 0;
    for(var i=0; i<allTasks.length; i++){
        var date = new Date(allTasks[i].duedate);
        var diff = date.getDate() - today.getDate();
        if(allTasks[i].completed){
            continue;
        }
        if(diff == 0){
            count0++;
        }
        else if(diff == 1){
            count1++;
        }
        else if(diff == 2){
            count2++;
        }
    }
    if(count0 != 0){
        alert("You have " + count0 + " urgent tasks");
    }
    if(count1 != 0){
        alert("You have " + count1 + " tasks to be completed within 1 day");
    }
    if(count2 != 0){
        alert("You have " + count2 + " tasks to be completed within 2 day");
    }
    display();
}

function sortArray(){
    allTasks.sort(function (a, b){
        var date1 = new Date(a.duedate);
        var date2 = new Date(b.duedate);
        return (date1.getDate() - date2.getDate());
    })
}
function display(){
    sortArray();
    var list = document.querySelector(".list");
    list.innerHTML = "";
    for(var i=0; i<allTasks.length; i++){
        var task = document.createElement("div");
        task.classList.add("task");
        var taskName = document.createElement("div");
        taskName.classList.add("task-name");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        taskName.append(checkbox);
        taskName.innerHTML = taskName.innerHTML +  (i+1) + ". " + allTasks[i].taskname;
        if(allTasks[i].completed){
            taskName.style.textDecoration = "line-through";
        }
        var dueDate = document.createElement("div");
        dueDate.classList.add("due-date");
        var myDate = new Date(allTasks[i].duedate);
        var d = myDate.getDate();
        myDate = d + "/" + (myDate.getMonth()+1);
        dueDate.innerHTML = myDate;
        if(d - today.getDate() <= 2){
            task.style.color = "red";
        }
        task.append(taskName);
        task.append(dueDate); 
        list.append(task);
    }
    var checkbox = document.querySelectorAll(".checkbox");
    for(var i=0; i<checkbox.length; i++){
        checkbox[i].addEventListener("click", checkHandler.bind(this, i));
    }
    var tasks = document.querySelectorAll(".task");
    for(var i=0; i<tasks.length; i++){
        tasks[i].addEventListener("dblclick", deleteHandler.bind(this, i));
    }
}

var addBtn = document.querySelector(".add-btn");

addBtn.addEventListener("click", function(){
    var input = document.querySelector(".input");
    var inputTask = input.innerHTML;
    input.innerHTML = ""; 
    if(inputTask == ""){
        alert("Enter a valid task !!");
    }
    else {
        getDuedate(inputTask);
    } 
});

function getDuedate(inputTask){
    var modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = '<input class="input-date" type="date" /><button id="date-btn" type="submit">submit</button>';
    document.querySelector(".modal-container").append(modal);
    document.querySelector("#date-btn").addEventListener("click", function(){
        var dueDate = document.querySelector(".input-date");
        dueDate = new Date(dueDate.value);
        //adding in local storage
        var obj = {
            taskname : inputTask,
            duedate : dueDate,
            completed : false
        };
        if(allTasks == null){  //if there is no task in storage
            allTasks = [obj];
        }     
        else{
            allTasks.push(obj);
        }  
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        display();
        modal.remove();
    })
}

function checkHandler(i){
    if(allTasks[i].completed == true){
        allTasks[i].completed = false;
    }
    else{
        allTasks[i].completed = true;
    }
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    display();
}

function deleteExpiredTasks(){
    allTasks = allTasks.filter((task)=>{
        var dateoftask = new Date(task.duedate);
        return dateoftask.getDate() >= today.getDate();
    });
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function deleteHandler(i){
    allTasks = allTasks.filter((data, index)=>{
        return i != index;
    });
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    display();
}
