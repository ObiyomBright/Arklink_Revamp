<?php


// Database configuration
$host = "localhost";
$user = "lofloxy2_lofloxy2revamp";
$password = "lofloxyarklink123";
$dbname = "lofloxy2_revamp";

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Stop execution and return JSON error
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(["error" => "Database Connection failed: " . $conn->connect_error]);
    exit;
}

// Optional: set charset to avoid encoding issues
$conn->set_charset("utf8mb4");
?>
