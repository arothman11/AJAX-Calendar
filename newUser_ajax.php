<?php

    require 'database.php';

    ini_set("session.cookie_httponly", 1);

    session_start();

    $previous_ua = @$_SESSION['useragent'];
    $current_ua = $_SERVER['HTTP_USER_AGENT'];

    if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
        die("Session hijack detected");
    }else{
        $_SESSION['useragent'] = $current_ua;
    }

    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);
    

    //Variables can be accessed as such:
    $newUsername = htmlentities((string)$json_obj['newUsername']);
    //checking username
    if( !preg_match('/^[\w_\-]+$/', $newUsername) ){
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid Username."
        ));
        exit;
    }
        
    $stmt1 = $mysqli->prepare("SELECT COUNT(*), username FROM users WHERE username=?");

    // Bind the parameter
    $stmt1->bind_param('s', $newUsername);
    $stmt1->execute();

    // Bind the results
    $stmt1->bind_result($cnt, $user_id);
        
    $stmt1->fetch();

    if($cnt == 1){
        echo json_encode(array(
            "success" => false,
            "message" => "Username already taken Please try again"
        ));
        exit;
     }

     $stmt1->close();
    
    
    $newPassword = htmlentities((string)$json_obj['newPassword']);
        if( !preg_match('/^[\w_\-]+$/', $newPassword) ){
            echo json_encode(array(
                "success" => false,
                "message" => "Invalid Password. Please try again."
            ));
            exit;
        }


    $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);
    
    $stmt = $mysqli->prepare("insert into users (username, hashed_password) values (?, ?)");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed"
        ));
    }
    else {
        echo json_encode(array(
            "success" => true,
            "message" => "New user successfully created!"
        ));
    }

    $stmt->bind_param('ss',  $newUsername, $passwordHash);
    $stmt->execute();
    $stmt->close();

?>