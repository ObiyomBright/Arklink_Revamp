<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "config.php";

$response = [];

$response['companies'] = array_column(
    $conn
        ->query("SELECT DISTINCT company FROM sanitary ORDER BY company ASC")
        ->fetch_all(MYSQLI_ASSOC),
    'company'
);

echo json_encode($response);
