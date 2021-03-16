  // For our purposes, we can keep the current month in a variable in the global scope
 var currentMonth = new Month(2021, 2); // March 2021
 var cal = document.getElementById("main-cal");

 var currentYear = 2021;



 document.getElementById("month_year").innerHTML = monthName(currentMonth.month) + " " + currentMonth.year;


 // Change the month when the "next" button is pressed
     document.getElementById("next_month_btn").addEventListener("click", function(event){
         currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
         updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
     }, false);

     // Change the month when the "previous" button is pressed
     document.getElementById("prev_month_btn").addEventListener("click", function(event){
         currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
         updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
     }, false);



 // This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
 // it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
 function updateCalendar(){
     datesarray = [];
     timesarray = [];
     titlesarray = [];
     tagsarray = [];
     alldayarray = [];
     countarray = [];

     document.getElementById("month_year").innerHTML = monthName(currentMonth.month) + " " + currentMonth.year;
     var cal = document.getElementById("main-cal");

     for(var i=cal.childNodes.length-1; i>=2; i--){
         cal.removeChild(cal.childNodes[i]);
     }
    

     fetch("event_ajax.php", {
             method: 'POST',
             headers: { 'content-type': 'application/json' }
         })
         .then(response => response.json())
         .then(data => {
             title = data.title;
             datetime = data.datetime;
             tag = data.tag;
             allday = data.allday;
             count = data.count;

             for (var i = 0; i<datetime.length; i++) {
                 //https://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format
                  // Split timestamp into [ Y, M, D, h, m, s ]
                 var t = datetime[i].split(/[- :]/);
                 // Apply each element to the Date function
                 var d = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);

                 //https://stackoverflow.com/questions/29042911/how-do-i-split-the-date-and-time-into-two-elements
                 datesarray[i] = d.toLocaleDateString();
                 timesarray[i]= d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
                 titlesarray[i] = title[i];
                 tagsarray[i] = tag[i];
                 alldayarray[i] = allday[i];
                 countarray[i] = count[i];
             }

             var weeks = currentMonth.getWeeks();



             for(var i=0; i<weeks.length; i++){
                 var tr = document.createElement("tr");
                 tr.classList.add("row");


                 for(var j=0; j<weeks[i].getDates().length; j++){
                     var td = document.createElement("td");
                     var num = document.createElement("div");
                     num.classList.add("datenum");
                     num.innerHTML = weeks[i].getDates()[j].getDate();
                     td.appendChild(num);


                     for(var k=0; k<datesarray.length; k++){
                         if (weeks[i].getDates()[j].toLocaleDateString() == datesarray[k]){

                             var event_div = document.createElement("div");
                             event_div.classList.add("event_div");
                             event_div.classList.add(tagsarray[k]);
                             
                             event_div.setAttribute("id", countarray[k]);
                             //TITLE
                             var event_title = document.createElement("p");
                             event_title.classList.add("event_title");
                             event_title.innerHTML = titlesarray[k];
                             //TIME
                             var event_time = document.createElement("p");
                             event_time.classList.add("event_time");
                             if (alldayarray[k]) {
                                event_time.innerHTML = "All Day";
                             }
                             else {
                                event_time.innerHTML = timesarray[k];
                             }
                            
                            //buttons for edit and delete
                             var button_divs = document.createElement("div");
                             button_divs.classList.add("button_divs");

                             var delete_button = document.createElement("button");
                             delete_button.classList.add("delete_event_button");
                             delete_button.innerHTML = '<i class="far fa-trash-alt"></i>';


                             var edit_button = document.createElement("button");
                             edit_button.classList.add("edit_event_button");
                             edit_button.innerHTML = '<i class="far fa-edit"></i>';

                             td.classList.add(datesarray[k]);
                             
                             button_divs.appendChild(delete_button);
                             button_divs.appendChild(edit_button);

                             event_div.appendChild(event_title);
                             event_div.appendChild(event_time);
                             event_div.appendChild(button_divs);
                             td.appendChild(event_div);
                         }
                     }
                     tr.appendChild(td);
                 }
                 cal.appendChild(tr);
             }

            var delete_event_array = document.getElementsByClassName("delete_event_button");
            for(var m=0; m<delete_event_array.length; m++){
                delete_event_array[m].addEventListener("click", deleteEventAjax, false);
            }

            var edit_event_array = document.getElementsByClassName("edit_event_button");
            for(var n=0; n<edit_event_array.length; n++){
                edit_event_array[n].addEventListener("click", display_edit, false);
            }

            filterTag();

        })
         .catch(err => console.error(err)); 
 }

 function monthName(month){
     if(currentMonth.month == 0){
         return "January";
     }
     else if(currentMonth.month == 1){
         return "February";
     }
     else if(currentMonth.month == 2){
         return "March";
     }
     else if(currentMonth.month == 3){
         return "April";
     }
     else if(currentMonth.month == 4){
         return "May";
     }
     else if(currentMonth.month == 5){
         return "June";
     }
     else if(currentMonth.month == 6){
         return "July";
     }
     else if(currentMonth.month == 7){
         return "August";
     }
     else if(currentMonth.month == 8){
         return "September";
     }
     else if(currentMonth.month == 9){
         return "October";
     }
     else if(currentMonth.month == 10){
         return "November";
     }
     else if(currentMonth.month == 11){
         return "December";
     }
 }


