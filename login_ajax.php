<?php

        require 'database.php';
        session_start();

        header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

        //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
        $json_str = file_get_contents('php://input');
        console.log($json_str);
        //This will store the data into an associative array
        $json_obj = json_decode($json_str, true);
        console.log($json_obj);

        //Variables can be accessed as such:
        $username = $json_obj['username'];
        console.log($username);
        $password = $json_obj['password'];
        console.log($password);

        //This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

        // Check to see if the username and password are valid.  (You learned how to do this in Module 3.)

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
            exit;}

?>