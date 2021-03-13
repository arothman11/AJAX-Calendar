
document.getElementById("newuser_btn").addEventListener("click", newUserAjax, false); 
document.getElementById("login_btn").addEventListener("click", loginAjax, false);
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false);
document.getElementById("submit_event").addEventListener("click", newEventAjax, false);
var token;

checkSession();

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
        })
        .catch(err => console.error(err));

}


function newEventAjax(event){
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value; 
    const time = document.getElementById("time").value; 

    // Make a URL-encoded string for passing POST data:
    const data = { 'title': title, 'date': date, 'time': time, 'token': token};

    fetch("newEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("title").value= "";
            document.getElementById("date").value= "";
            document.getElementById("time").value= "";
        })
        .catch(err => console.error(err));
}


function checkSession() {
    fetch("checkSession_ajax.php", {
            method: 'POST',
            // body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            loggedIn(data.username);
            token = data.token;
        })
        .catch(err => console.error(err));

}



function logoutAjax(event){
    fetch("logout_ajax.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
    loggedOut();
}


function loggedIn(username){
    document.getElementById("welcome_user").innerHTML = "Hello " + username;
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logout_btn").style.display = "block";
    document.getElementById("event-form").style.display = "block";
}

function loggedOut(){
    document.getElementById("welcome_user").innerHTML = "";
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "block";
    document.getElementById("logout_btn").style.display = "none";
}