document.getElementById("newuser_btn").addEventListener("click", newUserAjax, false); 
document.getElementById("login_btn").addEventListener("click", loginAjax, false);
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false);
document.getElementById("submit_event").addEventListener("click", newEventAjax, false);
document.getElementById("submit_edited_event").addEventListener("click", editEventAjax, false);
document.getElementById("create_btn").addEventListener("click", displayCreate, false);
document.getElementById("cancel_event").addEventListener("click", cancelEvent, false);
document.getElementById("cancel_edit_event").addEventListener("click", cancelEditEvent, false);
document.getElementById("filter-colors").addEventListener("change", filterTag, false);
document.getElementById("year-view-button").addEventListener("click", viewYear, false);
document.getElementById("return-to-current").addEventListener("click",returnToLast, false);
document.getElementById("allday").addEventListener("change", allDayCheck, false);
document.getElementById("allday_edit").addEventListener("change", allDayCheck_edit, false);

//event listener for calendar buttons to go from yearly view to monthly view
var monthBtnArray = document.getElementsByClassName("month-btn");
for(var a=0; a<monthBtnArray.length; a++){
    monthBtnArray[a].addEventListener("click", viewMonth, false);
}


var token;

window.addEventListener('DOMContentLoaded',  checkSession);

function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("username").value= "";
            document.getElementById("password").value= "";
            if(data.success) {
                loggedIn(username);
                token = data.token;
                document.getElementById("login_failure").innerHTML = "";
            }
            else{
                document.getElementById("login_failure").innerHTML = data.message;
            }
        })
        .catch(err => console.error(err));
}


function newUserAjax(event) {
    const newUsername = document.getElementById("newUsername").value; // Get the username from the form
    const newPassword = document.getElementById("newPassword").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'newUsername': newUsername, 'newPassword': newPassword};

    fetch("newUser_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("newUsername").value= "";
            document.getElementById("newPassword").value= "";
            if(data.success) {
                document.getElementById("user_success").innerHTML = data.message;
            }
            else{
                document.getElementById("user_success").innerHTML = data.message;
            }
        })
        .catch(err => console.error(err));
}


function newEventAjax(event){
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value; 
    const time = document.getElementById("time").value; 
    const tag = document.getElementById("colors").value;
    const allday = document.getElementById("allday").checked;

    // Make a URL-encoded string for passing POST data:
    const data = { 'title': title, 'date': date, 'time': time, 'tag': tag,  'allday': allday, 'token': token};
   
    fetch("newEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if(!data.success){
                document.getElementById("event_success").innerHTML = data.message;
            }
            else{
                document.getElementById("title").value= "";
                document.getElementById("date").value= "";
                document.getElementById("time").value= "";
                document.getElementById("allday").checked= false;
                document.getElementById("time").style.display = "initial";
                document.getElementById("colors").value = "blue";
                document.getElementById("event_success").innerHTML = "";
                document.getElementById("event-form").style.display="none";
                updateCalendar();
            }
        })
        .catch(err => console.error(err));
}


function deleteEventAjax(event){
    const count = this.parentElement.parentElement.id;

    // Make a URL-encoded string for passing POST data:
    const data = { 'count': count, 'token': token};

    fetch("deleteEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
            document.getElementById(count).remove();
            }
        })
        .catch(err => console.error(err));
}

