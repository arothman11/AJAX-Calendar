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
    
    
    if(isset($_SESSION['username'])) {
        $user_id = (string)$_SESSION['username'];
        echo json_encode(array(
            "username" => $user_id,
            "token" => $_SESSION['token']
        ));
    }
    else{
        echo json_encode(array(
            "username" => "",
            "token" => ""
        ));
    }

        
        exit;
?>