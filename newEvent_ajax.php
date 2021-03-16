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

    if(!hash_equals($_SESSION['token'], $json_obj['token'])){
        die("Request forgery detected");
    }
    
    
    if(isset($_SESSION['username'])){
        $username = $_SESSION["username"];
    }
    else{
        echo json_encode(array(
            "success" => false,
            "message" => "username session variable is not set"
        ));
    }

    $title =  htmlentities((string)$json_obj['title']);
    $date = htmlentities((string)$json_obj['date']);
    $time = htmlentities((string)$json_obj['time']);
    $tag = $json_obj['tag'];
    $allday = $json_obj['allday'];

    if($title == "" || $date == "" || $time == ""){
        echo json_encode(array(
            "success" => false,
            "message" => "Please fill in entire form"
        ));
    }
    else{
        preg_match_all('/\\d{2}/', $time, $time_matches);
        preg_match_all('/\\d{2,4}/', $date, $date_matches);
        //php functions that convert date and time strings into datetime that mysql takes in
        $datetime = date("Y-m-d H:i:s", mktime($time_matches[0][0], $time_matches[0][1], 0, $date_matches[0][1], $date_matches[0][2], $date_matches[0][0]));

        
        $stmt = $mysqli->prepare("insert into events (username, title, date, tag, allday) values (?, ?, ?, ?, ?)");
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "Failed"
            ));
        }
        else {
            echo json_encode(array(
                "success" => true,
                "message" => "Successfully Created!"
            ));
        }
       
        $stmt->bind_param('ssssi', $username, $title, $datetime, $tag, $allday);
        $stmt->execute();
        $stmt->close();

    }
    
    
?>