function display_edit(event){
    document.getElementById("create_btn").style.display = "none";
    document.getElementById("event-form").style.display = "none";
    document.getElementById("edit-event-form").style.display = "block";
    document.getElementById("edit-event-form").classList.add(this.parentElement.parentElement.id);
    document.getElementById("edittitle").value = this.parentElement.parentElement.childNodes[0].innerHTML;
    document.getElementById("editcolors").value = this.parentElement.parentElement.classList[1];
    
    if(this.parentElement.parentElement.childNodes[1].innerHTML == "All Day"){
       document.getElementById("allday_edit").checked= true;
       document.getElementById("edittime").value = "00:00";
       document.getElementById("edittime").style.display = "none";
    }
    else{
        document.getElementById("allday_edit").checked= false;
        document.getElementById("edittime").style.display = "block";
    }

    var date_mdy = this.parentElement.parentElement.parentElement.classList[0];
    var date_split = date_mdy.split("/", 3);
    var month = date_split[0];
    if(month.length < 2){
        month = "0" + month;
    }
    var day = date_split[1];
    if(day.length < 2){
        day = "0" + day;
    }
    var date_ymd = date_split[2] + "-" + month + "-" + day;
    document.getElementById("editdate").value = date_ymd;
    
    
    var timenums = this.parentElement.parentElement.childNodes[1].innerHTML.split(" ");

    
    if(this.parentElement.parentElement.childNodes[1].innerHTML != "All Day"){
        if(timenums[1] == "PM") {
            if(timenums[0].split(":")[0] == "12"){
                document.getElementById("edittime").value = "12:" + timenums[0].split(":")[1];
            }
            else{
                var timenumshours = timenums[0].split(":");
                var timenumshours_int = parseInt(timenumshours[0]) + 12;
                var timenumhours_string = timenumshours_int + ":" + timenumshours[1];
                document.getElementById("edittime").value = timenumhours_string;
            }
            
        }
        else if(timenums[0].split(":")[0] == "12"){
            document.getElementById("edittime").value = "00:" + timenums[0].split(":")[1];
        }
        else{
            document.getElementById("edittime").value = timenums[0];
        }
    }
   
}

function editEventAjax(event){
    const title = document.getElementById("edittitle").value;
    const date = document.getElementById("editdate").value; 
    const time = document.getElementById("edittime").value; 
    const tag = document.getElementById("editcolors").value;
    const allday = document.getElementById("allday_edit").checked;
    const count = this.parentElement.classList[0];

    // Make a URL-encoded string for passing POST data:
    const data = { 'count': count, 'token': token, 'title': title, 'date': date, 'time': time, 'tag': tag,'allday': allday};
  
    fetch("editEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                updateCalendar();
                document.getElementById("edit-event-form").style.display = "none";
                document.getElementById("create_btn").style.display = "block";
                document.getElementById("edittitle").value = "";
                document.getElementById("editdate").value = "";
                document.getElementById("edittime").value = "";
                document.getElementById("allday_edit").checked = false;
                document.getElementById("edittime").style.display = "initial";
                document.getElementById("editcolors").value = "blue";
                this.parentElement.classList.remove(count);
                document.getElementById("edit_event_success").innerHTML = "";
            }
            else{
                document.getElementById("edit_event_success").innerHTML = data.message;
            }
        })
        .catch(err => console.error(err));    
}

function cancelEvent(){
    document.getElementById("event-form").style.display = "none";
    document.getElementById("title").value= "";
    document.getElementById("date").value= "";
    document.getElementById("time").value= "";
    document.getElementById("colors").value = "blue";
    document.getElementById("allday").checked = false;
    document.getElementById("event_success").innerHTML = "";
}

function cancelEditEvent(){
    document.getElementById("edit-event-form").style.display = "none";
    this.parentElement.classList.remove(this.parentElement.classList[0]);
    document.getElementById("edittitle").value = "";
    document.getElementById("editdate").value = "";
    document.getElementById("edittime").value = "";
    document.getElementById("editcolors").value = "blue";
    document.getElementById("allday_edit").checked = false;
    document.getElementById("create_btn").style.display = "block";
    document.getElementById("edit_event_success").innerHTML = "";
}


function checkSession() {
    fetch("checkSession_ajax.php", {
            method: 'POST',
            // body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if(data.username == ""){
                loggedOut();
            }
            else{
                loggedIn(data.username);
                token = data.token;
            }
            
        })
        .catch(err => console.error(err));

}


function logoutAjax(event){
    fetch("logout_ajax.php", {
        method: 'POST',
        // body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(data => {
        loggedOut();
    })
    .catch(err => console.error(err));
}


function loggedIn(username){
    //add welcome screen and hide register
    document.getElementById("welcome_user").innerHTML = "Logged in as " + username;
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logout_btn").style.display = "block";
    document.getElementById("create_btn").style.display = "block";
    document.getElementById("filter-color").style.display = "block";

    updateCalendar();
    
}

function displayCreate(){
    document.getElementById("event-form").style.display = "block";
}

function loggedOut(){
     //delete welcome screen and display login and register
    document.getElementById("welcome_user").innerHTML = "";
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "block";
    document.getElementById("logout_btn").style.display = "none";
    document.getElementById("event-form").style.display = "none";
    document.getElementById("create_btn").style.display = "none";
    document.getElementById("filter-color").style.display = "none";

    updateCalendar();
    
}

