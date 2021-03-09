<!DOCTYPE html>
<html lang="en">
<head>
    <title>Module 5 Group</title>
    <link rel="stylesheet" href="stylesheet.css">
</head>
<body>
    <div id="login">
    <h1>Log In</h1>
    
    <!-- //form for logging in -->
    <p>Please enter your username in the text field below.</p>
    <form action="login.php" method="POST">
        <label for="username">Username</label>
        <input type="text" name="username" id="username">

        <label for="password">Password</label>
        <input type="password" name="password" id="password">

        <input type="submit" id="login_btn">
        
   </form>
   </div>
    
    <!-- //button to create a new user -->
    <form action="newUser.php">
        <label for="new">Don't have an account?</label>
        <button name="new" id="new">Create New Account</button>
    </form>

    <?php

        require 'database.php';
        session_start();

        header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

        //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
        $json_str = file_get_contents('php://input');
        //This will store the data into an associative array
        $json_obj = json_decode($json_str, true);

        //Variables can be accessed as such:
        $username = $json_obj['username'];
        $password = $json_obj['password'];
        //This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

        // Check to see if the username and password are valid.  (You learned how to do this in Module 3.)

        if( /* valid username and password */ ){
            session_start();
            $_SESSION['username'] = $username;
            $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

            echo json_encode(array(
                "success" => true
            ));
            exit;
        }else{
            echo json_encode(array(
                "success" => false,
                "message" => "Incorrect Username or Password"
            ));
            exit;

        

        // Use a prepared statement
        $stmt = $mysqli->prepare("SELECT COUNT(*), username, hashed_password FROM users WHERE username=?");

        // Bind the parameter
        $stmt->bind_param('s', $user);
        $user = $_POST['username'];
        $stmt->execute();

        // Bind the results
        $stmt->bind_result($cnt, $user_id, $pwd_hash);
        
        $stmt->fetch();

        $pwd_guess = $_POST['password'];
        // Compare the submitted password to the actual password hash

        if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
            // Login succeeded!
            $_SESSION['user_id'] = $user_id;
            $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
            header("Location: main.php");
            // Redirect to your target page
        } else if (!empty($_POST)){
            echo '<p>Login Failed</p>';
            // Login failed; redirect back to the login screen
        }
?>

<script src="ajax.js"></script>

</body>
</html>