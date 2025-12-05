<?php
// Database configuration
$host = "localhost";
$user = "root";
$password = "";
$dbname = "arklink";

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
file_put_contents("db_debug.log", "DB connected successfully: " . date("Y-m-d H:i:s") . "\n", FILE_APPEND);
?>