function filterTag(){
    var blue = document.getElementsByClassName("blue");
    var pink = document.getElementsByClassName("pink");
    var yellow = document.getElementsByClassName("yellow");
    var green = document.getElementsByClassName("green");
    var value = document.getElementById("filter-colors").value;

    if(value == "blue"){
        for(var b=0; b<blue.length; b++){
            blue[b].style.display = "block";
        }
        for(var p=0; p<pink.length; p++){
            pink[p].style.display = "none";
        }
        for(var y=0; y<yellow.length; y++){
            yellow[y].style.display = "none";
        }
        for(var g=0; g<green.length; g++){
            green[g].style.display = "none";
        }
    }

    if(value == "pink"){
        for(var b=0; b<blue.length; b++){
            blue[b].style.display = "none";
        }
        for(var p=0; p<pink.length; p++){
            pink[p].style.display = "block";
        }
        for(var y=0; y<yellow.length; y++){
            yellow[y].style.display = "none";
        }
        for(var g=0; g<green.length; g++){
            green[g].style.display = "none";
        }
    }

    if(value == "yellow"){
        for(var b=0; b<blue.length; b++){
            blue[b].style.display = "none";
        }
        for(var p=0; p<pink.length; p++){
            pink[p].style.display = "none";
        }
        for(var y=0; y<yellow.length; y++){
            yellow[y].style.display = "block";
        }
        for(var g=0; g<green.length; g++){
            green[g].style.display = "none";
        }
    }

    if(value == "green"){
        for(var b=0; b<blue.length; b++){
            blue[b].style.display = "none";
        }
        for(var p=0; p<pink.length; p++){
            pink[p].style.display = "none";
        }
        for(var y=0; y<yellow.length; y++){
            yellow[y].style.display = "none";
        }
        for(var g=0; g<green.length; g++){
            green[g].style.display = "block";
        }
    }

    if(value == "none"){
        for(var b=0; b<blue.length; b++){
            blue[b].style.display = "block";
        }
        for(var p=0; p<pink.length; p++){
            pink[p].style.display = "block";
        }
        for(var y=0; y<yellow.length; y++){
            yellow[y].style.display = "block";
        }
        for(var g=0; g<green.length; g++){
            green[g].style.display = "block";
        }
    }
}

// Change the year when the "next" button is pressed
document.getElementById("next_btn").addEventListener("click", function(event){
    currentYear++; 
    updateYear();
}, false);

// Change the year when the "previous" button is pressed
document.getElementById("prev_btn").addEventListener("click", function(event){
    currentYear--; 
    updateYear();
}, false);


function updateYear(){
    for (var m=0; m<12; m++) {
        var currentMO = new Month(currentYear, m);
        
        document.getElementById("year").innerHTML = currentMO.year;
        var cal = document.getElementById(m);
    
        for(var i=cal.childNodes.length-1; i>=2; i--){
            cal.removeChild(cal.childNodes[i]);
        }

        var weeks = currentMO.getWeeks();
        for(var i=0; i<weeks.length; i++){
            var tr = document.createElement("tr");
            for(var j=0; j<weeks[i].getDates().length; j++){
                var td = document.createElement("td");
                td.innerHTML = weeks[i].getDates()[j].getDate();
                tr.appendChild(td);
            }
            cal.appendChild(tr);
        }
    }
}

function viewYear() {
    document.getElementById("year-div").style.display = "block";
    document.getElementById("regular-div").style.display = "none"; 
    document.getElementById("year-view-button").style.display = "none";
    document.getElementById("event-form").style.display = "none";
    document.getElementById("edit-event-form").style.display = "none";
    updateYear();
}

function viewMonth() {
    currentMonth = new Month(currentYear, parseInt(this.childNodes[3].id));
    document.getElementById("regular-div").style.display = "block"; 
    document.getElementById("year-div").style.display = "none";
    document.getElementById("year-view-button").style.display = "block";
    updateCalendar();
}

function returnToLast() {
    document.getElementById("regular-div").style.display = "block"; 
    document.getElementById("year-div").style.display = "none";
    document.getElementById("year-view-button").style.display = "block";
    updateCalendar();
}

function allDayCheck() {
    if (this.checked) {
        document.getElementById("time").value = "00:00";
        document.getElementById("time").style.display = "none";
    }
    else {
        document.getElementById("time").value = "";
        document.getElementById("time").style.display = "initial";
    }
}

function allDayCheck_edit() {
    if (this.checked) {
        document.getElementById("edittime").value = "00:00";
        document.getElementById("edittime").style.display = "none";
    }
    else {
        document.getElementById("edittime").value = "";
        document.getElementById("edittime").style.display = "initial";
    }
}